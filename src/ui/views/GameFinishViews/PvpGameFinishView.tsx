import { useEffect } from "react";
import { useAppStore } from "../../../application/store/useAppStore";
import { blackDragon, whiteDragon } from "../../../assets/img";
import { motion } from "framer-motion";
import { useGameFinishView } from "./useGameFinishView";
import PvpWinDetails from "./_components/PvpWinDetails";
import WinTitle from "./_components/WinTitle";
import LoadingText from "../../components/sharedComponents/LoadingText";

export default function PvpGameFinishView() {
  const {
    id,
    loading,
    showDetails,
    setShowDetails,
    theme,
    handleNavigate,
    navigate
  } = useGameFinishView();
  const win = useAppStore(state => state.win);

  useEffect(() => {
    if (!id) {
      handleNavigate()
    }
  }, [id, navigate]);

  if (loading) {
    return <LoadingText />;
  }

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
        ? <PvpWinDetails />
        : <WinTitle setShowDetails={setShowDetails} win={win} />
      }

    </>
  )
}
