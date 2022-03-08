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

const HostDayOfWeekView = ({ plans, settings, spaceId }) => {
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
                    .filter((_) => _.type === "DAY_OF_WEEK")
                    .map((_) => {
                        return {
                            ..._,
                            fromDate: moment(_.fromDate),
                            toDate: moment(_.toDate),
                        };
                    })
            );
            setDefaultDailyPlan(
                plans.filter((_) => _.isDefault && _.type === "DAILY")[0]
            );
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

    if (!initialLoadComplete) return <LoadingSpinner />;

    const renderPricePlans = (plans, filter) => {
        return plans
            .filter((_) => _.type === filter)
            .map((plan) => (
                <PriceOverride plan={plan} filter="DAY_OF_WEEK" key={plan.id} />
            ));
    };

    const selectionActive = selectedDates.length > 0;

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf("day");
    };

    const addSettingOverride = async (setting) => {
        try {
            const { data } = await settingOverrideMutation({
                variables: {
                    spaceId,
                    spaceSetting: setting,
                },
            });
            alert(data.overrideSpaceSetting.result.message);
            setShowAddSettingsForm(false);
            setShowAddPriceForm(false);
        } catch (error) {
            alert(error.message);
        }
    };

    const addPriceOverride = async ({ pricePlanId, input }) => {
        try {
            const { data } = await priceOverrideMutation({
                variables: {
                    pricePlanId,
                    input,
                },
            });
            alert(data.addPricePlanOverride.result.message);
            setShowAddSettingsForm(false);
            setShowAddPriceForm(false);
        } catch (error) {
            alert(error.message);
        }
    };

    const currentSelection =
        selectedDates.length > 1
            ? [selectedDates[0], selectedDates[selectedDates.length - 1]]
            : null;

    return (
        <div className="select-none space-y-4">
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
                    Clear Selection
                </button>
            </div>
            <div className="w-full">
                <div className="py-4 w-full">
                    <div className="flex items-center justify-between w-full">
                        <h2 className="flex-grow text-lg font-bold text-gray-600">
                            Settings override
                        </h2>
                        <div>
                            <button
                                onClick={() => setShowAddSettingsForm(true)}
                                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary}`}
                            >
                                Add settings override
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
                        />
                    )}
                    <div className="mt-4 space-y-3">
                        {settings.map((setting) => (
                            <SettingsOverride
                                setting={setting}
                                key={setting.id}
                            />
                        ))}
                    </div>
                </div>
                <div className="py-4 w-full">
                    <div className="flex items-center justify-between w-full">
                        <h2 className="flex-grow text-lg font-bold text-gray-600">
                            Price override
                        </h2>
                        <div>
                            <button
                                onClick={() => setShowAddPriceForm(true)}
                                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary}`}
                            >
                                Add price override
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
        </div>
    );
};

export default HostDayOfWeekView;
