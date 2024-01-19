import React from "react";

function SettingsForm() {
    return (
        <div className="card mt-3">
            <div className="card-header text-center">Ustawienia ogólne</div>
            <div className="card-body">
                <form role="form" name="settings_form" onSubmit={e => {
                    e.preventDefault();
                }}>
                    <div className="notifier-choice">
                        <label className="form-label">Ciemny motyw:</label>
                        <div className="form-check form-switch">
                            <input type="checkbox" name="messengerCheck" id="messengerCheck"
                                   className="form-check-input" role="switch"/>
                            <label htmlFor="messengerCheck" className="form-check-label">Wyłączony</label>
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