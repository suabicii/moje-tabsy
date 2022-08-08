import React from "react";
import DosingMomentInput from "./DosingMomentInput";

function DosingMomentsInputs(props) {
    const inputArray = [];

    const addInputToArray = (name, value = "") => {
        inputArray.push(
            <DosingMomentInput
                handleTimeInputChange={props.handleTimeInputChange}
                name={name}
                value={value}
            />
        );
    };

    if (props.dosingMoments) {
        for (const [key, value] of props.dosingMoments) {
            if (parseInt(key.substring(key.length - 1)) > props.inputAmount) {
                break;
            }
            addInputToArray(key, value);
        }
        if (props.inputAmount > props.dosingMoments.length) {
            for (let i = props.dosingMoments.length; i < props.inputAmount; i++) {
                addInputToArray(`hour${i + 1}`);
            }
        }
    } else {
        for (let i = 0; i < props.inputAmount; i++) {
            addInputToArray(`hour${i + 1}`);
        }
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

export default DosingMomentsInputs;