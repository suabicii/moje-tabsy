import React from "react";

function SettingsForm() {
    const handleUnitInputChange = event => {
        const value = event.target.value;
        const remindTimeInput = document.getElementById('remindTime');
        const remindTimeInputSuffix = document.getElementById('remindTimeSuffix');
        if (value === 'atDosingHour') {
            remindTimeInput.style.display = 'none';
            remindTimeInputSuffix.style.display = 'none';
        } else {
            remindTimeInput.style.display = 'block';
            remindTimeInputSuffix.style.display = 'block';
        }
    };

    return (
        <div className="card mt-3">
            <div className="card-header text-center">Ustawienia ogólne</div>
            <div className="card-body">
                <form role="form" name="settings_form" onSubmit={e => {
                    e.preventDefault();
                }}>
                    <label htmlFor="reminderAmount" className="form-label">Przypomnij o dawce</label>
                    <div className="input-group text-center">
                        <input type="number" name="reminderAmount" id="reminderAmount" className="form-control"
                               min="1" defaultValue="1" data-testid="reminderAmount" required/>
                        <span className="input-group-text">raz(-y)</span>
                    </div>
                    <div className="input-group mt-3">
                        <input type="number" name="remindTime" id="remindTime"
                               className="form-control" min="1"
                               data-testid="remindTime" required/>
                        <select name="unit" id="unit" className="form-select text-center" defaultValue="min"
                                onChange={handleUnitInputChange}>
                            <option value="min">min.</option>
                            <option value="h">h</option>
                            <option value="atDosingHour">W godzinie zażycia</option>
                        </select>
                        <span className="input-group-text ps-3" id="remindTimeSuffix">przed</span>
                    </div>
                    <div className="notifier-choice mt-3">
                        <label className="form-label">Otrzymuj powiadomienia poprzez:</label>
                        <div className="form-check form-switch">
                            <input type="checkbox" name="messengerCheck" id="messengerCheck"
                                   className="form-check-input" role="switch"/>
                            <label htmlFor="messengerCheck" className="form-check-label">Messenger</label>
                        </div>
                        <div className="form-check form-switch">
                            <input type="checkbox" name="smsCheck" id="smsCheck"
                                   className="form-check-input" role="switch"/>
                            <label htmlFor="smsCheck" className="form-check-label">SMS</label>
                        </div>
                    </div>
                    <div className="d-grid mt-3">
                        <button className="btn btn-primary">Zapisz <i className="fa-solid fa-floppy-disk"></i></button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SettingsForm;