export const PriceFormatter = (amount: number) => {
    if (Platform.OS === "ios") {
        const formatter = new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
        return formatter.format(amount);
    } else {
        return amount;
    }
};
