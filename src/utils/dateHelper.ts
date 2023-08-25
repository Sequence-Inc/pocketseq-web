import { ISetting } from "@appTypes/timebookTypes";
import moment from "moment";

export type DaysOfWeekJP = "日" | "月" | "火" | "水" | "木" | "金" | "土";
export const daysOfWeekJP: DaysOfWeekJP[] = [
    "日",
    "月",
    "火",
    "水",
    "木",
    "金",
    "土",
];

export interface DateRange {
    from: moment.Moment;
    to: moment.Moment;
}

export const dateRangesOverlap = (
    rangeA: DateRange,
    rangeB: DateRange
): boolean => {
    return (
        (rangeA.from.isSameOrBefore(rangeB.to) &&
            rangeA.to.isSameOrAfter(rangeB.from)) ||
        (rangeB.from.isSameOrBefore(rangeA.to) &&
            rangeB.to.isSameOrAfter(rangeA.from))
    );
};

export const getApplicableSettings = (
    spaceSettings: ISetting[],
    reservationDateRange: DateRange
) => {
    return spaceSettings.filter((setting) => {
        const { fromDate: _fromDate, toDate: _toDate } = setting;
        const settingDateRange = {
            from: moment(_fromDate),
            to: moment(_toDate),
        };
        return dateRangesOverlap(settingDateRange, reservationDateRange);
    });
};

export const decimalHoursToTimeString = (duration: number): string => {
    const _ = moment.duration(duration, "hours"); //
    return `${prefixTimeValueWithZero(_.hours())}:${prefixTimeValueWithZero(
        _.minutes()
    )}`;
};

export const prefixTimeValueWithZero = (time: number): string => {
    if (time < 10) {
        return `0${time}`;
    }
    return `${time}`;
};

export const mapDaysOfWeekFromIndex = (dayIndex: number): DaysOfWeekJP => {
    if (dayIndex > 6) {
        return null;
    }
    return daysOfWeekJP[dayIndex];
};
