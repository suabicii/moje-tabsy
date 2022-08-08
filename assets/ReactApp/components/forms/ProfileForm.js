import React from "react";

function ProfileForm() {
    return (
        <div className="card mt-3">
            <div className="card-header text-center">Ustawienia profilu</div>
            <div className="card-body">
                <form role="form" name="profile_form" onSubmit={e => {
                    e.preventDefault();
                }}>
                    <div className="form-floating mt-3">
                        <input type="text" className="form-control" id="name" name="name"
                               placeholder="Imię" data-testid="firstName" required
                        />
                        <label htmlFor="name">Imię</label>
                    </div>
                    <div className="form-floating mt-3">
                        <input type="email" className="form-control" id="email" name="email"
                               placeholder="Email" data-testid="email" required
                        />
                        <label htmlFor="name">Email</label>
                    </div>
                    <div className="form-floating mt-3">
                        <input type="password" className="form-control" id="oldPassword" name="oldPassword"
                               placeholder="Stare hasło" data-testid="oldPassword"
                        />
                        <label htmlFor="name">Stare hasło</label>
                    </div>
                    <div className="form-floating mt-3">
                        <input type="password" className="form-control" id="newPassword" name="newPassword"
                               placeholder="Nowe hasło" data-testid="newPassword"
                        />
                        <label htmlFor="name">Nowe hasło</label>
                    </div>
                    <div className="form-floating mt-3">
                        <input type="password" className="form-control" id="newPasswordRepeated" name="newPasswordRepeated"
                               placeholder="Nowe hasło" data-testid="newPasswordRepeated"
                        />
                        <label htmlFor="name">Powtórz nowe hasło</label>
                    </div>
                    <div className="d-grid mt-3">
                        <button className="btn btn-primary">Zapisz <i className="fa-solid fa-floppy-disk"></i></button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProfileForm;