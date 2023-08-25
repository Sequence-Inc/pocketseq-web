import React, { useCallback, useEffect, useState } from "react";
import { Button, Price } from "@element";
import { HeartIcon, ShareIcon } from "@heroicons/react/solid";
import {
    ICancelPolicy,
    ISetting,
    ISpace,
    ISpacePricePlan,
    TSpacePrice,
} from "src/types/timebookTypes";

import { DatePicker } from "antd";
import moment, { Moment } from "moment";
import { durationSuffix } from "../Space/PricingPlan";
import { PriceFormatter } from "src/utils/priceFormatter";
import {
    FormatPrice,
    hoursAsCancelPolicyDuration,
    toBase64,
} from "src/utils/stringHelper";
import { useLazyQuery } from "@apollo/client";
import { GET_PRICE_PLANS } from "src/apollo/queries/space.queries";
import { TUseCalculateSpacePriceProps } from "@hooks/reserveSpace";
import {
    durationToHours,
    durationToTimeDigit,
    getApplicableSettings,
    prefixTimeValueWithZero,
} from "src/utils/dateHelper";
import { useModalDialog } from "@hooks/useModalDialog";
import AlertModal from "../AlertModal";

const numbersFromOneTo = (count: number) =>
    Array.from({ length: count }).map((_, index) => index + 1);

type PricePlanTypes = {
    [K in TSpacePrice]: {
        value: K;
        label: string;
    };
};

const MINUTES_OPTIONS = [5, 10, 15, 30, 45];

const TIME_MINUTES_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

const PRICE_PLAN_TYPES: PricePlanTypes = {
    DAILY: { value: "DAILY", label: "日" },
    HOURLY: { value: "HOURLY", label: "時間" },
    MINUTES: { value: "MINUTES", label: "分" },
};

export const FloatingPriceTwo = ({
    pricePlans,
    space,
    handleReserve,
    cancelPolicy,
}: {
    pricePlans: ISpacePricePlan[];
    space: ISpace;
    handleReserve: (data: TUseCalculateSpacePriceProps) => void;
    cancelPolicy: ICancelPolicy;
}) => {
    const [start, setStart] = useState<Moment>();
    const [hour, setHour] = useState(8);
    const [minute, setMinute] = useState(0);

    const [duration, setDuration] = useState<number>();
    const [durationType, setDurationType] = useState<TSpacePrice>();

    const [startDateTime, setStartDateTime] = useState<Moment>();
    const [endDateTime, setEndDateTime] = useState<Moment>();

    const [applicablePricePlans, setApplicablePricePlans] = useState<any>();

    const {
        isModalOpen,
        openModal,
        closeModal,
        setModalData,
        modalContent,
        modalData,
    } = useModalDialog();

    const [
        getApplicablePricePlans,
        { loading: isLoadingPrices, data: applicablePP },
    ] = useLazyQuery(GET_PRICE_PLANS, {
        nextFetchPolicy: "network-only",
        onError: (error) => {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: error.message,
            });
            openModal();
            setStart(null);
        },
    });

    useEffect(() => {
        const _durationType = _pricePlansOptions()[0] || null;
        setDurationType(() => _durationType);
    }, []);

    useEffect(() => {
        // get duration options
        const defaultSetting = _getDefaultSetting();
        const _durationOptions = _getDurationOptions();
        const _checkInOptions = _getTimeOptions();

        const _hour: number =
            _checkInOptions.businessHours[0] || defaultSetting.openingHr;

        const { calculatedHour, calculatedMinute } =
            _calculateCheckInHoursAndMinutes(_hour, minute);
        setHour(() => calculatedHour);
        setMinute(() => calculatedMinute);
        setDuration(() => _durationOptions[0]);
    }, [durationType]);

    useEffect(() => {
        if (start) {
            const startDateTime = getStartDateTime(start, hour, minute);
            setStartDateTime(() => startDateTime);
        }
    }, [start, duration, durationType, hour, minute]);

    useEffect(() => {
        if (durationType && duration && start) {
            const { startDateTime } = _getStartEndDateTime({
                start,
                hour,
                minute,
                duration,
                durationType,
            });

            getApplicablePricePlans({
                variables: {
                    input: {
                        fromDateTime: startDateTime.unix() * 1000,
                        duration,
                        durationType,
                        spaceId: space.id,
                    },
                },
            });
        }
    }, [duration, durationType, start, hour, minute]);

    useEffect(() => {
        setApplicablePricePlans(() => applicablePP?.getApplicablePricePlans);
    }, [applicablePP]);

    const price = FormatPrice("HOURLY", pricePlans, true, true);

    const initialPricingDetail = () => {
        let content = <div>予約する日付を選択して下さい</div>;

        if (isLoadingPrices) {
            content = (
                <div className="text-center text-gray-500 py-4">
                    読み込み中...
                </div>
            );
            return content;
        }
        if (applicablePricePlans) {
            const total = applicablePricePlans?.total;
            const duration = applicablePricePlans?.duration;
            const durationType = applicablePricePlans?.durationType;
            const plans = applicablePricePlans?.applicablePricePlans;

            const taxableAmount = total / 1.1;

            const pricePlans = plans as any[];

            const { startDateTime, endDateTime } = _getStartEndDateTime({
                start,
                duration,
                durationType,
                hour,
                minute,
            });

            const dateTimeFormatterString =
                durationType === "DAILY" ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm";

            content = (
                <div className="text-gray-600 pt-4">
                    <div className="mt-1 text-base">
                        <span className="inline-block w-40 font-bold">
                            チェックイン:
                        </span>
                        {startDateTime?.format(dateTimeFormatterString)}
                    </div>

                    <div className="mt-2 text-base">
                        <span className="inline-block w-40 font-bold">
                            チェックアウト:
                        </span>
                        {endDateTime?.format(dateTimeFormatterString)}
                    </div>
                    <div className="mt-2 text-base">
                        <span className="inline-block w-40 font-bold">
                            期間:
                        </span>
                        {duration}
                        {durationSuffix(durationType)}
                    </div>
                    <div className="font-bold mt-4">プライスプラン</div>
                    <div className="space-y-2 mt-2">
                        {pricePlans.map((plan, index) => {
                            const {
                                title,
                                amount,
                                appliedTimes,
                                duration,
                                type,
                                isOverride,
                            } = plan;

                            return (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-2 px-3 border border-gray-200 rounded-lg shadow-sm "
                                >
                                    <div className="flex-grow">
                                        <div className="font-bold">
                                            {title}
                                            {isOverride && (
                                                <span className="text-xs italic text-gray-400 font-normal">
                                                    (Override price)
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <span className="text-bold">
                                                {PriceFormatter(amount)}
                                            </span>
                                            /{duration}
                                            {durationSuffix(type)}
                                        </div>
                                    </div>
                                    <div className="text-lg font-bold">
                                        {/* {appliedTimes}回 */}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* <div className="font-bold  mt-3">Calculated price</div> */}
                    <div className="space-y-2 mt-5 text-base">
                        <div className="text-right">
                            <span className="inline-block w-12">小計:</span>
                            <span className="inline-block font-bold w-20">
                                {PriceFormatter(taxableAmount)}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="inline-block w-12">税金:</span>
                            <span className="inline-block font-bold w-20">
                                {PriceFormatter(total - taxableAmount)}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="inline-block w-12">会計:</span>
                            <span className="inline-block font-bold w-20">
                                {PriceFormatter(total)}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return content;
    };

    const initiateReserve = useCallback(() => {
        const { startDateTime } = _getStartEndDateTime({
            start,
            hour,
            minute,
            duration,
            durationType,
        });

        handleReserve({
            fromDateTime: startDateTime.unix() * 1000,
            duration,
            durationType,
            spaceId: space.id,
        });
    }, [
        handleReserve,
        startDateTime,
        endDateTime,
        duration,
        durationType,
        space?.id,
    ]);

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf("day");
    };

    const okayToBook = () => {
        if (durationType !== "DAILY") {
            return (startDateTime && start) || false;
        } else {
            return start || false;
        }
    };

    const _pricePlansOptions = useCallback(
        () =>
            pricePlans.reduce((acc: TSpacePrice[], { type }) => {
                const spacePriceType: TSpacePrice = type as TSpacePrice;
                if (!acc.includes(spacePriceType)) {
                    return [...acc, spacePriceType];
                } else {
                    return acc;
                }
            }, []),
        [pricePlans]
    );

    const _getApplicableSettings = useCallback(() => {
        const { settings } = space;

        // get default setting
        const defaultSetting: ISetting = _getDefaultSetting();

        let applicableSettings: ISetting[] = [defaultSetting];

        // Check applicable settings
        if (start && durationType && duration) {
            const _durationType =
                durationType === "DAILY"
                    ? "days"
                    : durationType === "HOURLY"
                    ? "hours"
                    : "minutes";
            const from = start;
            const to = start.clone().add(duration, _durationType);
            const filteredSettings = getApplicableSettings(settings, {
                from,
                to,
            });

            if (filteredSettings.length > 0) {
                applicableSettings = filteredSettings;
            }
        }
        return applicableSettings;
    }, [start, durationType, duration]);

    const _getDurationOptions = useCallback(() => {
        // get default setting
        const type = durationType; // get duration type from state

        if (type === "DAILY") {
            return numbersFromOneTo(14);
        } else if (type === "MINUTES") {
            const optionsSet = new Set<number>(); // set to hold unique values
            pricePlans.map((plan) => {
                plan.type === "MINUTES" && optionsSet.add(plan.duration);
            });
            return Array.from(optionsSet).sort((a, b) => a - b); // returning array from optionsSet
        }

        const applicableSettings = _getApplicableSettings();
        let maxOpeningHour = 24;
        applicableSettings.map((setting) => {
            const { openingHr, closingHr } = setting;

            const fullDayShit = closingHr - openingHr;
            if (fullDayShit < maxOpeningHour) {
                maxOpeningHour = fullDayShit;
            }
        });

        return numbersFromOneTo(maxOpeningHour);
    }, [pricePlans, durationType, start, duration]);

    const _getTimeOptions = useCallback(() => {
        const result: { businessHours: number[]; breakHours: number[] } = {
            businessHours: [],
            breakHours: [],
        };

        if (durationType === "DAILY") {
            return result;
        }

        const applicableSettings = _getApplicableSettings();

        let holiday = true;
        let openingHour = 24;
        let closingHour = 0;
        let breakStart = 24;
        let breakEnd = 0;
        applicableSettings.map(
            ({ closed, openingHr, closingHr, breakFromHr, breakToHr }) => {
                if (!closed) {
                    holiday = false;
                }
                if (openingHr < openingHour) {
                    openingHour = openingHr;
                }
                if (closingHr > closingHour) {
                    closingHour = closingHr;
                }

                if (breakFromHr < breakStart) {
                    breakStart = breakFromHr;
                }
                if (breakToHr > breakEnd) {
                    breakEnd = breakToHr;
                }
            }
        );

        // If there's no available days then return blank array
        if (holiday) return result;

        // prepare hours from opening & closing hours
        for (let i = openingHour; i <= closingHour; i++) {
            result.businessHours.push(Math.floor(i));
        }
        // let breakHours = [];
        for (let i = breakStart; i < breakEnd; i++) {
            result.breakHours.push(Math.floor(i));
        }
        return { ...result };
    }, [durationType, start, duration]);

    const _getStartEndDateTime = useCallback(
        ({
            start,
            hour,
            minute,
            duration,
            durationType,
        }: {
            start: moment.Moment;
            hour: number;
            minute: number;
            duration: number;
            durationType: TSpacePrice;
        }) => {
            let startDateTime = getStartDateTime(start, hour, minute);
            if (durationType === "DAILY") {
                startDateTime = startDateTime.clone().startOf("day");
            }
            const endDateTime = getEndDateTime(
                startDateTime,
                duration,
                durationType
            );
            return { startDateTime, endDateTime };
        },
        [start, hour, minute, duration, durationType]
    );

    const _getDefaultSetting = useCallback(() => {
        return space.settings.filter(({ isDefault }) => isDefault)[0];
    }, []);

    const _calculateCheckInHoursAndMinutes = (
        hour: number,
        minute: number
    ): {
        calculatedHour: number;
        calculatedMinute: number;
    } => {
        const result = {
            calculatedHour: hour,
            calculatedMinute: minute,
        };

        const minutesInDecimal = hour % 1;

        if (minutesInDecimal === 0) {
            result.calculatedHour = hour;
            result.calculatedMinute = minute;
        } else {
            result.calculatedHour = Math.floor(hour);
            result.calculatedMinute = durationToTimeDigit(
                minutesInDecimal,
                "minutes"
            );
        }

        return result;
    };

    const _checkDisabledTimeOption = (currentOption: number): boolean => {
        const { businessHours, breakHours } = _getTimeOptions();

        if (breakHours.includes(currentOption)) {
            return true;
        }

        if (durationType === "HOURLY") {
            if (currentOption === businessHours[businessHours.length - 1]) {
                return true;
            }
        }
        return false;
    };

    const _checkDisabledMinuteOption = (currentOption: number): boolean => {
        const { openingHr, closingHr } = _getDefaultSetting();
        const selectedHour = durationToHours(hour, "hours");
        const currentMinute = durationToHours(currentOption, "minutes");
        const selectedTime = selectedHour + currentMinute;

        return selectedTime < openingHr || selectedTime > closingHr
            ? true
            : false;
    };

    const { businessHours } = _getTimeOptions();

    const showCheckInTime = ["HOURLY", "MINUTES"].includes(durationType)
        ? true
        : false;

    const _durationOptions = _getDurationOptions();

    return (
        <div className="no-scrollbar w-full max-h-screen overflow-y-scroll md:sticky md:top-20">
            <div className="relative p-5 space-y-4 border border-gray-200 rounded-lg">
                {/* price row */}
                <div className="flex justify-between">
                    <Price amount={price} />
                </div>
                {/* date and time row */}
                <div className="">
                    <div className="mb-2 text-sm font-bold text-gray-500">
                        チェックイン
                    </div>
                    <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <DatePicker
                            onChange={(date) => setStart(date)}
                            disabledDate={disabledDate}
                            bordered={false}
                            value={start || null}
                            className="w-full px-3 py-2 text-sm text-gray-700 placeholder-gray-400 border border-gray-200 rounded-md shadow-sm hover:cursor-pointer"
                        />
                    </div>
                </div>
                <div>
                    <div className="mb-2 text-sm font-bold text-gray-500">
                        期間
                    </div>
                    <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <select
                            className="text-sm ring-0 border-0 outline-none focus:outline-none focus:border-none focus:ring-0"
                            value={duration}
                            onChange={(event) =>
                                setDuration(parseInt(event.target.value))
                            }
                        >
                            {_durationOptions?.length > 0 &&
                                _durationOptions.map((duration, index) => {
                                    return (
                                        <option key={index} value={duration}>
                                            {duration}
                                        </option>
                                    );
                                })}
                        </select>
                        <select
                            className="text-sm ring-0 border-0 outline-none focus:outline-none focus:border-none focus:ring-0"
                            value={durationType}
                            onChange={(event) =>
                                setDurationType(
                                    event.target.value as TSpacePrice
                                )
                            }
                        >
                            {_pricePlansOptions().map((_duration, index) => (
                                <option value={_duration} key={index}>
                                    {PRICE_PLAN_TYPES[_duration].label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {showCheckInTime && (
                    <div>
                        <div className="mb-2 text-sm font-bold text-gray-500">
                            チェックイン時間
                        </div>
                        <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            <select
                                value={hour}
                                onChange={(event) =>
                                    setHour(
                                        event.target.value as unknown as number
                                    )
                                }
                                className="text-sm ring-0 border-0 outline-none focus:outline-none focus:border-none focus:ring-0"
                            >
                                {businessHours?.map((option, index) => (
                                    <option
                                        key={index}
                                        value={option}
                                        disabled={_checkDisabledTimeOption(
                                            option
                                        )}
                                    >
                                        {option < 10 ? `0${option}` : option}
                                    </option>
                                ))}
                            </select>
                            時
                            <select
                                value={minute}
                                onChange={(event) =>
                                    setMinute(parseInt(event.target.value))
                                }
                                className="text-sm ring-0 border-0 outline-none focus:outline-none focus:border-none focus:ring-0"
                            >
                                {TIME_MINUTES_OPTIONS.map((_, index) => {
                                    return (
                                        <option
                                            value={`${_}`}
                                            key={index}
                                            disabled={_checkDisabledMinuteOption(
                                                _
                                            )}
                                        >
                                            {prefixTimeValueWithZero(_)}
                                        </option>
                                    );
                                })}
                            </select>
                            分
                        </div>
                    </div>
                )}
                {okayToBook() && initialPricingDetail()}
                {/* button row */}
                {/* <Link href={`/space/${space.id}/reserve${url}`}> */}
                <Button
                    variant="primary"
                    disabled={!okayToBook()}
                    onClick={initiateReserve}
                >
                    予約可能状況を確認する
                </Button>
                {/* </Link> */}
                {/* cancel policy */}
                {cancelPolicy && (
                    <div className="flex flex-col justify-center space-x-1.5">
                        <div className="w-full my-6 border-t border-gray-300"></div>
                        <h2 className="mb-4 text-base font-bold text-gray-700">
                            キャンセルポリシー
                            {/* {cancelPolicy.name} */}
                        </h2>
                        <ul className="space-y-1">
                            {[...cancelPolicy.rates]
                                .sort((a, b) => a.beforeHours - b.beforeHours)
                                .map((policy, index) => {
                                    return (
                                        <li
                                            key={index}
                                            className="text-sm flex justify-between w-full"
                                        >
                                            <div>
                                                {hoursAsCancelPolicyDuration(
                                                    policy.beforeHours
                                                )}
                                            </div>
                                            <div>{policy.percentage}%</div>
                                        </li>
                                    );
                                })}
                        </ul>
                    </div>
                )}
            </div>
            <div className="flex my-4 space-x-2">
                <Button>
                    <HeartIcon className="inline-block w-4 h-4 mr-1 text-gray-300" />
                    <span>保存</span>
                </Button>
                <Button>
                    <ShareIcon className="inline-block w-4 h-4 mr-1 text-gray-300" />
                    <span>シェア</span>
                </Button>
            </div>
            <AlertModal
                isOpen={isModalOpen}
                disableTitle={true}
                disableDefaultIcon={true}
                setOpen={() => {
                    closeModal();
                    setModalData(null);
                }}
                disableClose={true}
            >
                <div className="text-sm text-gray-500">{modalContent}</div>
            </AlertModal>
        </div>
    );
};

export const getStartDateTime = (
    start: Moment,
    hour: number,
    minute: number
) => {
    return start
        .clone()
        .startOf("day")
        .add(hour, "hours")
        .add(minute, "minutes");
};

export const getEndDateTime = (
    startDateTime: Moment,
    duration,
    durationType
) => {
    const startDT = moment(startDateTime).clone();
    if (durationType === "DAILY") {
        if (duration === 1) {
            return startDT.endOf("d");
        }
        return startDT.add(duration - 1, "d").endOf("d");
    } else if (durationType === "HOURLY") {
        return startDT.add(duration, "hour");
    } else if (durationType === "MINUTES") {
        return startDT.add(duration, "m");
    }
};

export const timeDifference = (startDateTime, endDateTime, durationType) => {
    const difference = moment.duration(
        endDateTime.diff(startDateTime),
        "milliseconds"
    );
    if (durationType === "DAILY") {
        return difference.asDays();
    } else if (durationType === "HOURLY") {
        return difference.asHours();
    } else if (durationType === "MINUTES") {
        return difference.asMinutes();
    }
    return difference;
};
