import { Fragment, useContext } from 'react'
import { Popover, Transition } from '@headlessui/react'
import ThemeToggle from './ThemeToggle'
import NavItems from './NavItems'
import { darkIsologo } from "../../../../assets/logos"
import { lightIsologo } from "../../../../assets/logos"
import { ThemeContext } from '../../../../application/context/themeContext'


type NavItemsProps = {
  options: Record<string, () => void>
}
export default function NavMenu({ options }: NavItemsProps) {
  const { theme } = useContext(ThemeContext);
  return (
    <Popover className="relative">
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 p-1 rounded-lg hover:bg-[var(--base-100)]/30 transition-colors focus:outline-none cursor-pointer">
        <img className="sm:hidden xs:flex h-8" src={theme === 'light' ? darkIsologo : lightIsologo} alt="Isotipo" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-75"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute right-0 z-10 mt-5 flex w-sm lg:max-w-min">
          <div className=" opaque-card w-full xs shrink rounded-xl bg-white p-4 text-sm leading-6 space-y-3">
            <NavItems options={options} />
            <ThemeToggle />
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}