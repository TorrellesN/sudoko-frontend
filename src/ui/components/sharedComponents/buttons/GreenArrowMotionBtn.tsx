import { ArrowLongRightIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";

export default function GreenAnimatedBtn({ onClick, text }: { onClick: () => void, text: string }) {

    const arrowVariants = {
        initial: { x: -4, opacity: 0 },
        hover: { x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    };
    return (
        <motion.div
            className="flex flex-row text-xl mt-4 font-semibold cursor-pointer rounded-lg shadow-md  bg-[var(--base-100)]/50 hover:bg-[var(--base-100)] transition-colors ease-in-out"
            onClick={onClick}

            initial="initial"
            whileHover="hover"
            whileTap={{ scale: 0.95 }}

        >
            <div className="bg-blue-gradient w-2 px-1 h-15 overflow-hidden rounded-tl-lg rounded-bl-lg"></div>

            <div className="flex-1 flex flex-row align-center justify-center gap-2 px-10 py-4 font-medium">
                <p>{text}</p>

                <motion.div variants={arrowVariants}
                >
                    <ArrowLongRightIcon className="h-6 w-6 text-gray-500" />
                </motion.div>
            </div>
        </motion.div>
    )
}
