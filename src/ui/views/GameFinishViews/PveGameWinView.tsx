import { useEffect } from "react";
import { blackDragon, whiteDragon } from "../../../assets/img";
import { motion } from "framer-motion";
import { useGameFinishView } from "./useGameFinishView";
import WinTitle from "./_components/WinTitle";
import PveWinDetails from "./_components/PveWinDetails";

export default function PveGameWinView() {
  const {
    id,
    loading,
    showDetails,
    setShowDetails,
    theme,
    handleNavigate,
    navigate
  } = useGameFinishView();

  useEffect(() => {
    if (!id) {
      handleNavigate()
    }
  }, [id, navigate]);


  return (
    <>
      <motion.div className="win-dragon-img pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01]
        }}
      >
        <img src={theme === "light" ? blackDragon : whiteDragon} alt="dragon" className={showDetails ? `opacity-60` : ''} />
      </motion.div>

      {showDetails
        ? <PveWinDetails />
        : <WinTitle setShowDetails={setShowDetails} win={true}/>
      }

    </>
  )
}
