import React from "react";
import DrugList from "./DrugList";

function Summary() {
    return (
        <>
            <h1 className="text-center mt-5 mt-md-0">Podsumowanie</h1>
            <DrugList isEditMode={false}/>
            {/* SCHEDULE AND STOCK STATUS */}
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
                                <li className="text-danger">Metanabol <span className="fw-bold">4/10 amp. 10 ml</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/* SCHEDULE AND STOCK STATUS */}
        </>
    );
}

export default Summary;