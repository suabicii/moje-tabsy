import React from "react";

function DosingMoments({drugId, content}) {
    const dosingMomentsToDisplay = [];
    for (const value in content) {
        if (content.hasOwnProperty(value)) {
            const [hour, minute] = content[value].split(':');
            dosingMomentsToDisplay.push(
                <li key={drugId + value}>{hour}:{minute}</li>
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