import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { Calendar, Alert } from "antd";
import moment, { Moment } from "moment";
import { useHotkeys, isHotkeyPressed } from "react-hotkeys-hook";

const defaultPrice = 1500;
const overRidePrice = { "2022-01-05": 2000, "2022-01-15": 5000 };

const HostCalendarView = ({ plans }) => {
    const [selectedDates, setSelectedDates] = useState([]);

    const [panelChanged, setPanelChanged] = useState(false);
    const [selectedRangeStart, setSelectedRangeStart] = useState(undefined);
    const [selectedRangeEnd, setSelectedRangeEnd] = useState(undefined);

    const [defaultDailyPlan, setDefaultDailyPlan] = useState<any>();
    const [overRides, setOverRides] = useState([]);

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
            setDefaultDailyPlan(
                plans.filter((_) => _.isDefault && _.type === "DAILY")[0]
            );
        }
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
        alert("This will change all selection.");
        setPanelChanged(true);
    };

    const fullCellRenderer = (value: Moment) => {
        let cellClass = "ant-picker-cell-inner ant-picker-calendar-date";
        let dateClass = "ant-picker-calendar-date-value";
        let selectedStyle = {};
        let selectedStyleText = {};

        const valueString = value.format("YYYY-MM-DD");

        if (valueString === moment().format("YYYY-MM-DD")) {
            cellClass += " ant-picker-cell-today";
            dateClass += " ant-picker-calendar-date-today";
        }

        // if (selectedRangeStart && selectedRangeEnd) {
        //   if (value >= selectedRangeStart && value <= selectedRangeEnd) {
        //     selectedStyle = { backgroundColor: "red" };
        //   }
        // }
        if (selectedDates.indexOf(valueString) >= 0) {
            selectedStyle = { backgroundColor: "#FF6865", borderRadius: 3 };
            selectedStyleText = { color: "#fff" };
        }

        let data = null;
        // check if date is between override dates;
        overRides.map((_) => {
            if (value.isBetween(_.fromDate, _.toDate)) {
                data = <div className="text-blue-600">{_.amount}円</div>;
            } else {
                data = (
                    <div className="text-gray-400">
                        {defaultDailyPlan?.amount}円
                    </div>
                );
            }
        });

        return (
            <div className={cellClass} style={selectedStyle}>
                <div className={dateClass} style={selectedStyleText}>
                    {value.format("DD")}
                </div>
                <div className="ant-picker-calendar-date-content ">{data}</div>
            </div>
        );
    };

    return (
        <div>
            {/* <Alert
                message={`You selected start date: ${
                    selectedRangeStart &&
                    selectedRangeStart.format("YYYY-MM-DD")
                }`}
            />
            <Alert
                message={`You selected end date: ${
                    selectedRangeEnd && selectedRangeEnd.format("YYYY-MM-DD")
                }`}
            /> */}

            <button onClick={onClearRangeSelection}>Clear Selection</button>
            <Calendar
                onSelect={onSelect}
                onPanelChange={onPanelChange}
                dateFullCellRender={fullCellRenderer}
            />
        </div>
    );
};

export default HostCalendarView;
