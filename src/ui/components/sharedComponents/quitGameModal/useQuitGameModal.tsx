import { useState } from "react";


export const useQuitGameModal = () => {
      const [isOpenModal, setIsOpenModal] = useState(false);
      const open = () => {
        setIsOpenModal(true)
      }
      const close = () => {
        setIsOpenModal(false)
      }
    return {open, close, isOpenModal}
}