export function calculateDateRangeCount(deadline) {
    // Parse the current date and deadline
    const currentDateObj = new Date();
    const deadlineDateObj = new Date(deadline);

    // Calculate the difference in milliseconds
    const timeDifference = deadlineDateObj.getTime() - currentDateObj.getTime();

    // Convert the difference to days and add 1 to include both the start and end dates
    const dateRangeCount = Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1;

    return dateRangeCount;
}
