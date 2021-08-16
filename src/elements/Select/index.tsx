import React, { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/solid'
import { ChevronDownIcon } from '@heroicons/react/outline'
import clsx from 'clsx'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

interface SelectProps {
    options: any[];
    onChange?: (selected: string | number) => void;
    valueKey?: string;
    labelKey?: string;
    label?: string;
    value: string | number | null;
    error?: boolean;
    errorMessage?: string;
}

const Select = React.forwardRef<any, SelectProps>((props, ref) => {
    const {
        options,
        onChange,
        valueKey,
        labelKey,
        value,
        label,
        error,
        errorMessage
    } = props;

    const getSelectedLabel = () => {
        if (!valueKey) return value;
        const selectedObj = options.find((r) => r[valueKey] === value);
        return selectedObj ? selectedObj[labelKey] : "Select an option";
    };

    return (
        <>
            <Listbox value={value} onChange={onChange}>
                {({ open }) => (
                    <>
                        {label && <Listbox.Label className="block text-sm font-medium text-gray-700">{label}</Listbox.Label>}
                        <div className="relative mt-1">
                            <Listbox.Button className={clsx(
                                error
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-primary focus:border-primary',
                                'relative w-full py-2 pl-3 pr-10 text-left bg-white border rounded-md shadow-sm cursor-default',
                                'focus:outline-none focus:ring-1 sm:text-sm'
                            )}>
                                <span className="block truncate">{getSelectedLabel()}</span>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <ChevronDownIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                                </span>
                            </Listbox.Button>

                            <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options
                                    static
                                    className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                                >
                                    {options.map((option, index) => (
                                        <Listbox.Option
                                            key={option.id || index}
                                            className={({ active }) =>
                                                classNames(
                                                    active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                                    'cursor-default select-none relative py-2 pl-3 pr-9'
                                                )
                                            }
                                            value={valueKey ? option[valueKey] : option}
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                        {labelKey ? option[labelKey] : option}
                                                    </span>

                                                    {selected ? (
                                                        <span
                                                            className={classNames(
                                                                active ? 'text-white' : 'text-indigo-600',
                                                                'absolute inset-y-0 right-0 flex items-center pr-4'
                                                            )}
                                                        >
                                                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </>
                )}
            </Listbox>
            {error && <span className="text-xs text-red-600">{errorMessage}</span>}
        </>
    )
})

export default Select;