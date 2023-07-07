const PriceFormatter = (amount: number, local: string): string => amount.toLocaleString(local, {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
}
);

export default PriceFormatter;
