import React from "react";

function DosingMomentInput(props) {
    return (
        <div className="input-group mt-3">
            <span className="input-group-text">
                <i className="fa-solid fa-clock"></i>
            </span>
            <input
                type="time"
                name={props.name}
                defaultValue={props.value}
                className="form-control"
                aria-label="Godzina przyjęcia dawki"
                data-testid={`${props.name}-test`}
                required
            />
        </div>
    );
}

export default DosingMomentInput;