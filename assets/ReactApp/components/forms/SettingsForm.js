import React, {useState} from "react";

function SettingsForm() {
    const darkModeDefault = JSON.parse(localStorage.getItem('darkMode')) || false;
    const [darkMode, setDarkMode] = useState(darkModeDefault);

    return (
        <div className="card mt-3">
            <div className="card-header text-center">Ustawienia ogólne</div>
            <div className="card-body">
                <form role="form" name="settings_form" onSubmit={e => {
                    e.preventDefault();
                    localStorage.setItem('darkMode', `${darkMode}`);
                }}>
                    <div className="notifier-choice">
                        <label className="form-label">Ciemny motyw:</label>
                        <div className="form-check form-switch">
                            <input type="checkbox" name="messengerCheck" id="dark-mode-switcher"
                                   className="form-check-input" role="switch" data-testid="dark-mode-switcher"
                                   checked={darkMode}
                                   onChange={() => setDarkMode(prevState => !prevState)}/>
                            <label htmlFor="dark-mode-switcher"
                                   className="form-check-label">{darkMode ? 'Włączony' : 'Wyłączony'}</label>
                        </div>
                    </div>
                    <div className="d-grid mt-3">
                        <button className="btn btn-primary" data-testid="settings-submit">
                            Zapisz <i className="fa-solid fa-floppy-disk"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SettingsForm;