import { motion } from 'framer-motion'
import { fireCombo1, fireCombo2, fireCombo3 } from '../../../assets/comboIcons'
import { fireCombo1wBg, fireCombo2wBg, fireCombo3wBg } from '../../../assets/comboIcons-v2'

export default function FireComboIcon({comboAcc}: {comboAcc: number}) {
  return (
    <div>
      <motion.img 
      key={comboAcc} // Key changes trigger re-render and animation
      className="w-[1.3rem] h-[1.3rem]" 
      src={comboAcc >= 10 ? fireCombo3wBg : comboAcc >= 5 ? fireCombo2wBg : fireCombo1wBg} 
      alt="Combo icon"
      initial={{ scale: 0.8, opacity: 0.5 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
      />
    </div>
  )
}
