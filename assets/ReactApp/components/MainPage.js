import React from "react";

function MainPage() {
    return (
        //Main layout-->
        <main className="dashboard__main">
            <div className="container py-4">
                <h1 className="text-center">Podsumowanie</h1>
                {/*//Drugs amount -->*/}
                <div className="card text-center mt-3">
                    <div className="card-header">
                        Leki/suplementy <i className="fa-solid fa-pills"></i>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Lista leków i suplementów:</h5>
                        <ul className="card-text list-group">
                            <li className="list-group-item"><span className="fw-bold">Xanax</span>: 60/120 szt.</li>
                            <li className="list-group-item"><span className="fw-bold">Witamina C</span>: 20/80 szt.</li>
                            <li className="list-group-item"><span className="fw-bold">Metanabol</span>: 4/10 amp. 10 ml</li>
                        </ul>
                        <div className="d-grid">
                            <a href="#" className="btn btn-primary mt-2">Edytuj <i className="fa-solid fa-pencil"></i></a>
                        </div>
                    </div>
                </div>
                {/*//Drugs amount -->*/}

                {/*//Schedule and storage -->*/}
                <div className="row mt-3">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                Dzisiaj muszę zażyć <i className="fa-solid fa-clock"></i>
                            </div>
                            <div className="card-body">
                                <ul className="list-unstyled">
                                    <li><span className="fw-bold">18:00</span> — Xanax: 1 szt.</li>
                                    <li><span className="fw-bold">20:00</span> — Witamina C: 1 szt.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mt-3 mt-lg-0">
                        <div className="card">
                            <div className="card-header">
                                Stan zapasów <i className="fa-solid fa-warehouse"></i>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title text-uppercase text-bg-danger text-center rounded">Uwaga! 😱</h5>
                                <p className="card-text">Zapasy następujących leków/suplementów ulegają wyczerpaniu:</p>
                                <ul className="list-unstyled">
                                    <li className="text-danger">Metanabol <span className="fw-bold">4/10 amp. 10 ml</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/*//Schedule and storage -->*/}
                </div>
            </div>
        </main>
        //Main layout-->
    );
}

export default MainPage;