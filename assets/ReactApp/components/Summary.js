import React from "react";
import DrugList from "./DrugList";
import dayjs from "dayjs";
import StockStatusChecker from "./StockStatusChecker";
import {useSelector} from "react-redux";
import {sortedDrugsSelector} from "../features/drugs/drugsSlice";
import DosingMoments from "./DosingMoments";

function Summary() {
    const drugList = useSelector(sortedDrugsSelector);

    return (
        <>
            <h1 className="text-center mt-5 mt-md-0">Podsumowanie</h1>
            <DrugList isEditMode={false}/>
            {/* SCHEDULE AND STOCK STATUS */}
            <div className="row mt-3">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header text-center">
                            Dzisiaj muszę zażyć <i className="fa-solid fa-clock"></i>
                        </div>
                        <div className="card-body">
                            <ul className="list-unstyled">
                                {drugList.map(({dosing, dosingMoments, id, name, unit}) =>
                                    (
                                        <div key={`${name}${id}`}>
                                            <strong
                                                data-testid={`schedule-drugName${id}`}>{name} </strong> – {dosing} {unit}:
                                            <DosingMoments content={dosingMoments} drugId={id}/>
                                        </div>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mt-3 mt-lg-0">
                    <div className="card">
                        <div className="card-header text-center">
                            Stan zapasów <i className="fa-solid fa-warehouse"></i>
                        </div>
                        <div className="card-body">
                            <StockStatusChecker/>
                        </div>
                    </div>
                </div>
            </div>
            {/* SCHEDULE AND STOCK STATUS */
            }
        </>
    )
        ;
}

export default Summary;