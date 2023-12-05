import React from "react";
import DrugList from "./DrugList";
import StockStatusChecker from "./StockStatusChecker";
import {useSelector} from "react-redux";
import {sortedDrugsSelector} from "../features/drugs/drugsSlice";
import Schedule from "./Schedule";
import OutOfStockDates from "./OutOfStockDates";

function Summary() {
    const drugList = useSelector(sortedDrugsSelector);

    const EmptyDrugListInfo = () => <p className="text-center drug-list-empty">Brak leków i suplementów</p>;

    return (
        <>
            <h1 className="text-center mt-5 mt-md-0">Podsumowanie</h1>
            <DrugList isEditMode={false} isEmpty={!drugList.length}/>
            <div className="row mt-3">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header text-center">
                            Dzisiaj muszę zażyć <i className="fa-solid fa-clock"></i>
                        </div>
                        <div
                            className={`card-body ${drugList.length < 1 ? 'd-flex flex-column justify-content-center' : ''}`}>
                            {drugList.length > 0 ? <Schedule/> : <EmptyDrugListInfo/>}
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mt-3 mt-md-0">
                    <div className="card">
                        <div className="card-header text-center">
                            Stan zapasów <i className="fa-solid fa-warehouse"></i>
                        </div>
                        <div
                            className={`card-body ${drugList.length < 1 ? 'd-flex flex-column justify-content-center' : ''}`}>
                            {drugList.length > 0 ? <StockStatusChecker/> : <EmptyDrugListInfo/>}
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mt-3 mt-md-0">
                    <div className="card">
                        <div className="card-header text-center">
                            Kiedy zapasy zostaną wyczerpane? <i className="fa-solid fa-calendar-days"></i>
                        </div>
                        <div className="card-body">
                            {drugList.length > 0 ? <OutOfStockDates drugList={drugList}/> : <EmptyDrugListInfo/>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Summary;