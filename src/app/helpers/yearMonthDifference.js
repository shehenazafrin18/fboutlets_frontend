import moment from "moment";

export function yearMonthDifference(endDate, startDate) {
    // Check if the input dates are valid
    if (!moment(startDate).isValid() || !moment(endDate).isValid()) {
        throw new Error('Invalid date objects');
    }

    // Calculate the difference in years
    const yearsDiff = moment(endDate).diff(moment(startDate), 'years');

    // Calculate the remaining months
    const monthsDiff = moment(endDate).diff(moment(startDate), 'months') % 12;

    const startDateCopy = moment(startDate).add(yearsDiff, 'years').add(monthsDiff, 'months');
    const daysDiff = moment(endDate).diff(startDateCopy, 'days');

    const yearsPart = yearsDiff > 0 ? `${yearsDiff} Years` : '';
    const monthsPart = monthsDiff > 0 ? `${monthsDiff} Months` : '';
    const daysPart = daysDiff > 0 ? `${daysDiff} Days` : '';
    // Combine years and months parts, adding a space if both are present
    return yearsPart + (yearsPart && monthsPart ? ' ' : '') + monthsPart + (daysPart && monthsPart ? ' ' : '') + daysPart;
}
