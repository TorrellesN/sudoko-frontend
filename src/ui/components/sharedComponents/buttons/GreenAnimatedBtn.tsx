import { ArrowLongRightIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";

export default function GreenAnimatedBtn({ onClick, text, disabled }: { onClick: () => void, text: string, disabled?: boolean }) {

    return (
        <motion.button
            className="flex flex-row text-xl mt-4 w-full font-semibold cursor-pointer rounded-lg shadow-md  bg-[var(--base-100)]/50 hover:bg-[var(--base-100)] transition-colors ease-in-out"
            onClick={onClick}
           

            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial="initial"

        >
            <div className="bg-blue-gradient w-2 px-1 h-15 overflow-hidden rounded-tl-lg rounded-bl-lg"></div>

            <div className="flex-1 flex flex-row align-center justify-center gap-4 px-10 py-4 font-medium">
                <p className="whitespace-nowrap">{text}</p>
                <ArrowLongRightIcon className="h-6 w-6 text-[var(--primary-text)] mt-0.4" />
            </div>
        </motion.button>
    )
}
