import React from "react";

function RemindTimeInput({handleUnitInputChange, ordinalNumber}) {
    return (
        <div className="input-group mt-3">
            <input type="number" name={`remindTime${ordinalNumber}`} id={`remindTime${ordinalNumber}`}
                   className="form-control" min="1"
                   data-testid="remindTime" required/>
            <select name={`unit${ordinalNumber}`} id={`unit${ordinalNumber}`} className="form-select text-center" defaultValue="min"
                    onChange={handleUnitInputChange}>
                <option value="min">min.</option>
                <option value="h">h</option>
                <option value="atDosingHour">W godzinie zażycia</option>
            </select>
            <span className="input-group-text ps-3" id={`remindTimeSuffix${ordinalNumber}`}>przed</span>
        </div>
    );
}

export default RemindTimeInput;