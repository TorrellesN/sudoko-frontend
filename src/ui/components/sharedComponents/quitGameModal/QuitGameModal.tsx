import { Button, Dialog, DialogPanel, DialogTitle, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

type quitGameModalProps = {
    isOpenModal: boolean,
    close: () => void,
    handleQuit: () => void
}

export default function QuitGameModal({ isOpenModal, close, handleQuit }: quitGameModalProps) {
    const navigate = useNavigate();
    return (
        <Transition show={isOpenModal} as={Fragment}>
            <Dialog as="div" className="relative z-10 focus:outline-none" onClose={close}>
                {/* Backdrop transition */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    {/* Gray overlay/backdrop */}
                    <div className="fixed inset-0 bg-gray-600/40 backdrop-blur-[2px]" aria-hidden="true" />
                </Transition.Child>
            
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel
                                className="w-full max-w-md rounded-xl bg-[var(--base-100)]/70 p-6 backdrop-blur-md shadow-xl border border-gray-600/30"
                            >
                                <DialogTitle as="h3" className="text-md/6 font-bold text-[var(--text-secondary)]">
                                    Abandonar partida
                                </DialogTitle>
                                <p className="mt-2 text-sm/6 font-medium text-[var(--text-secondary)]/50">
                                    ¿Estás seguro de que quieres abandonar la partida? No podrás volver a ella.
                                </p>
                                <div className="mt-4 flex space-x-3">
                                    <Button
                                        className="inline-flex items-center gap-2 rounded-md bg-[var(--secondary-color)] hover:bg-[var(--secondary-color)]/20 px-3 py-1.5 text-sm/6 font-semibold text-[var(--light-color)] shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-red-700 data-open:bg-red-800 transition"
                                        onClick={() => {
                                            handleQuit();
                                            navigate('/');
                                        }}
                                    >
                                        Aceptar
                                    </Button>
                                    <Button
                                        className="inline-flex items-center gap-2 rounded-md bg-[var(--border-color)] px-3 py-1.5 text-sm/6 font-semibold text-[var(--light-color)] shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700 transition"
                                        onClick={close}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </DialogPanel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
