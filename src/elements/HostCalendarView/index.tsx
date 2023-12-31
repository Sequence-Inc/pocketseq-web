import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { Calendar } from "antd";
import moment, { Moment } from "moment";
import { useHotkeys, isHotkeyPressed } from "react-hotkeys-hook";
import { getTimeFromFloat, PriceFormatter } from "src/utils";
import { LoadingSpinner } from "@comp";
import { Disclosure } from "@headlessui/react";
import { daysOfWeek } from "src/components/DayOfWeekOverride";
import {
    BusinessDaysManager,
    BusinessHourManager,
    HolidayManager,
    StockManager,
} from "@page/host/my-space/edit/[id]/days-of-week";
import { DatePicker } from "antd";
import { useMutation } from "@apollo/client";
import {
    ADD_PRICE_OVERRIDE,
    ADD_SETTING_OVERRIDE,
    REMOVE_PRICE_OVERRIDE,
    REMOVE_SPACE_SETTING_OVERRIDE,
} from "src/apollo/queries/space.queries";
import { durationSuffix } from "src/components/Space/PricingPlan";
import { TrashIcon } from "@heroicons/react/outline";
import { daysOfWeek as DAYS } from "src/components/DayOfWeekOverride";
import AlertModal from "src/components/AlertModal";
import { useModalDialog } from "@hooks/useModalDialog";

const { RangePicker } = DatePicker;

const HostCalendarView = ({ plans, settings, spaceId }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedDates, setSelectedDates] = useState([]);

    const [panelChanged, setPanelChanged] = useState(false);
    const [selectedRangeStart, setSelectedRangeStart] = useState(undefined);
    const [selectedRangeEnd, setSelectedRangeEnd] = useState(undefined);

    const [defaultPlan, setDefaultPlan] = useState<any>();
    const [defaultPlanUnit, setDefaultPlanUnit] = useState<string>();
    const [overRides, setOverRides] = useState([]);

    const [defaultSetting, setDefaultSetting] = useState();
    const [settingOverrides, setSettingOverrides] = useState([]);

    const [showAddSettingsForm, setShowAddSettingsForm] =
        useState<boolean>(false);
    const [showAddPriceForm, setShowAddPriceForm] = useState<boolean>(false);

    const [initialLoadComplete, setInitialLoadComplete] =
        useState<boolean>(false);

    const [settingOverrideMutation] = useMutation(ADD_SETTING_OVERRIDE);
    const [priceOverrideMutation] = useMutation(ADD_PRICE_OVERRIDE);
    const [removeSpacePriceOverride] = useMutation(REMOVE_PRICE_OVERRIDE);
    const [removeSpaceSettingOverride] = useMutation(
        REMOVE_SPACE_SETTING_OVERRIDE
    );

    const {
        isModalOpen,
        openModal,
        closeModal,
        setModalData,
        modalContent,
        modalData,
    } = useModalDialog();

    useHotkeys("esc", () => {
        onClearRangeSelection();
    });

    useEffect(() => {
        const overRide = [];
        if (plans) {
            plans.map((plan) => {
                if (plan.overrides.length > 0) {
                    overRide.push(...plan.overrides);
                }
            });
            setOverRides(
                overRide
                    .filter((_) => _.type === "DATE_TIME")
                    .map((_) => {
                        return {
                            ..._,
                            fromDate: moment(_.fromDate),
                            toDate: moment(_.toDate),
                        };
                    })
            );

            const defaultDailyPlan = plans.filter(
                (_) => _.isDefault && _.type === "DAILY"
            )[0];
            const defaultHourlyPlan = plans.filter(
                (_) => _.isDefault && _.type === "HOURLY"
            )[0];

            if (defaultDailyPlan) {
                setDefaultPlan(defaultDailyPlan);
                setDefaultPlanUnit("DAILY");
            } else {
                setDefaultPlan(defaultHourlyPlan);
                setDefaultPlanUnit("HOURLY");
            }

            // setDefaultPlan(
            //     plans.filter((_) => _.isDefault && _.type === "DAILY")[0]
            // );
        }
        if (settings) {
            const setting = settings.map((_) => {
                return {
                    ..._,
                    fromDate: moment(_.fromDate),
                    toDate: moment(_.toDate),
                };
            });
            setDefaultSetting(setting.filter((_) => _.isDefault === true)[0]);
            setSettingOverrides(
                setting.filter(
                    (_) => _.isDefault === false && _.businessDays.length === 0
                )
            );
        }
        setInitialLoadComplete(true);
    }, []);

    useEffect(() => {
        if (selectedRangeStart && selectedRangeEnd) {
            const start = moment(selectedRangeStart);
            const end = moment(selectedRangeEnd);

            let newDates = [];

            const differenceInDays = end
                .endOf("day")
                .diff(start.startOf("day"), "days");
            const differenceInHours = end
                .endOf("day")
                .diff(start.startOf("day"), "hours");

            if (differenceInDays > 0) {
                for (let i = 0; i <= differenceInDays; i++) {
                    const newDate = moment(start, "YYYY-MM-DD")
                        .add(i, "days")
                        .format("YYYY-MM-DD");
                    newDates.push(newDate);
                }
            } else if (differenceInHours > 0) {
                newDates.push(start.format("YYYY-MM-DD"));
            }

            setSelectedDates([...selectedDates, ...newDates]);
        }
    }, [selectedRangeStart, selectedRangeEnd]);

    const onClearRangeSelection = () => {
        setSelectedRangeStart(undefined);
        setSelectedRangeEnd(undefined);
        setSelectedDates([]);
        setShowAddSettingsForm(false);
        setShowAddPriceForm(false);
    };

    const onSelect = (value) => {
        if (panelChanged) {
            onClearRangeSelection();
            setPanelChanged(false);
            return;
        }

        if (isHotkeyPressed("cmd")) {
            setSelectedDates([...selectedDates, value.format("YYYY-MM-DD")]);
            return;
        }

        if (!selectedRangeStart || (selectedRangeStart && selectedRangeEnd)) {
            setSelectedRangeStart(value);
            setSelectedRangeEnd(undefined);
        } else {
            if (selectedRangeStart.isAfter(value)) {
                setSelectedRangeEnd(selectedRangeStart);
                setSelectedRangeStart(value);
            } else {
                setSelectedRangeEnd(value);
            }
        }
    };

    const onPanelChange = (value, mode) => {
        setModalData({
            intent: "PANEL_CHANGE",
            title: "ご注意ください",
            text: "この選択によりカレンダーが変更されます。",
            onConfirm: () => {
                setPanelChanged(true);
            },
        });
        openModal();
    };

    const fullCellRenderer = (value: Moment) => {
        let cellClass =
            "ant-picker-cell-inner ant-picker-calendar-date rounded text-xs";
        let dateClass = "ant-picker-calendar-date-value pr-2";
        let selectedStyle = {};
        let selectedStyleText = {};

        const valueString = value.format("YYYY-MM-DD");

        if (valueString === moment().format("YYYY-MM-DD")) {
            cellClass += " ant-picker-cell-today";
            dateClass += " ant-picker-calendar-date-today";
        }
        let price = defaultPlan?.amount;
        let unit = defaultPlanUnit === "DAILY" ? "日" : "時間";

        let setting: any = defaultSetting;
        let isOverride = false;
        // check if date is between override dates;
        settings.map((_) => {
            if (value.isBetween(_.fromDate, _.toDate, "d", "[]")) {
                setting = _;
                if (!_.isDefault) {
                    isOverride = true;
                }
            }
        });

        overRides.map((_) => {
            if (value.isBetween(_.fromDate, _.toDate)) {
                price = _.amount;
                isOverride = true;
            }
        });

        let isClosed = false;
        let openingTime = null;
        let closingTime = null;
        let breakFromHr = null;
        let breakToHr = null;

        if (setting) {
            if (setting.closed) {
                isClosed = true;
            }
            openingTime = getTimeFromFloat(setting.openingHr);
            closingTime = getTimeFromFloat(setting.closingHr);
            if (setting.breakFromHr) {
                breakFromHr = getTimeFromFloat(setting.breakFromHr);
            }
            if (setting.breakToHr) {
                breakToHr = getTimeFromFloat(setting.breakToHr);
            }
        }

        let isSelected = false;
        if (selectedDates.indexOf(valueString) >= 0) {
            isSelected = true;
        }

        if (isSelected) {
            selectedStyle = { backgroundColor: "#FF6865" };
            selectedStyleText = { color: "#fff" };
        }

        if (isOverride) {
            if (isSelected) {
                dateClass += " bg-red-500";
            } else {
                dateClass += " bg-green-100";
            }
        }

        let data;
        if (isClosed) {
            data = (
                <div className="h-full flex items-center justify-center">
                    <div className="   font-bold" style={selectedStyleText}>
                        休業
                    </div>
                </div>
            );
        } else {
            data = (
                <div>
                    <div>
                        {openingTime.hour}:
                        {openingTime.minute < 10
                            ? `0${openingTime.minute}`
                            : openingTime.minute}
                        時 〜{closingTime.hour}:
                        {closingTime.minute < 10
                            ? `0${closingTime.minute}`
                            : closingTime.minute}
                        時
                    </div>
                    {breakFromHr && breakToHr && (
                        <div
                            className="text-xs text-gray-400"
                            style={selectedStyleText}
                        >
                            ({breakFromHr.hour}:
                            {breakFromHr.minute < 10
                                ? `0${breakFromHr.minute}`
                                : breakFromHr.minute}
                            時 〜{breakToHr.hour}:
                            {breakToHr.minute < 10
                                ? `0${breakToHr.minute}`
                                : breakToHr.minute}
                            時)
                        </div>
                    )}
                    <div>在庫: {setting?.totalStock}</div>
                    <div className="font-bold text-sm">
                        {price && `${PriceFormatter(price)}/${unit}`}
                    </div>
                </div>
            );
        }

        return (
            <div className={cellClass} style={selectedStyle}>
                <div className={dateClass} style={selectedStyleText}>
                    {value.format("DD")}
                </div>
                <div
                    className="ant-picker-calendar-date-content"
                    style={selectedStyleText}
                >
                    {data}
                </div>
            </div>
        );
    };

    if (!initialLoadComplete)
        return (
            <div className="my-20">
                <LoadingSpinner />
            </div>
        );

    const renderPricePlans = (plans, filter, handleDelete) => {
        return plans
            .filter((_) => _.type === filter)
            .map((plan) => (
                <PriceOverride
                    plan={plan}
                    filter="DATE_TIME"
                    key={plan.id}
                    handleDelete={handleDelete}
                />
            ));
    };

    const selectionActive = selectedDates.length > 0;

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf("day");
    };

    const addSettingOverride = async (setting) => {
        try {
            setModalData({ ...modalData, intent: "LOADING" });
            openModal();
            const { data } = await settingOverrideMutation({
                variables: {
                    spaceId,
                    spaceSetting: setting,
                },
            });

            setModalData({
                intent: "SUCCESS",
                title: "設定の上書きが追加されました",
                text: data.overrideSpaceSetting.result.message,
                onConfirm: () => {
                    setShowAddSettingsForm(false);
                    setShowAddPriceForm(false);
                    window.location.reload();
                },
            });
            openModal();
        } catch (error) {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: error.message,
            });
            openModal();
        }
    };
    const addPriceOverride = async ({ pricePlanId, input }) => {
        try {
            setModalData({ ...modalData, intent: "LOADING" });
            openModal();
            const { data } = await priceOverrideMutation({
                variables: {
                    pricePlanId,
                    input,
                },
            });
            setModalData({
                intent: "SUCCESS",
                title: "価格上書きが追加されました",
                text: data.addPricePlanOverride.result.message,
                onConfirm: () => {
                    setShowAddSettingsForm(false);
                    setShowAddPriceForm(false);
                    window.location.reload();
                },
            });
            openModal();
        } catch (error) {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: error.message,
            });
            openModal();
        }
    };

    const doDeleteSettingOverride = async (id) => {
        try {
            setModalData({ ...modalData, intent: "LOADING" });
            openModal();
            const { data } = await removeSpaceSettingOverride({
                variables: {
                    id,
                },
            });
            setModalData({
                intent: "SUCCESS",
                title: "価格上書きが削除されました",
                text: data.removeSpaceSetting.message,
                onConfirm: () => {
                    window.location.reload();
                },
            });
            openModal();
        } catch (error) {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: error.message,
            });
            openModal();
        }
    };

    const handleDeleteSettingOverride = async (id) => {
        setModalData({
            intent: "DELETE_PRICE_OVERRIDE",
            title: "設定上書きを消す？",
            text: "この操作により、上書き情報が削除されます。この操作は元に戻すことができません。",
            onConfirm: () => {
                doDeleteSettingOverride(id);
            },
        });
        openModal();
    };

    const doDeletePriceOverride = async (id) => {
        try {
            setModalData({ ...modalData, intent: "LOADING" });
            openModal();
            const { data } = await removeSpacePriceOverride({
                variables: {
                    id,
                },
            });
            setModalData({
                intent: "SUCCESS",
                title: "価格上書きが追加されました",
                text: data.removePricePlanOverride.message,
                onConfirm: () => {
                    window.location.reload();
                },
            });
            openModal();
        } catch (error) {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: error.message,
            });
            openModal();
        }
    };

    const handleDeletePriceOverride = async (id) => {
        setModalData({
            intent: "DELETE_PRICE_OVERRIDE",
            title: "価格上書きを消す？",
            text: "この操作により、上書き情報が削除されます。この操作は元に戻すことができません。",
            onConfirm: () => {
                doDeletePriceOverride(id);
            },
        });
        openModal();
    };

    const currentSelection =
        selectedDates.length > 1
            ? [selectedDates[0], selectedDates[selectedDates.length - 1]]
            : [selectedDates[0]];

    return (
        <div className="select-none space-y-4">
            <Calendar
                disabledDate={disabledDate}
                onSelect={onSelect}
                onPanelChange={onPanelChange}
                dateFullCellRender={fullCellRenderer}
            />
            <div className="border-t border-b border-gray-100 py-4">
                <button
                    onClick={() => onClearRangeSelection()}
                    disabled={!selectionActive}
                    className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                        selectionActive
                            ? "hover:bg-gray-50"
                            : "opacity-50 cursor-not-allowed"
                    }`}
                >
                    選択解除
                </button>
            </div>
            <div className="w-full">
                <div className="py-4 w-full">
                    <div className="flex items-center justify-between w-full">
                        <h2 className="flex-grow text-lg font-bold text-gray-600">
                            設定上書き
                        </h2>
                        <div>
                            <button
                                onClick={() => setShowAddSettingsForm(true)}
                                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary}`}
                            >
                                設定上書きの追加
                            </button>
                        </div>
                    </div>
                    {showAddSettingsForm && (
                        <SettingsOverrideForm
                            currentSelection={currentSelection}
                            defaultSetting={defaultSetting}
                            onCancel={() => setShowAddSettingsForm(false)}
                            onSave={(value) => {
                                // console.log(value);
                                addSettingOverride(value);
                            }}
                            loading={loading}
                            type="DATE_TIME"
                        />
                    )}
                    <div className="mt-4 space-y-3">
                        <SettingsOverride
                            setting={defaultSetting}
                            key={1}
                            deleteSettingOverride={() => {}}
                        />
                        {settingOverrides.map((setting) => (
                            <SettingsOverride
                                setting={setting}
                                key={setting.id}
                                deleteSettingOverride={
                                    handleDeleteSettingOverride
                                }
                            />
                        ))}
                    </div>
                </div>
                <div className="py-4 w-full">
                    <div className="flex items-center justify-between w-full">
                        <h2 className="flex-grow text-lg font-bold text-gray-600">
                            価格上書き
                        </h2>
                        <div>
                            <button
                                onClick={() => setShowAddPriceForm(true)}
                                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary}`}
                            >
                                価格上書きの追加
                            </button>
                        </div>
                    </div>
                    {showAddPriceForm && (
                        <PriceOverrideForm
                            overrideType="DATE_TIME"
                            currentSelection={currentSelection}
                            pricePlans={plans}
                            onCancel={() => setShowAddPriceForm(false)}
                            onSave={(value) => addPriceOverride(value)}
                            loading={loading}
                        />
                    )}
                    <div className="mt-4 flex items-start space-x-8">
                        <div className="space-y-3 w-full">
                            <h3 className="text-base font-bold text-gray-500">
                                日対
                            </h3>
                            {renderPricePlans(
                                plans,
                                "DAILY",
                                handleDeletePriceOverride
                            )}
                        </div>
                        <div className="space-y-3 w-full">
                            <h3 className="text-base font-bold text-gray-500">
                                時間対
                            </h3>
                            {renderPricePlans(
                                plans,
                                "HOURLY",
                                handleDeletePriceOverride
                            )}
                        </div>
                        <div className="space-y-3 w-full">
                            <h3 className="text-base font-bold text-gray-500">
                                分対
                            </h3>
                            {renderPricePlans(
                                plans,
                                "MINUTES",
                                handleDeletePriceOverride
                            )}
                        </div>
                    </div>
                </div>
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

export default HostCalendarView;

export const SettingsOverride = ({ setting, deleteSettingOverride }) => {
    const {
        id,
        totalStock,
        isDefault,
        closed,
        businessDays,
        openingHr,
        closingHr,
        breakFromHr,
        breakToHr,
        fromDate,
        toDate,
    } = setting;

    const from = fromDate ? moment(fromDate) : null;
    const to = toDate ? moment(toDate) : null;

    const title = isDefault
        ? "基本設定"
        : `設定上書き ${from.format("YYYY年MM月DD日")} 〜 ${to.format(
              "YYYY年MM月DD日"
          )}`;
    const openingTime = getTimeFromFloat(openingHr);
    const closingTime = getTimeFromFloat(closingHr);
    const breakFromTime = breakFromHr && getTimeFromFloat(breakFromHr);
    const breakToTime = breakToHr && getTimeFromFloat(breakToHr);

    let businessHourText = `${openingTime.hour}:
                            ${
                                parseInt(openingTime.minute) === 0
                                    ? "00"
                                    : openingTime.minute
                            }
                            時 〜 ${closingTime.hour}:
                            ${
                                parseInt(closingTime.minute) === 0
                                    ? "00"
                                    : closingTime.minute
                            }
                            時`;
    let breakHourText = "無し";
    if (breakFromTime && breakToTime) {
        breakHourText = `${breakFromTime.hour}:${
            parseInt(breakFromTime.minute) === 0 ? "00" : breakFromTime.minute
        }
                            時 〜 ${breakToTime.hour}:${
            parseInt(breakToTime.minute) === 0 ? "00" : breakToTime.minute
        }
                            時`;
    }

    let businessDaysText = (
        <div className="inline-block space-x-2">
            {daysOfWeek.map((day, index) => {
                if (businessDays.indexOf(index) !== -1) {
                    return (
                        <span
                            key={index}
                            className="inline-block w-8 text-center rounded-xl bg-primary text-white"
                        >
                            {day}
                        </span>
                    );
                } else {
                    return (
                        <span
                            key={index}
                            className="inline-block w-8 text-center rounded-xl bg-gray-100 text-gray-600"
                        >
                            {day}
                        </span>
                    );
                }
            })}
        </div>
    );
    return (
        <div className="border border-gray-200 shadow-sm rounded">
            <Disclosure>
                <Disclosure.Button className="px-3 py-2 w-full hover:bg-gray-50 text-left">
                    <div className="text-gray-600 font-bold">{title}</div>
                    <div className="text-gray-400 text-xs uppercase mt-1">
                        {setting.id}
                    </div>
                </Disclosure.Button>

                <Disclosure.Panel className="border-t border-gray-200 text-gray-600">
                    <div className="px-3 py-2 space-y-3">
                        <div>
                            <span className="inline-block w-20 font-bold">
                                休業:
                            </span>{" "}
                            {closed ? "YES" : "FALSE"}
                        </div>
                        <div>
                            <span className="inline-block w-20 font-bold">
                                営業日:
                            </span>{" "}
                            {businessDaysText}
                        </div>
                        <div>
                            <span className="inline-block w-20 font-bold">
                                営業時間:
                            </span>{" "}
                            {businessHourText}
                        </div>
                        <div>
                            <span className="inline-block w-20 font-bold">
                                休憩時間:
                            </span>{" "}
                            {breakHourText}
                        </div>
                        <div>
                            <span className="inline-block w-20 font-bold">
                                在庫:
                            </span>{" "}
                            {totalStock}
                        </div>
                        {!isDefault && (
                            <div>
                                <button
                                    onClick={() => deleteSettingOverride(id)}
                                    className="flex items-center  text-red-500 hover:text-red-600 font-bold"
                                >
                                    消す
                                    <TrashIcon className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        )}
                    </div>
                </Disclosure.Panel>
            </Disclosure>
        </div>
    );
};

export const SettingsOverrideForm = ({
    currentSelection,
    defaultSetting,
    onSave,
    onCancel,
    loading,
    type,
}: {
    currentSelection?: any;
    defaultSetting: any;
    onSave: any;
    onCancel: any;
    loading: boolean;
    type: "DATE_TIME" | "DAYS_OF_WEEK";
}) => {
    const [settings, setSettings] = useState(defaultSetting);
    const [selectedRange, setSelectedRange] = useState<
        [Moment, Moment] | null
    >();

    useEffect(() => {
        let startDate = moment().startOf("day");
        let endDate = moment().endOf("day");

        const [start, end] = currentSelection;

        if (!start && !end) {
            return;
        } else if (start) {
            startDate = moment(start).startOf("day");
            if (!end) {
                endDate = moment(start).endOf("day");
            } else {
                endDate = moment(end).endOf("day");
            }
        }
        setSelectedRange([startDate, endDate]);
    }, []);

    useEffect(() => {
        if (currentSelection) {
            setSelectedRange([
                moment(currentSelection[0]),
                moment(currentSelection[1]),
            ]);
        }
    }, [currentSelection]);

    const getValues = (key) => {
        return settings[key];
    };

    const setValue = (key, value) => {
        setSettings((settings) => {
            const newSetting = { ...settings };
            newSetting[key] = value;
            return newSetting;
        });
    };

    const range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    };

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf("day");
    };

    const handleDateChange = (value) => {
        setSelectedRange(value);
    };

    const handleSave = () => {
        const newSettingData = {
            ...settings,
            businessDays: type === settings.businessDays || undefined,
            fromDate:
                type === "DATE_TIME" ? selectedRange[0].startOf("day") : null,
            toDate: type === "DATE_TIME" ? selectedRange[1].endOf("day") : null,
        };

        delete newSettingData.id;
        delete newSettingData.__typename;
        delete newSettingData.isDefault;

        onSave(newSettingData);
    };

    return (
        <div className="mt-4 space-y-3 border border-gray-200 rounded-lg py-4 px-4">
            <div>
                {type === "DATE_TIME" && (
                    <>
                        <div className="items-start flex-none px-4 py-2 sm:space-x-8 sm:flex sm:px-10">
                            <div className="block text-sm font-bold text-gray-700 sm:text-right w-60 pt-1">
                                予定
                            </div>
                            <div className="w-full">
                                <RangePicker
                                    disabledDate={disabledDate}
                                    format="YYYY-MM-DD"
                                    defaultValue={selectedRange}
                                    value={selectedRange}
                                    onChange={(value) =>
                                        handleDateChange(value)
                                    }
                                />
                            </div>
                        </div>
                    </>
                )}
                {type === "DAYS_OF_WEEK" && (
                    <BusinessDaysManager
                        defaultValue={getValues("businessDays")}
                        onSave={(value) => {
                            setValue("businessDays", value);
                        }}
                    />
                )}
                <HolidayManager
                    defaultValue={getValues("closed")}
                    onSave={(value) => setValue("closed", value)}
                />
                {!settings.closed && (
                    <>
                        <BusinessHourManager
                            defaultValue={{
                                openingHr: getValues("openingHr"),
                                closingHr: getValues("closingHr"),
                                breakFromHr: getValues("breakFromHr"),
                                breakToHr: getValues("breakToHr"),
                            }}
                            onSave={(value) => {
                                console.log("BusinessHourManager", value);
                                const {
                                    openingHr,
                                    closingHr,
                                    breakFromHr,
                                    breakToHr,
                                } = value;
                                setValue("openingHr", openingHr);
                                setValue("closingHr", closingHr);
                                if (breakFromHr && breakToHr) {
                                    setValue("breakFromHr", breakFromHr);
                                    setValue("breakToHr", breakToHr);
                                }
                            }}
                        />
                        <StockManager
                            defaultValue={getValues("totalStock")}
                            onSave={(value) => {
                                setValue("totalStock", value);
                            }}
                        />
                    </>
                )}
            </div>
            <div className="text-right space-x-3">
                {loading && <span>Loading...</span>}
                <button
                    onClick={() => onCancel()}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    キャンセル
                </button>
                <button
                    onClick={() => handleSave()}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    追加
                </button>
            </div>
        </div>
    );
};

export const PriceOverride = ({ plan, filter, handleDelete }) => {
    const { id, title, amount, overrides, duration, type } = plan;

    const filteredOverrides = overrides.filter((_) => _.type === filter);
    const hasOverrides = filteredOverrides.length > 0;

    if (!hasOverrides) {
        return (
            <div className="border border-gray-200 shadow-sm rounded opacity-50">
                <div
                    className={`px-3 py-2 w-full text-left flex items-center justify-between"`}
                >
                    <div className="flex-grow">
                        <div>{title}</div>
                        <div className="text-gray-400">
                            {duration}
                            {durationSuffix(type)}
                        </div>
                    </div>
                    <div className="font-bold">{PriceFormatter(amount)}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-gray-200 shadow-sm rounded">
            <Disclosure>
                <Disclosure.Button
                    className={`flex items-center justify-between px-3 py-2 w-full text-left hover:bg-gray-50`}
                >
                    <div className="flex-grow">
                        <div>{title}</div>
                        <div className="text-gray-400">
                            {duration}
                            {durationSuffix(type)}
                        </div>
                    </div>
                    <div className="font-bold">{PriceFormatter(amount)}</div>
                </Disclosure.Button>

                <Disclosure.Panel className="border-t border-gray-200 text-gray-600">
                    <div className="divide-y divide-gray-100">
                        {filteredOverrides.map((override) => (
                            <OverrideItem
                                key={override.id}
                                override={override}
                                handleDelete={handleDelete}
                            />
                        ))}
                    </div>
                </Disclosure.Panel>
            </Disclosure>
        </div>
    );
};

export const PriceOverrideForm = ({
    overrideType,
    currentSelection,
    pricePlans,
    onSave,
    onCancel,
    loading,
}: {
    overrideType: "DAY_OF_WEEK" | "DATE_TIME";
    currentSelection?: any;
    pricePlans: any[];
    onSave: any;
    onCancel: any;
    loading: boolean;
}) => {
    const [basePlan, setBasePlan] = useState(pricePlans[0]);
    const [plan, setPlan] = useState(basePlan);

    const [selectedRange, setSelectedRange] = useState<[Moment, Moment]>([
        moment().add(1, "d"),
        moment().add(8, "d"),
    ]);

    useEffect(() => {
        if (currentSelection) {
            setSelectedRange([
                moment(currentSelection[0]),
                moment(currentSelection[1]),
            ]);
        }
    }, [currentSelection]);

    useEffect(() => {
        setPlan(basePlan);
    }, [basePlan]);

    const getValues = (key) => {
        return plan[key];
    };

    const setValue = (key, value) => {
        let newPlan = { ...plan };
        newPlan[key] = value;
        setPlan(newPlan);
    };

    const range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    };

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf("day");
    };

    const handleDateChange = (value) => {
        setSelectedRange(value);
    };

    const handleSave = () => {
        const { amount, daysOfWeek } = plan;

        let newPlan = {
            pricePlanId: basePlan.id,
            input: {
                amount,
                type: overrideType,
                fromDate:
                    overrideType === "DATE_TIME"
                        ? selectedRange[0]
                              .startOf("day")
                              .format("YYYY-MM-DD HH:mm:ss")
                        : null,
                toDate:
                    overrideType === "DATE_TIME"
                        ? selectedRange[1]
                              .endOf("day")
                              .format("YYYY-MM-DD HH:mm:ss")
                        : null,
                daysOfWeek: overrideType === "DAY_OF_WEEK" ? daysOfWeek : null,
            },
        };
        onSave(newPlan);
    };

    const sortedPlans = (pricePlans) => {
        const daily = pricePlans
            .filter((_) => _.type === "DAILY")
            .sort((a, b) => a.duration - b.duration);
        const hourly = pricePlans
            .filter((_) => _.type === "HOURLY")
            .sort((a, b) => a.duration - b.duration);
        const minutes = pricePlans
            .filter((_) => _.type === "MINUTES")
            .sort((a, b) => a.duration - b.duration);
        return Array().concat(...daily, ...hourly, ...minutes);
    };

    const handleChangeBasePlan = (planId) => {
        const plan = pricePlans.filter((_) => _.id === planId)[0];
        setBasePlan(plan);
    };

    return (
        <div className="mt-4 space-y-3 border border-gray-200 rounded-lg py-4 px-4">
            <div className="space-y-3">
                <div className="items-start flex-none px-4 py-2 sm:space-x-8 sm:flex sm:px-10">
                    <div className="block text-sm font-bold text-gray-700 sm:text-right w-60 pt-1">
                        プラン
                    </div>
                    <div className="w-full">
                        <select
                            onChange={(event) =>
                                handleChangeBasePlan(event.target.value)
                            }
                        >
                            {sortedPlans(pricePlans).map((plan) => {
                                return (
                                    <option key={plan.id} value={plan.id}>
                                        {plan.duration}
                                        {durationSuffix(plan.type)} -{" "}
                                        {PriceFormatter(plan.amount)} -{" "}
                                        {plan.title}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
                <div className="items-start flex-none px-4 py-2 sm:space-x-8 sm:flex sm:px-10">
                    <div className="block text-sm font-bold text-gray-700 sm:text-right w-60 pt-1">
                        予定
                    </div>
                    <div className="w-full">
                        <RangePicker
                            disabledDate={disabledDate}
                            format="YYYY-MM-DD"
                            defaultValue={selectedRange}
                            value={selectedRange}
                            onChange={(value) => handleDateChange(value)}
                        />
                    </div>
                </div>
                <div className="items-start flex-none px-4 py-2 sm:space-x-8 sm:flex sm:px-10">
                    <div className="block text-sm font-bold text-gray-700 sm:text-right w-60 pt-1">
                        料金
                    </div>
                    <div className="w-full">
                        <input
                            type="number"
                            min={0}
                            value={getValues("amount")}
                            onChange={(event) => {
                                setValue(
                                    "amount",
                                    parseInt(event.target.value)
                                );
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="text-right space-x-3">
                {loading && <span>Loading...</span>}
                <button
                    onClick={() => onCancel()}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    キャンセル
                </button>
                <button
                    onClick={() => handleSave()}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    追加
                </button>
            </div>
        </div>
    );
};

export const OverrideItem = ({ override, handleDelete }) => {
    const { id, type, amount, daysOfWeek, fromDate, toDate } = override;

    const [removePriceOverride] = useMutation(REMOVE_PRICE_OVERRIDE);

    const from = fromDate
        ? moment(fromDate).format("YYYY年MM月DD日 HH:mm")
        : null;
    const to = toDate ? moment(toDate).format("YYYY年MM月DD日 HH:mm") : null;

    let fromToText = <>無し</>;

    if (from && to) {
        fromToText = (
            <>
                {from}
                <br />
                から
                <br />
                {to}
            </>
        );
    } else if (from) {
        fromToText = <>{from} から</>;
    } else if (to) {
        fromToText = <>{to} まで</>;
    } else if (daysOfWeek) {
        fromToText = daysOfWeek.map((day) => {
            return (
                <span key={day} className="inline-block px-1">
                    {DAYS[day]}
                </span>
            );
        });
    }

    return (
        <div className="px-3 py-3 hover:bg-gray-50 space-y-2">
            <div className="flex items-start">
                <span className="inline-block w-16 text-gray-400 text-xs">
                    上書きID
                </span>
                <div className="inline-block text-xs text-gray-400 uppercase">
                    {id}
                </div>
            </div>
            <div className="flex items-start">
                <span className="inline-block w-16 font-bold">予定</span>
                <div className="inline-block">{fromToText}</div>
            </div>
            <div className="flex items-start">
                <span className="inline-block w-16 font-bold">料金</span>
                <span className="font-bold">{PriceFormatter(amount)}</span>
            </div>
            <div className="flex justify-center w-full text-center border-t pt-3">
                <button
                    className="flex items-center  text-base text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(id)}
                >
                    <TrashIcon className="w-5 h-5 mr-1" /> 消す
                </button>
            </div>
        </div>
    );
};
