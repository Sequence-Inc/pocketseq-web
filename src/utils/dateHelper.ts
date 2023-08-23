import { ISetting } from "@appTypes/timebookTypes";
import moment from "moment";

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
