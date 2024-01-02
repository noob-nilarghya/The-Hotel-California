import { useDarkMode } from '../context/DarkModeContext';
import ButtonIcon from './ButtonIcon';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2';

// This dark mode toggle needs a global state (the only global UI state in entire app). So, we will use contextAPI for that
// We implemented that context [see 'src/contex/DarkModeContext']
function DarkModeToggle() {

    const {isDarkMode, toggleDarkMode} = useDarkMode();

    return (
        <ButtonIcon onClick={toggleDarkMode}>
            {(isDarkMode) ? <HiOutlineMoon /> : <HiOutlineSun />}
        </ButtonIcon>
    );
}

export default DarkModeToggle;
