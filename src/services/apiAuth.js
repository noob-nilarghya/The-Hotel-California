import supabase from './supabase';

export async function signup({fullName, email, password}){
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                fullName: fullName,
                avator: ""
            }
        }
    });

    if(error){ throw new Error(error.message); }
    return data;
}

export async function login({email, password}){
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if(error){
        throw new Error(error.message);
    }
    return data;
}

// see https://supabase.com/docs/reference/javascript/installing
export async function getCurrentUser(){
    
    const { data : session, error } = await supabase.auth.getSession(); // Get the session data (from local storage/cache/session)
    if(!session.session) { return null; } // nothing is stored in local storage (JWT token expired)

    // We have info in session. So, verify user from session in supabase
    const { data: { user }, error: errUser } = await supabase.auth.getUser(); // Get the logged in user with the current existing session

    if(errUser){ throw new Error(errUser.message); }
    return user;
}

// https://qtwzupmuwhxjnmcfvnek.supabase.co/storage/v1/object/public/avatars/default-user.jpg
export async function updateUserData({ fullName, avatar, oldImg }){ // except password
    let imageURL; let imageName;
    // User haven't updated their avatar
    if(!avatar || (typeof (avatar) === 'string') ){
        imageURL= (avatar) ? avatar : "";
    }
    if(typeof (avatar) === 'object'){
        imageName = `${Math.random()}-${avatar.name}`.replaceAll('/','');
        imageURL= `https://qtwzupmuwhxjnmcfvnek.supabase.co/storage/v1/object/public/avatars/${imageName}`;
    }

    const { data, error } = await supabase.auth.updateUser({
        data: {
            fullName: fullName,
            avatar: imageURL
        }
    }); 

    if(error){ throw new Error(error.message); }

    // User updated image. Now remove oldImage from bucket and upload new updatedImage into bucket
    if(typeof (avatar) === 'object'){
        // Now delete the old cabin image from bucket 'cabin-images'
        if(oldImg && oldImg.startsWith('https://qtwzupmuwhxjnmcfvnek.supabase.co')){
            const temp= oldImg.split('/'); const imgFileName= temp[temp.length-1]; // imgfileName retrieved 

            const { error: storageErrorRemove } = await supabase.storage.from('avatars').remove([imgFileName]);
            if (storageErrorRemove) {
                console.error(storageErrorRemove);
                throw new Error("Old cabins image could not be deleted from bucket");
            } 
        }

        // Now upload the actual updated image to supabase bucket 'avatars'
        // Upload file using standard upload
        const { error: storageErrorUpload } = await supabase.storage.from('avatars').upload(imageName, avatar); // imgName, imgFile

        if (storageErrorUpload) {
            console.error(storageErrorUpload);
            throw new Error("New avatar image could not be updated");
        } 
    }
    return data;
}

export async function updateUserPassword({ password }){ // password updation of authenticated user
  
    const { data, error } = await supabase.auth.updateUser({password: password})

    if(error){ throw new Error(error.message); }

    return data;
}

export async function logout(){
    const { error } = await supabase.auth.signOut();

    if(error){ throw new Error("Error logging out"); }
    return;
}
  