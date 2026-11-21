const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export function formatCurrency(amount) {
    return currencyFormatter.format(amount || 0);
}