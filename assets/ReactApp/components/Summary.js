import React from "react";
import DrugList from "./DrugList";
import {DrugListContainer} from "../container/DrugListContainer";
import dayjs from "dayjs";

function Summary({customDate}) {
    const {drugList} = DrugListContainer.useContainer();
    const currentDate = customDate ? customDate : dayjs(); // custom date is for testing purposes only

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
                                {drugList.map(drug => {
                                    const dosingMomentsToDisplay = [];
                                    for (const key in drug.dosingMoments) {
                                        if (drug.dosingMoments.hasOwnProperty(key)) {
                                            const [hour, minute] = drug.dosingMoments[key].split(':');
                                            if (currentDate.isBefore(currentDate.hour(parseInt(hour)).minute(parseInt(minute)), 'hour')) {
                                                dosingMomentsToDisplay.push(
                                                    <li key={drug.id}>
                                                        <strong data-testid="schedule-drugName">{drug.name} </strong> – {drug.dosing} {drug.unit}:
                                                        <ul>
                                                            <li data-testid="schedule-dosingHour">{hour}:{minute}</li>
                                                        </ul>
                                                    </li>
                                                );
                                            }
                                        }
                                    }
                                    return dosingMomentsToDisplay;
                                })}
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