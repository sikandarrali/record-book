export function FormattedDate(timestamp) {
    // Convert seconds to milliseconds
    const milliseconds = timestamp?.seconds * 1000;

    // Create a new Date object using the milliseconds and add nanoseconds
    const date = new Date(
        milliseconds + Math.floor(timestamp?.nanoseconds / 1e6)
    );

    // Extract date components
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-based, so add 1
    const year = date.getFullYear();

    // Format day and month with leading zeros if needed
    const formattedDay = day < 10 ? "0" + day : day;
    const formattedMonth = month < 10 ? "0" + month : month;

    // Create the formatted date string
    return formattedDay + "-" + formattedMonth + "-" + year;
}