import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../services/apiSettings";

// Read operation of React-query using custom hook

export function useSettings() {
    const {isLoading, error, data: settingsData} = useQuery({
        queryKey: ['settings'],
        queryFn: getSettings
    });

    return {isLoading, error, settingsData}; // exposing necessery tools so that we can use it in 'UpdateSettingsForm' after import
}
