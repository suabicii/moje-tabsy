import React from "react";

function DosingMomentInput(props) {
    return (
        <div className="input-group mt-3">
            <span className="input-group-text">
                <i className="fa-solid fa-clock"></i>
            </span>
            <input
                role="timer"
                type="time"
                name={props.name}
                defaultValue={props.value}
                className="form-control dosing-moment-input"
                aria-label="Godzina przyjęcia dawki"
                data-testid={props.name}
                onChange={props.handleTimeInputChange}
                required
            />
        </div>
    );
}

export default DosingMomentInput;