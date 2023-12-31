import React, { useState, useEffect } from "react";
import { Calendar } from "antd";
import moment from "moment-timezone";
import { useHotkeys, isHotkeyPressed } from "react-hotkeys-hook";
import { TrashIcon } from "@heroicons/react/solid";
import AlertModal from "src/components/AlertModal";
import { useModalDialog } from "@hooks/useModalDialog";

const HotelCalendarViewStock = ({
    defaultStock,
    stockOverride,
    addStockOverride,
    deleteStockOverride,
}) => {
    const arr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

    const [overrides, setOverrides] = useState([]);

    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedRangeStart, setSelectedRangeStart] = useState(undefined);
    const [selectedRangeEnd, setSelectedRangeEnd] = useState(undefined);

    const [selectedStock, setSelectedStock] = useState(defaultStock);

    const {
        isModalOpen,
        openModal,
        closeModal,
        setModalData,
        modalContent,
        modalData,
    } = useModalDialog();

    useEffect(() => {
        const mappedOverrides = stockOverride.map((override) => {
            return {
                fromDate: moment(override.startDate).startOf("day"),
                toDate: moment(override.endDate).startOf("day"),
                stock: override.stock,
            };
        });
        setOverrides(mappedOverrides);
    }, []);

    useEffect(() => {
        if (selectedRangeStart && !selectedRangeEnd) {
            setSelectedDates([selectedRangeStart.format("YYYY-MM-DD")]);
        }
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
            // setSelectedDates([...selectedDates, ...newDates]);
            setSelectedDates([...newDates]);
        }
    }, [selectedRangeStart, selectedRangeEnd]);

    useHotkeys("esc", () => {
        onClearRangeSelection();
    });

    const onClearRangeSelection = () => {
        setSelectedRangeStart(undefined);
        setSelectedRangeEnd(undefined);
        setSelectedDates([]);
    };

    const onSelect = (value) => {
        if (isHotkeyPressed("cmd")) {
            // setSelectedDates([...selectedDates, value.format("YYYY-MM-DD")]);
            setSelectedDates([value.format("YYYY-MM-DD")]);
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

    const prepareNextTwelveMonths = () => {
        const months = arr;
        const currentYear = moment().year();
        const currentMonth = moment().month() + 1;
        const calendars = months.map((_, index) => {
            // return index;
            const thisMonth = currentMonth + index;
            if (thisMonth <= 12) {
                const thisMonthMoment = moment(`${currentYear}-${thisMonth}`);
                return {
                    month: thisMonth,
                    year: currentYear,
                    startDate: thisMonthMoment.startOf("month"),
                    endDate: thisMonthMoment.endOf("month"),
                };
            } else {
                const thisMonthMoment = moment(
                    `${currentYear + 1}-${thisMonth - 12}`
                );
                return {
                    month: thisMonth - 12,
                    year: currentYear + 1,
                    startDate: thisMonthMoment.startOf("month"),
                    endDate: thisMonthMoment.endOf("month"),
                };
            }
        });
        return calendars;
    };
    const calendars = prepareNextTwelveMonths();

    const dateFullCellRender = (value, item, currentMonth) => {
        if (
            value.isBefore(currentMonth.startOf("month")) ||
            value.isAfter(currentMonth.endOf("month"))
        ) {
            return null;
        }

        const valueString = value.format("YYYY-MM-DD");

        let stockValue = defaultStock;

        let selectedStyle = {};
        let selectedStyleText = {};

        let isSelected = false;
        if (selectedDates.indexOf(valueString) >= 0) {
            isSelected = true;
        }

        if (isSelected) {
            selectedStyle = { backgroundColor: "#FF6865" };
            selectedStyleText = { color: "#fff" };
        }

        let isOverride = false;

        overrides.map((_) => {
            if (value.isBetween(_.fromDate, _.toDate, undefined, "[]")) {
                stockValue = _.stock;
                isOverride = true;
            }
        });
        return (
            <div
                style={selectedStyle}
                className={`p-2 border-b-2 ${
                    isOverride ? "border-green-200" : "border-transparent"
                }`}
            >
                <span
                    className={`font-bold pr-1 ${
                        isOverride ? "text-green-600" : "text-gray-600"
                    }`}
                    style={selectedStyleText}
                >
                    {stockValue}
                </span>
                <sup
                    className={`p-1 rounded-sm ${
                        isOverride
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100"
                    }`}
                >
                    {value.format("DD")}
                </sup>
            </div>
        );
    };

    const addOverRide = () => {
        if (!selectedDates) {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: "上書きを適用する日付を選択してください。",
            });
            openModal();
            return;
        }

        if (!selectedStock) {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: "上書きするには新しい在庫を入力してください。",
            });
            openModal();
            return;
        }

        const startDate = moment(selectedDates[0]).startOf("day").valueOf();
        const endDate = moment(selectedDates[selectedDates.length - 1])
            .endOf("day")
            .valueOf();

        addStockOverride({
            startDate,
            endDate,
            stock: parseInt(selectedStock, 10),
        });
    };

    return (
        <div className="flex space-x-5">
            <div className="w-2/3">
                <div className="grid grid-cols-2 gap-5">
                    {calendars.map((item) => {
                        const month =
                            item.month < 10
                                ? `0${item.month}`
                                : `${item.month}`;
                        const currentMonth = moment(
                            `${item.year}-${item.month}`
                        );
                        const validStartDate = currentMonth
                            .clone()
                            .startOf("month");
                        const validEndDate = currentMonth
                            .clone()
                            .endOf("month");

                        return (
                            <div
                                className="border border-gray-200 rounded"
                                key={`${item.month}-${item.year}`}
                            >
                                <Calendar
                                    headerRender={() => (
                                        <div className="custom-header p-2 text-center font-bold text-gray-500">
                                            {item.year}年{item.month}月
                                        </div>
                                    )}
                                    dateFullCellRender={(value) =>
                                        dateFullCellRender(
                                            value,
                                            item,
                                            currentMonth
                                        )
                                    }
                                    fullscreen={false}
                                    defaultValue={moment(
                                        `${item.year}-${month}`
                                    )}
                                    onSelect={onSelect}
                                    validRange={[validStartDate, validEndDate]}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="w-1/3 space-y-4">
                {selectedDates.length > 0 && (
                    <div className="space-y-4 border border-gray-200 shadow-sm rounded p-3">
                        <h3 className="font-bold">在庫の上書き:</h3>
                        <div className="flex flex-row space-x-4">
                            <input
                                type="number"
                                min={0}
                                className="rounded w-40 border border-gray-200 shadow-sm"
                                onChange={(event) => {
                                    setSelectedStock(event.target.value);
                                }}
                                defaultValue={selectedStock}
                            />

                            <button
                                className="bg-primary text-white px-6 font-bold rounded"
                                onClick={addOverRide}
                            >
                                在庫の上書きの保存
                            </button>
                        </div>
                        {/* <div>
                            <a href="#">Click here to add price plans.</a>
                        </div> */}
                    </div>
                )}
                <div className="flex flex-row space-x-4 border border-gray-200 shadow-sm rounded p-3">
                    <button
                        disabled={selectedDates.length > 0 ? false : true}
                        className={`py-3 px-6 font-bold rounded border border-gray-200 shadow-sm w-full ${
                            selectedDates.length > 0
                                ? "opacity-100 hover:bg-gray-50"
                                : "opacity-40"
                        }`}
                        onClick={onClearRangeSelection}
                    >
                        選択解除
                    </button>
                    <div>「Esc」を押すか選択解除を押す</div>
                </div>
                <div className="border border-gray-200 shadow-sm rounded p-3">
                    <h3 className="font-bold">在庫の上書き:</h3>
                    <div className="mt-3 space-y-3">
                        {stockOverride.map((override) => {
                            return (
                                <div
                                    key={override.id}
                                    className="border border-gray-200 py-2 px-4 rounded shadow-sm flex flex-row items-center"
                                >
                                    <div className="flex-1">
                                        <span className="font-bold">
                                            在庫: {override.stock}
                                        </span>
                                        <br />
                                        {moment(override.startDate).format(
                                            "YYYY-MM-DD"
                                        )}
                                        から
                                        {moment(override.endDate).format(
                                            "YYYY-MM-DD"
                                        )}
                                        <br />
                                        <span className="text-gray-400">
                                            登録日:{" "}
                                            {moment(override.createdAt).format(
                                                "YYYY-MM-DD"
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() =>
                                                deleteStockOverride(override.id)
                                            }
                                        >
                                            <TrashIcon className="w-6 h-6 text-red-500 hover:text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
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
export default HotelCalendarViewStock;
