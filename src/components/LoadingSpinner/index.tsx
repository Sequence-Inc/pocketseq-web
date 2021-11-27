export const LoadingSpinner = () => {
    return (
        <div className="w-full sm:w-1/2 mx-auto h-full space-y-6">
            <div className="flex items-center justify-center h-content">
                <div className="w-24 h-24 border-t-2 border-b-2 border-green-500 rounded-full animate-spin" />
            </div>
        </div>
    );
};
