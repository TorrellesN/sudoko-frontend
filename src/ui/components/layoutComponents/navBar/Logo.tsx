import { useContext } from "react"
import { ThemeContext } from "../../../../application/context/themeContext";
import { lightIsotype } from "../../../../assets/logos";
import { darkIsotype } from "../../../../assets/logos";
import { lightLogotype } from "../../../../assets/logos";
import { darkLogotype } from "../../../../assets/logos";



export default function Logo() {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <img className="sm:hidden xs:flex h-5" src={theme === 'light' ? darkIsotype : lightIsotype} alt="Isotipo" />
      <img className="hidden sm:flex h-5" src={theme === 'light' ? darkLogotype : lightLogotype} alt="Isotipo" />
    </>
  )
}
