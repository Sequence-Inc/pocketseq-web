export const PRICE_SCHEME_ADULTS = [
    { key: "oneAdultCharge", name: "大人1人" },
    { key: "twoAdultCharge", name: "大人2人" },
    { key: "threeAdultCharge", name: "大人3人" },
    { key: "fourAdultCharge", name: "大人4人" },
    { key: "fiveAdultCharge", name: "大人5人" },
    { key: "sixAdultCharge", name: "大人6人" },
    { key: "sevenAdultCharge", name: "大人7人" },
    { key: "eightAdultCharge", name: "大人8人" },
    { key: "nineAdultCharge", name: "大人9人" },
    { key: "tenAdultCharge", name: "大人10人" },
];

export const ROOM_CHARGE_KEY = "roomCharge";

export const PRICE_SCHEME_CHILD = [
    { key: "oneChildCharge", name: "子供1人" },
    { key: "twoChildCharge", name: "子供2人" },
    { key: "threeChildCharge", name: "子供3人" },
    { key: "fourChildCharge", name: "子供4人" },
    { key: "fiveChildCharge", name: "子供5人" },
    { key: "sixChildCharge", name: "子供6人" },
    { key: "sevenChildCharge", name: "子供7人" },
    { key: "eightChildCharge", name: "子供8人" },
    { key: "nineChildCharge", name: "子供9人" },
    { key: "tenChildCharge", name: "子供10人" },
];

export const BUILDING_TYPE_OPTIONS = [
    { label: "Whole House Rental", value: "WHOLE_HOUSE" },
    { label: "Simple Accomodation", value: "SIMPLE_ACCOMODATION" },
    { label: "Hotel", value: "HOTEL" },
    { label: "Inn", value: "INN" },
];

export const DAY_OF_WEEK = [
    { name: "日", value: 0 },
    { name: "月", value: 1 },
    { name: "火", value: 2 },
    { name: "水", value: 3 },
    { name: "木", value: 4 },
    { name: "金", value: 5 },
    { name: "土", value: 6 },
];

export const PAYMENT_TYPES = [
    {
        value: "PER_ROOM",
        label: "部屋ごと",
    },
    {
        value: "PER_PERSON",
        label: "人数ごと",
    },
];

export const OPTION_PAYMENT_TERMS = [
    { label: "人数ごと", value: "PER_PERSON" },
    { label: "部屋ごと", value: "PER_ROOM" },
    { label: "Per Use", value: "PER_USE" },
    { label: "Flat", value: "PER_FLAT" },
    // TOdo
    // { label: "Per Day", value: "PER_DAY" },
];
