import React from "react";
import DrugList from "./DrugList";
import {DrugListContainer} from "../container/DrugListContainer";
import dayjs from "dayjs";
import StockStatusChecker from "./StockStatusChecker";

function Summary({customDate}) {
    const {drugList} = DrugListContainer.useContainer();
    const currentDate = customDate || dayjs(); // custom date is for testing purposes only

    const checkIfCurrentTimeIsBeforeDosingMoment = (hour, minute) => {
        return currentDate.isBefore(currentDate.hour(parseInt(hour)).minute(parseInt(minute)), 'minute');
    };

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
                                            if (checkIfCurrentTimeIsBeforeDosingMoment(hour, minute)) {
                                                dosingMomentsToDisplay.push(
                                                    <li key={drug.id + key}>
                                                        <strong
                                                            data-testid="schedule-drugName">{drug.name} </strong> – {drug.dosing} {drug.unit}:
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
                            <StockStatusChecker/>
                        </div>
                    </div>
                </div>
            </div>
            {/* SCHEDULE AND STOCK STATUS */}
        </>
    );
}

export default Summary;