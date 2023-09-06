import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {sortedDrugsSelector} from "../features/drugs/drugsSlice";
import dayjs from "dayjs";
import DosingMoments from "./DosingMoments";

function Schedule() {
    const drugList = useSelector(sortedDrugsSelector);
    const currentDate = dayjs();
    const [drugListReduced, setDrugListReduced] = useState([]);
    const [dosingMomentsContent, setDosingMomentsContent] = useState([]);

    const checkIfCurrentTimeIsBeforeDosingMoment = (hour, minute) => {
        return currentDate.isBefore(currentDate.hour(parseInt(hour)).minute(parseInt(minute)), 'minute');
    };

    useEffect(() => {
        drugList.forEach(drug => {
            const dosingMoments = Object.entries(drug.dosingMoments);

            for (const [key, value] of dosingMoments) {
                const [hour, minute] = value.split(':');
                if (checkIfCurrentTimeIsBeforeDosingMoment(hour, minute)) {
                    setDrugListReduced([...drugListReduced, drug]);
                }
            }
        });
    }, []);

    return (
        <>
            {drugListReduced.length > 0 &&
                <ul className="list-unstyled">
                    {drugListReduced.map(({dosing, dosingMoments, id, name, unit}, index) => (
                        <div key={`${name}${id}`}>
                            <strong
                                data-testid={`schedule-drugName${id}`}>{name} </strong> – {dosing} {unit}:
                            <DosingMoments content={dosingMoments} drugId={id}/>
                        </div>
                    ))}
                </ul>
            }
        </>
    );
}

export default Schedule;