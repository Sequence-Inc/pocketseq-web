import { CheckIcon } from '@heroicons/react/solid';
import clsx from 'clsx';

export default function Step({ steps, activeStep, setActiveStep }) {

  const isCompleted = (currentIndex: number): boolean => {
    if (!steps || !activeStep) return false;
    return currentIndex < activeStep;
  }

  const isCurrent = (index: number): boolean => {
    return activeStep === index;
  }

  const changeStep = (currentIndex: number) => {
    isCompleted(currentIndex - 1) && setActiveStep(currentIndex - 1)
  }

  return (
    <nav aria-label="Progress" className="w-full bg-white">
      <ol role="list" className="border border-gray-300 divide-y divide-gray-300 rounded-md md:flex md:divide-y-0">
        {steps.map((step, stepIdx) => (
          <li key={step} className="relative md:flex-1 md:flex">
            <button
              type="button"
              className={isCurrent(stepIdx) ? "" : "group flex w-full items-center cursor-pointer"}
              onClick={() => changeStep(stepIdx)}
            >
              <span className="flex items-center px-6 py-4 text-sm font-medium">
                <span className={clsx("flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full",
                  isCompleted(stepIdx)
                    ? "bg-primary group-hover:bg-primaryDark"
                    : isCurrent(stepIdx)
                      ? "border-2 border-primary"
                      : "border-2 border-gray-300 group-hover:border-gray-400")}>
                  {isCompleted(stepIdx)
                    ? <CheckIcon className="w-6 h-6 text-white" aria-hidden="true" />
                    : isCurrent(stepIdx)
                      ? <span className="text-primary">{stepIdx + 1}</span>
                      : <span className="text-gray-500 group-hover:text-gray-900">{stepIdx + 1}</span>}
                </span>
                <span className={clsx("ml-4 text-sm font-medium",
                  isCompleted(stepIdx) ? "text-gray-900" : isCurrent(stepIdx) ? "text-primary" : "text-gray-500 group-hover:text-gray-900")}>
                  {step}
                </span>
              </span>
            </button>

            {stepIdx !== steps.length - 1 ? (
              <>
                {/* Arrow separator for lg screens and up */}
                <div className="absolute top-0 right-0 hidden w-5 h-full md:block" aria-hidden="true">
                  <svg
                    className="w-full h-full text-gray-300"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentcolor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}