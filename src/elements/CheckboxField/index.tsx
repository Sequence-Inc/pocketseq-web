interface CheckBoxFieldProps {
    label: string;
    placeholder?: string;
    type?: string;
    id?: string;
    className?: string;
    error?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    tabIndex?: number;
    onBlur?: any;
    onChange: any;
    defaultValue?: string | number;
    value?: string | number;
    step?: string;
    singleRow?: boolean;
}
const CheckBoxField = () => {
    return (
        <fieldset className="space-y-5">
            <legend className="sr-only">Notifications</legend>
            <div className="relative flex items-start">
                <div className="flex items-center h-5">
                    <input
                        id="comments"
                        aria-describedby="comments-description"
                        name="comments"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label
                        htmlFor="comments"
                        className="font-medium text-gray-700"
                    >
                        Comments
                    </label>
                    <div id="comments-description" className="text-gray-500">
                        Get notified when someones posts a comment on a posting.
                    </div>
                </div>
            </div>
            <div className="relative flex items-start">
                <div className="flex items-center h-5">
                    <input
                        id="candidates"
                        aria-describedby="candidates-description"
                        name="candidates"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label
                        htmlFor="candidates"
                        className="font-medium text-gray-700"
                    >
                        Candidates
                    </label>
                    <div id="candidates-description" className="text-gray-500">
                        Get notified when a candidate applies for a job.
                    </div>
                </div>
            </div>
            <div className="relative flex items-start">
                <div className="flex items-center h-5">
                    <input
                        id="offers"
                        aria-describedby="offers-description"
                        name="offers"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label
                        htmlFor="offers"
                        className="font-medium text-gray-700"
                    >
                        Offers
                    </label>
                    <div id="offers-description" className="text-gray-500">
                        Get notified when a candidate accepts or rejects an
                        offer.
                    </div>
                </div>
            </div>
        </fieldset>
    );
};

export default CheckBoxField;
