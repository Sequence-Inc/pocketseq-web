import React from "react";
import { TAddHotelProps } from "@appTypes/timebookTypes";

interface IPricingFormProps extends TAddHotelProps {
    hotelId: string;
}

const Pricing = (props: IPricingFormProps) => {
    return <div>Pricing</div>;
};

export default Pricing;
