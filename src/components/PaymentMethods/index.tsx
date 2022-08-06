import Link from "next/link";
import React from "react";

const PaymentMethods = ({
    paymentSource,
    currentPaymentMethod,
    selectPaymentMethod,
}) => {
    return (
        <div>
            <div className=" flex justify-between items-center">
                <h2 className="font-bold text-2xl">支払い方法を選択</h2>
                <Link href="/user/settings/add-card">
                    <a target="_blank">
                        <button
                            type="button"
                            className="inline-block bg-primary hover:bg-primaryHover text-white font-bold text-base py-2 px-4 rounded"
                        >
                            カード追加
                        </button>
                    </a>
                </Link>
            </div>
            <div className="space-y-4 mt-4">
                {paymentSource &&
                    paymentSource.map((card, index) => {
                        let style =
                            "flex justify-between py-3 px-6 rounded-lg cursor-pointer ";
                        if (card.id === currentPaymentMethod) {
                            style +=
                                "border-2 border-primary bg-green-50 text-green-700";
                        } else {
                            style +=
                                "border-2 border-gray-100 text-gray-700 hover:bg-gray-50";
                        }
                        return (
                            <div
                                key={index}
                                className={style}
                                onClick={(event) => {
                                    // event.preventDefault();
                                    selectPaymentMethod(card.id);
                                }}
                            >
                                <span>
                                    <span className="inline-block mr-4">
                                        {card.brand.toUpperCase()}
                                    </span>
                                    {card.expMonth}/{card.expYear}
                                </span>
                                <span>... {card.last4}</span>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default PaymentMethods;
