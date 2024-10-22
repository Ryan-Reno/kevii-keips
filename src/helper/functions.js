import { format, parseISO, parse } from "date-fns";

export function convertToISO({ date, time }) {
    const dateTimeString = `${date}T${time}:00`;
    return dateTimeString;
}

export function formatDate(dateString) {
    const date = parseISO(dateString);
    return format(date, "EEE, dd MMM");
}

export function formatTime(timeString) {
    const time = parse(timeString, "HH:mm", new Date());
    return format(time, "h:mm a");
}

export function formatTimeShort(timeString) {
    const time = parse(timeString, "HH:mm", new Date());

    return { time: format(time, "h:mm"), period: format(time, "a") };
}


export function formatDateTime({ date, time }) {
    if (!date || !time) return "";
    const dateTimeString = `${date}T${time}:00`;
    const dateTime = new Date(parseISO(dateTimeString));
    const options = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    };
    const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(
        dateTime
    );

    return formattedDate.replace(/(am|pm)/g, (match) => match.toUpperCase());
}

export function formatDateTimeMix(datetime) {
    const dateTime = new Date(datetime);

    const utcOffset = 8 * 60;
    const offsetDateTime = new Date(dateTime.getTime() + utcOffset * 60 * 1000);

    const options = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Singapore"
    };

    const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(offsetDateTime);

    return formattedDate.replace(/(am|pm)/g, (match) => match.toUpperCase());
}


export function formatDateTimeMixNoOffset(datetime) {
    const dateTime = new Date(datetime);

    const year = dateTime.getUTCFullYear();
    const month = dateTime.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' });
    const day = ('0' + dateTime.getUTCDate()).slice(-2);
    const hour = ('0' + dateTime.getUTCHours()).slice(-2);
    const minute = ('0' + dateTime.getUTCMinutes()).slice(-2);
    const period = dateTime.getUTCHours() >= 12 ? 'PM' : 'AM';

    const formattedDate = `${day} ${month} ${year}, ${hour}:${minute} ${period}`;

    return formattedDate;
}

export function getFormattedDate() {
    const today = new Date();

    const options = {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    };

    return today.toLocaleDateString("en-GB", options);
}

export function getFormattedDateTime() {
    const today = new Date();

    const options = {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    };

    return today.toLocaleDateString("en-GB", options);
}
