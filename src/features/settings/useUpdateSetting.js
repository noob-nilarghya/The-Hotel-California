import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateSetting } from "../../services/apiSettings";

// Update (mutate) operation of React-query using custom hook

export function useUpdateSetting(){
    const queryClient= useQueryClient();
    const {isLoading: isUpdatingSetting, mutate: mutateUpdateSetting} = useMutation({
        mutationFn: (newSetting) => updateSetting (newSetting),
        onSuccess: () => {
            toast.success("Settings updated successfully");
            queryClient.invalidateQueries({
                queryKey: ['settings']
            });
        },
        onError: (err) => toast.error(err.message)
    });

    return {isUpdatingSetting, mutateUpdateSetting}; // exposing necessery tools so that we can use it in 'UpdateSettingsForm' after import
}
