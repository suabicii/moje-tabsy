import React from "react";
import dayjs from "dayjs";

function OutOfStockDates({drugList}) {
    const dates = [];

    drugList.forEach(({dosing, dosingMoments, quantity}) => {
        const dosesAmount = Object.keys(dosingMoments).length;
        const daysToOutOfStock = Math.floor(quantity / (dosing * dosesAmount));
        dates.push(dayjs().add(daysToOutOfStock, 'd'));
    });

    return (
        <ul>
            {dates.map((date, index) => (
                <li key={index}>{date.format('DD-MM-YYYY')}</li>
            ))}
        </ul>
    );
}

export default OutOfStockDates;