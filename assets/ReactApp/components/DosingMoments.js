import React from "react";

function DosingMoments({drugId, content}) {
    const dosingMomentsArray = Object.entries(content);

    return dosingMomentsArray.length > 0 ? (
        <ul data-testid="dosing-moments">
            {Object.entries(content).map(([key, value]) => {
                const [hour, minute] = value.split(':');
                return (
                    <li key={drugId + value} data-testid={`schedule-dosingHour-${drugId}-${key}`}>
                        {hour}:{minute}
                    </li>
                );
            })}
        </ul>
    ) : null;
}

export default DosingMoments;