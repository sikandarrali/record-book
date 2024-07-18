export function FormattedDateForCalenderDatePick(inputDateString) {
    // Extract day, month, and year
    const day = inputDateString.getDate();
    const month = inputDateString.getMonth() + 1; // Month is zero-based, so we add 1
    const year = inputDateString.getFullYear();

    // Format day and month with leading zeros if needed
    const formattedDay = day < 10 ? "0" + day : day;
    const formattedMonth = month < 10 ? "0" + month : month;

    // Create the formatted date string
    return formattedDay + "-" + formattedMonth + "-" + year;
}