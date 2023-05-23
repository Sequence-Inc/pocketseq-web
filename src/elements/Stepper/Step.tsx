import { CheckIcon } from "@heroicons/react/solid";
import clsx from "clsx";

export default function Step({ steps }) {
    return (
        <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
                {steps.map((step, stepIdx) => (
                    <li
                        key={step.name}
                        className={clsx(
                            stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "",
                            "relative"
                        )}
                    >
                        <div
                            className="absolute inset-0 flex items-center"
                            aria-hidden="true"
                        >
                            <div
                                className={clsx(
                                    "h-0.5 w-full",
                                    step.status === "complete"
                                        ? "bg-primary"
                                        : "bg-gray-200"
                                )}
                            />
                        </div>
                        <a
                            href="#"
                            className={clsx(
                                "relative flex items-center justify-center w-8 h-8 rounded-full",
                                step.status === "complete"
                                    ? "bg-primary hover:bg-primaryDark"
                                    : step.status === "current"
                                    ? "bg-white border-2 border-primary"
                                    : "bg-white border-2 border-gray-300 group hover:border-gray-400"
                            )}
                        >
                            {step.status === "complete" ? (
                                <CheckIcon
                                    className="w-5 h-5 text-white"
                                    aria-hidden="true"
                                />
                            ) : step.status === "current" ? (
                                <span
                                    className="h-2.5 w-2.5 bg-primary rounded-full"
                                    aria-hidden="true"
                                />
                            ) : (
                                <span
                                    className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"
                                    aria-hidden="true"
                                />
                            )}
                            <div
                                className={clsx(
                                    "absolute text-sm text-center -bottom-14",
                                    step.status === "complete" ||
                                        step.status === "current"
                                        ? "text-gray-600 font-medium"
                                        : "text-gray-400"
                                )}
                            >
                                {step.name}
                            </div>
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
