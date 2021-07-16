import { Popover, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment } from 'react'

interface PopoverProps {
    className?: string;
    position?: "left" | "right" | "center";
    btnText: React.ReactNode;
    children: React.ReactNode;
}

const PopoverComponent = ({ position, className, btnText, children }: PopoverProps) => {
    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <Popover.Button className={className}>
                        {btnText}
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className={clsx("absolute z-10 max-w-sm mt-3 lg:max-w-3xl", {
                            "left-0": position === "left",
                            "right-0": position === "right",
                            "left-1/2": position === "center"
                        })}>
                            {children}
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}

PopoverComponent.defaultProps = {
    className: "",
    position: "left",
    btnText: "",
    children: "",
}

export default PopoverComponent
