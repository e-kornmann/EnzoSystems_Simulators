const priceFormatter = (amount: (number | undefined), local: string): string | undefined => amount ? amount.toLocaleString(local, {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
}
): undefined;

export default priceFormatter;
