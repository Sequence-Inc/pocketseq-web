export const normalizeZipCodeInput = (value, previousValue) => {
    // return nothing if no value
    if (!value) return value;

    // only allows 0-9 inputs
    const currentValue = value.replace(/[^\d]/g, "");
    const cvLength = currentValue.length;

    if (!previousValue || value.length > previousValue.length) {
        // returns: "x", "xx", "xxx"
        if (cvLength < 4) return currentValue;

        // returns: "xxx-xxxx"
        return `${currentValue.slice(0, 3)}-${currentValue.slice(3, 7)}`;
    } else {
        return value;
    }
};