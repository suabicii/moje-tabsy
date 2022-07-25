import React from "react";
import DosingMomentInput from "./DosingMomentInput";

function DosingMomentsInputs(props) {
    const inputArray = [];

    for (const [key, value] of props.dosingMoments) {
        inputArray.push(<DosingMomentInput name={`hour${key}`} value={value}/>);
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