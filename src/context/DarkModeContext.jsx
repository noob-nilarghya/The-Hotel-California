import { createContext } from "react";
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { useContext } from "react";
import { useEffect } from "react";

const DarkModeContext = createContext();

function DarkModeProvider({children}){
    // const [isDarkMode, setIsDarkMode] = useLocalStorageState(false, 'isDarkMode');
    // Rather instead of false, we want to use OS current theme as default value of dark-mode
    const [isDarkMode, setIsDarkMode] = useLocalStorageState(window.matchMedia('(prefers-color-scheme: dark)').matches, 'isDarkMode');
    // This 'isDarkMode' become value and 'setIsDarkMode' become setValue of 'useLocalStorageState'

    function toggleDarkMode(){
        setIsDarkMode((dark) => !dark);
    }

    useEffect(function(){
        if(isDarkMode){
            document.documentElement.classList.add('dark-mode');
            document.documentElement.classList.remove('light-mode');
        }
        else{
            document.documentElement.classList.add('light-mode');
            document.documentElement.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    return (
        <DarkModeContext.Provider value={{isDarkMode, toggleDarkMode}}>
            {children}
        </DarkModeContext.Provider>
    );
}

function useDarkMode(){
    const context = useContext(DarkModeContext);
    if(!context) { throw new Error ("Dark mode Context was use outside of Provider"); }
    return context;
}

export { DarkModeProvider, useDarkMode };