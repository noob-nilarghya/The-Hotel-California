import supabase from "./supabase";

export async function getCabins() { // read all booking 
    // these code is coming from supabase
    const { data, error } = await supabase 
        .from('cabins')
        .select('*');

    if(error){
        console.error(error);
        throw new Error("Cabins could not be loaded");
    }
    return data;
}


export async function createCabin(newCabin){
    const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll('/','');
    const imageURL= `https://qtwzupmuwhxjnmcfvnek.supabase.co/storage/v1/object/public/cabin-images/${imageName}`;

    // First of all insert new row in 'cabins table'
    const { data, error } = await supabase
    .from('cabins')
    .insert([ {...newCabin, image: imageURL} ])
    .select();

    if(error){
        console.error(error);
        throw new Error("Cabins could not be created");
    }

    // Now upload the actual image to supabase bucket 'cabin-images'
    // Upload file using standard upload
    const { error: storageError } = await supabase.storage.from('cabin-images').upload(imageName, newCabin.image); // imgName, imgFile

    // Delete this row from 'cabins table', if there is some error in uploading image
    if (storageError) {
        await supabase.from('cabins').delete().eq('id', data.id); // copied from deleteCabin below 😂
        console.error(storageError);
        throw new Error("Cabins image could not be uploaded hence cabin is deleted");
    } 

    return data;
}

export async function editCabin(newCabin, id, oldImg){
    let imageURL; let imageName;
    if(typeof (newCabin.image) === 'object'){ // user had updated photo
        imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll('/','');
        imageURL= `https://qtwzupmuwhxjnmcfvnek.supabase.co/storage/v1/object/public/cabin-images/${imageName}`;
    }
    if(typeof (newCabin.image) === 'string'){ // user didnt updated photo
        imageURL= newCabin.image;
    }

    const { data, error } = await supabase
    .from('cabins')
    .update({...newCabin, image: imageURL})
    .eq('id', id)
    .select()

    if(error){
        console.error(error);
        throw new Error("Cabins could not be updated");
    }

    // Case2: User updated image. Now remove oldImage from bucket and upload new updatedImage into bucket
    if(typeof (newCabin.image) ==='object'){

        // Now delete the old cabin image from bucket 'cabin-images'
        const temp= oldImg.split('/'); const imgFileName= temp[temp.length-1]; // imgfileName retrieved 

        const { error: storageErrorRemove } = await supabase.storage.from('cabin-images').remove([imgFileName]);
        if (storageErrorRemove) {
            console.error(storageErrorRemove);
            throw new Error("Old cabins image could not be deleted from bucket");
        } 

        // Now upload the actual updated image to supabase bucket 'cabin-images'
        // Upload file using standard upload
        const { error: storageErrorUpload } = await supabase.storage.from('cabin-images').upload(imageName, newCabin.image); // imgName, imgFile

        if (storageErrorUpload) {
            console.error(storageErrorUpload);
            throw new Error("New cabins image could not be updated");
        } 
    }

    return data;
}

export async function deleteCabin(id){ // delete bookin with perticlar id

    // First of all get that specfic cabin using id from 'cabins-table' to get the cabin image file name
    const { data, error: errFetchingData } = await supabase.from('cabins').select("*").eq('id', id);
    if(errFetchingData){
        console.error(errFetchingData);
        throw new Error("Error fetching cabin details from Database");
    }
    
    const temp= data[0].image.toString().split('/'); const imgFileName= temp[temp.length-1]; // imgfileName retrieved 
    
    // Now delete entry (or row from 'cabins-table') 
    const { error } = await supabase
    .from('cabins')
    .delete()
    .eq('id', id); // colName, colValue

    if(error){
        console.error(error);
        throw new Error("Cabins could not be deleted");
    }

    // Now delete the cabin image from bucket 'cabin-images'
    const { error: storageError } = await supabase.storage.from('cabin-images').remove([imgFileName]);
    if (storageError) {
        console.error(storageError);
        throw new Error("Cabins image could not be deleted from bucket");
    } 

    return;
}