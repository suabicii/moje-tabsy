import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setDarkMode} from "../../features/darkMode/darkModeSlice";
import changeTheme from "../../utils/changeTheme";

function SettingsForm() {
    const dispatch = useDispatch();
    const darkMode = useSelector(state => state.darkMode);
    const [darkModeLocal, setDarkModeLocal] = useState(darkMode);

    return (
        <div className="card mt-3">
            <div className="card-header text-center">Ustawienia ogólne</div>
            <div className="card-body">
                <form role="form" name="settings_form" onSubmit={e => {
                    e.preventDefault();
                    dispatch(setDarkMode(darkModeLocal));
                    localStorage.setItem('darkMode', `${darkModeLocal}`);
                    changeTheme(darkModeLocal);
                }}>
                    <div className="dark-mode">
                        <label className="form-label">Ciemny motyw:</label>
                        <div className="form-check form-switch">
                            <input type="checkbox" name="messengerCheck" id="dark-mode-switcher"
                                   className="form-check-input" role="switch" data-testid="dark-mode-switcher"
                                   checked={darkModeLocal}
                                   onChange={() => setDarkModeLocal(prevState => !prevState)}/>
                            <label htmlFor="dark-mode-switcher"
                                   className="form-check-label">{darkModeLocal ? 'Włączony' : 'Wyłączony'}</label>
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