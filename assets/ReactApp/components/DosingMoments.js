import React from "react";
import dayjs from "dayjs";

function DosingMoments({drugId, content}) {
    const currentDate = dayjs();

    const checkIfCurrentTimeIsBeforeDosingMoment = (hour, minute) => {
        return currentDate.isBefore(currentDate.hour(parseInt(hour)).minute(parseInt(minute)), 'minute');
    };

    const dosingMomentsToDisplay = [];
    for (const [key, value] of Object.entries(content)) {
        const [hour, minute] = value.split(':');
        if (checkIfCurrentTimeIsBeforeDosingMoment(hour, minute)) {
            dosingMomentsToDisplay.push(
                <li key={drugId + value} data-testid={`schedule-dosingHour-${drugId}-${key}`}>{hour}:{minute}</li>
            );
        }
    }
    return dosingMomentsToDisplay.length > 0 ? (
        <ul data-testid="dosing-moments">
            {dosingMomentsToDisplay}
        </ul>
    ) : null;
}

export default DosingMoments;