import { useContext, useEffect, useState } from "react"
import { useAppStore } from "../../../application/store/useAppStore";
import { ThemeContext } from "../../../application/context/themeContext";
import { ArrowLongRightIcon, InformationCircleIcon, QuestionMarkCircleIcon } from "@heroicons/react/16/solid";
import { blackDragon, whiteDragon } from "../../../assets/img";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { diffOptions } from "../../../domain";
import { useGameFinishView } from "./useGameFinishView";
import PvpWinDetails from "./_components/PvpWinDetails";
import WinTitle from "./_components/WinTitle";

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
    return (
      <div>
        <h1>Cargando...</h1>
      </div>
    )
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
