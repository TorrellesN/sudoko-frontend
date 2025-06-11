import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";
import { darkIsologo, lightIsologo } from "../../../assets/logos";

const RollingSquare = ({ theme }: { theme: string }) => {
  const controls = useAnimationControls();

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        await controls.start({ rotate: 90, x: 10, transition: { duration: 0.5 } });
        await controls.start({ x: 0, transition: { duration: 0.6, ease: "easeOut" } });

        await controls.start({ rotate: 180, x: 10, transition: { duration: 0.5 } });
        await controls.start({ x: 0, transition: { duration: 0.6, ease: "easeOut" } });


        await controls.start({ rotate: 270, x: 10, transition: { duration: 0.5 } });
        await controls.start({ x: 0, transition: { duration: 0.6, ease: "easeOut" } });

        await controls.start({ rotate: 360, x: 10, transition: { duration: 0.5 } });
        await controls.start({ x: 0, transition: { duration: 0.6, ease: "easeOut" } });



        controls.set({ rotate: 0 }); // Reset para volver a empezar
      }
    };

    sequence();
  }, [controls]);

  return (
    <motion.div
      className="h-6 w-6"
      animate={controls}
      style={{ originX: 0.5, originY: 0.5 }}
    >
      <img src={theme === 'light' ? darkIsologo : lightIsologo} alt="rolling square" />
    </motion.div>
  );
};

export default RollingSquare;
