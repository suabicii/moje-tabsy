import React from "react";
import RemindTimeInput from "./RemindTimeInput";

function RemindTimeInputs({amount, handleUnitInputChange}) {
    const inputArray = [];

    for (let i = 0; i < amount; i++) {
        inputArray.push(<RemindTimeInput handleUnitInputChange={handleUnitInputChange} ordinalNumber={i + 1} />);
    }

    return (
        <>
            {inputArray.map((item, index) => (
                <div key={index}>
                    {item}
                </div>
            ))}
        </>
    );
}

export default RemindTimeInputs;