import React from "react";
import dayjs from "dayjs";
import {useSelector} from "react-redux";
import {sortedDrugsSelector} from "../features/drugs/drugsSlice";

function OutOfStockDates() {
    const drugList = useSelector(sortedDrugsSelector);
    const dates = [];

    drugList.forEach(({name, dosing, dosingMoments, quantity}) => {
        const dosesAmount = Object.keys(dosingMoments).length;
        const daysToOutOfStock = Math.floor(quantity / (dosing * dosesAmount));
        dates.push({
            drugName: name,
            day: dayjs().add(daysToOutOfStock, 'd')
        });
    });

    return (
        <ul className="list-unstyled">
            {dates.map(({drugName, day}, index) => (
                <li key={index}><strong>{drugName}:</strong> {day.format('DD-MM-YYYY')}</li>
            ))}
        </ul>
    );
}

export default OutOfStockDates;