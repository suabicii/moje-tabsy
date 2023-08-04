import React from "react";

function DosingMoments({content}) {
    const dosingMomentsToDisplay = [];
    for (const key in content) {
        if (content.hasOwnProperty(key)) {
            const [hour, minute] = content[key].split(':');
            dosingMomentsToDisplay.push(
                <li key={drug.id + key} data-testid="schedule-dosingHour">{hour}:{minute}</li>
            );
        }
    }
    return (
        <ul>
            {dosingMomentsToDisplay}
        </ul>
    );
}

export default DosingMoments;