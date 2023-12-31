import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { Calendar } from "antd";
import moment, { Moment } from "moment";
import { useHotkeys, isHotkeyPressed } from "react-hotkeys-hook";
import { LoadingSpinner } from "@comp";
import { useMutation } from "@apollo/client";
import {
    ADD_PRICE_OVERRIDE,
    ADD_SETTING_OVERRIDE,
} from "src/apollo/queries/space.queries";
import {
    PriceOverride,
    PriceOverrideForm,
    SettingsOverride,
    SettingsOverrideForm,
} from "../HostCalendarView";
import { daysOfWeek as DAYS } from "src/components/DayOfWeekOverride";
import HourlyOverride, { HoursProps, Day } from "src/components/HourlyOverride";
import AlertModal from "src/components/AlertModal";
import { useModalDialog } from "@hooks/useModalDialog";

const testData: HoursProps = [
    {
        hour: 9,
        dailyData: {
            stock: 5,
            prices: [
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        hour: 10,
        dailyData: {
            stock: 5,
            prices: [
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        hour: 11,
        dailyData: {
            stock: 5,
            prices: [
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        hour: 12,
        dailyData: {
            stock: 5,
            prices: [
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        hour: 13,
        dailyData: {
            stock: 5,
            prices: [
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        hour: 14,
        dailyData: {
            stock: 5,
            prices: [
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        hour: 15,
        dailyData: {
            stock: 5,
            prices: [
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        hour: 16,
        dailyData: {
            stock: 5,
            prices: [
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        hour: 17,
        dailyData: {
            stock: 5,
            prices: [
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        hour: 18,
        dailyData: {
            stock: 5,
            prices: [
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
];

const testDay: Day = {
    workHours: { startTime: 9, endTime: 18 },
    breakHours: { startTime: 13, endTime: 14 },
};

const HostDayView = ({ plans, settings, spaceId }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedDates, setSelectedDates] = useState([]);

    const [panelChanged, setPanelChanged] = useState(false);
    const [selectedRangeStart, setSelectedRangeStart] = useState(undefined);
    const [selectedRangeEnd, setSelectedRangeEnd] = useState(undefined);

    const [defaultDailyPlan, setDefaultDailyPlan] = useState<any>();
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
            setOverRides(overRide.filter((_) => _.type === "DAY_OF_WEEK"));
            setDefaultDailyPlan(
                plans.filter((_) => _.isDefault && _.type === "DAILY")[0]
            );
        }
        if (settings) {
            const setting = settings.map((_) => {
                return _;
            });
            setDefaultSetting(setting.filter((_) => _.isDefault === true)[0]);
            setSettingOverrides(setting.filter((_) => _.isDefault === false));
        }
        setInitialLoadComplete(true);
    }, []);

    useEffect(() => {
        if (selectedRangeStart && selectedRangeEnd) {
            const start = moment(selectedRangeStart);
            const end = moment(selectedRangeEnd);

            const numberOfDays = end.diff(start, "days");
            let newDates = [];
            for (let i = 0; i <= numberOfDays; i++) {
                const newDate = moment(start, "YYYY-MM-DD")
                    .add(i, "days")
                    .format("YYYY-MM-DD");
                newDates.push(newDate);
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

    if (!initialLoadComplete)
        return (
            <div className="my-20">
                <LoadingSpinner />
            </div>
        );

    const renderPricePlans = (plans, filter) => {
        return plans
            .filter((_) => _.type === filter)
            .map((plan) => (
                <PriceOverride
                    plan={plan}
                    filter="DAY_OF_WEEK"
                    key={plan.id}
                    handleDelete={(id) => {
                        console.log(id);
                    }}
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
                title: "設定上書きが追加されました",
                text: data.overrideSpaceSetting.result.message,
                onConfirm: () => {
                    window.location.reload();
                },
            });
            openModal();
            setShowAddSettingsForm(false);
            setShowAddPriceForm(false);
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
                title: "料金上書きが追加されました",
                text: data.addPricePlanOverride.result.message,
                onConfirm: () => {
                    window.location.reload();
                },
            });
            openModal();
            setShowAddSettingsForm(false);
            setShowAddPriceForm(false);
        } catch (error) {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: error.message,
            });
            openModal();
        }
    };

    const currentSelection =
        selectedDates.length > 1
            ? [selectedDates[0], selectedDates[selectedDates.length - 1]]
            : null;

    const createOverrideDataFromPlan = (day, setting, plan) => {
        const defaultPrices = {
            daily:
                plans.filter((_) => _.type === "DAILY" && _.duration === 1)[0]
                    ?.amount | 0,
            hourly:
                plans.filter((_) => _.type === "HOURLY" && _.duration === 1)[0]
                    ?.amount | 0,
            fiveMinutes:
                plans.filter((_) => _.type === "MINUTES" && _.duration === 5)[0]
                    ?.amount | 0,
            tenMinutes:
                plans.filter(
                    (_) => _.type === "MINUTES" && _.duration === 10
                )[0]?.amount | 0,
            fifteenMinutes:
                plans.filter(
                    (_) => _.type === "MINUTES" && _.duration === 15
                )[0]?.amount | 0,
            thirtyMinutes:
                plans.filter(
                    (_) => _.type === "MINUTES" && _.duration === 30
                )[0]?.amount | 0,
            fortyFiveMinutes:
                plans.filter(
                    (_) => _.type === "MINUTES" && _.duration === 45
                )[0]?.amount | 0,
        };

        const daily = plan.filter(
            (_) => _.type === "DAILY" && _.duration === 1
        )[0];
        const hourly = plan.filter(
            (_) => _.type === "HOURLY" && _.duration === 1
        )[0];
        const fiveMinutes = plan.filter(
            (_) => _.type === "MINUTES" && _.duration === 5
        )[0];
        const tenMinutes = plan.filter(
            (_) => _.type === "MINUTES" && _.duration === 10
        )[0];
        const fifteenMinutes = plan.filter(
            (_) => _.type === "MINUTES" && _.duration === 15
        )[0];
        const thirtyMinutes = plan.filter(
            (_) => _.type === "MINUTES" && _.duration === 30
        )[0];
        const fortyFiveMinutes = plan.filter(
            (_) => _.type === "MINUTES" && _.duration === 45
        )[0];
        return {
            day,
            dailyData: {
                workHours: {
                    startTime: setting?.openingHr,
                    endTime: setting?.closingHr,
                },
                breakHours: {
                    startTime: setting?.breakFromHr,
                    endTime: setting?.breakToHr,
                },
                stock: setting?.totalStock,
                prices: [
                    {
                        pricingCategory: "1日",
                        price: daily?.amount | defaultPrices.daily,
                    },
                    {
                        pricingCategory: "1時間",
                        price: hourly?.amount | defaultPrices.hourly,
                    },
                    {
                        pricingCategory: "5分",
                        price: fiveMinutes?.amount | defaultPrices.fiveMinutes,
                    },
                    {
                        pricingCategory: "10分",
                        price: tenMinutes?.amount | defaultPrices.tenMinutes,
                    },
                    {
                        pricingCategory: "15分",
                        price:
                            fifteenMinutes?.amount |
                            defaultPrices.fifteenMinutes,
                    },
                    {
                        pricingCategory: "30分",
                        price:
                            thirtyMinutes?.amount | defaultPrices.thirtyMinutes,
                    },
                    {
                        pricingCategory: "45分",
                        price:
                            fortyFiveMinutes?.amount |
                            defaultPrices.fortyFiveMinutes,
                    },
                ],
            },
        };
    };

    const overrideData = () => {
        let overrideObject = [];
        plans
            .filter((_) => _.overrides.length > 0)
            .map((plan) => {
                plan.overrides.map((_) => {
                    if (_.type === "DAY_OF_WEEK") {
                        _.daysOfWeek.map((day) => {
                            overrideObject.push(
                                createOverrideDataFromPlan(
                                    DAYS[day],
                                    defaultSetting,
                                    [{ ...plan, amount: _.amount }]
                                )
                            );
                        });
                    }
                });
                return overrideObject;
            });

        const finalData = [];

        DAYS.map((day) => {
            let exists = false;
            overrideObject.map((_) => {
                if (_.day === day) {
                    exists = true;
                    finalData.push(_);
                }
            });
            if (!exists) {
                finalData.push(
                    createOverrideDataFromPlan(
                        day,
                        defaultSetting,
                        plans.filter((_) => _.isDefault)
                    )
                );
            }
        });
        return finalData;
    };

    return (
        <div className="select-none space-y-4">
            <div>
                <HourlyOverride day={testDay} data={testData} />
            </div>
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
                            onSave={(value) => addSettingOverride(value)}
                            loading={loading}
                            type="DATE_TIME"
                        />
                    )}
                    <div className="mt-4 space-y-3">
                        {settings.map((setting) => (
                            <SettingsOverride
                                setting={setting}
                                key={setting.id}
                                deleteSettingOverride={() => {}}
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
                            {renderPricePlans(plans, "DAILY")}
                        </div>
                        <div className="space-y-3 w-full">
                            <h3 className="text-base font-bold text-gray-500">
                                時間対
                            </h3>
                            {renderPricePlans(plans, "HOURLY")}
                        </div>
                        <div className="space-y-3 w-full">
                            <h3 className="text-base font-bold text-gray-500">
                                分対
                            </h3>
                            {renderPricePlans(plans, "MINUTES")}
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

export default HostDayView;
