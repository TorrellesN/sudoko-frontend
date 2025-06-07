import { ArrowUturnLeftIcon } from '@heroicons/react/16/solid'

export default function NavigateBackBtn() {
    return (
        <button
            className='absolute w-7 h-7 top-3 left-3 rounded-full cursor-pointer transition-colors hover:bg-black/10 flex items-center justify-center'
            onClick={() => window.history.back()}
        >
            <ArrowUturnLeftIcon className="h-5 w-5 md:h-6 md:w-6 text-[var(--secondary-text)]" />
        </button>
    )
}
