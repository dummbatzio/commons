import { DateTime } from "luxon";

export const formatISODateTime = (datetime: string) =>
  DateTime.fromISO(datetime)
    .setLocale("de")
    .toLocaleString(DateTime.DATETIME_SHORT);
