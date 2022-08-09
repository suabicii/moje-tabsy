import React, {useState} from "react";
import RemindTimeInputs from "./special-inputs/RemindTimeInputs";

function SettingsForm() {
    const [remindTimeInputAmount, setRemindTimeInputAmount] = useState(1);

    const handleUnitInputChange = event => {
        const value = event.target.value;
        const remindTimeInput = event.target.previousSibling;
        const unitInputSuffix = event.target.nextSibling;
        if (value === 'atDosingHour') {
            remindTimeInput.style.display = 'none';
            unitInputSuffix.style.display = 'none';
        } else {
            remindTimeInput.style.display = 'block';
            unitInputSuffix.style.display = 'block';
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
                               min="1" defaultValue="1" data-testid="reminderAmount"
                               onChange={e => {
                                   setRemindTimeInputAmount(parseInt(e.target.value));
                               }} required
                        />
                        <span className="input-group-text">raz(-y)</span>
                    </div>
                    <RemindTimeInputs handleUnitInputChange={handleUnitInputChange} amount={remindTimeInputAmount}/>
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