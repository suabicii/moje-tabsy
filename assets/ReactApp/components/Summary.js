import React, {useEffect} from "react";
import DrugList from "./DrugList";
import StockStatusChecker from "./StockStatusChecker";
import {useSelector} from "react-redux";
import {sortedDrugsSelector} from "../features/drugs/drugsSlice";
import Schedule from "./Schedule";

function Summary() {
    const drugList = useSelector(sortedDrugsSelector);
    const {name} = useSelector(state => state.user);

    const EmptyDrugListInfo = () => <p className="text-center drug-list-empty">Brak leków i suplementów</p>;

    const cardBodyClasses = `card-body ${drugList.length < 1 ? 'd-flex flex-column justify-content-center' : ''}`;

    const getQrCode = async () => (await fetch('/qr-code', {})).text();

    useEffect(() => {
        getQrCode()
            .then(res => document.querySelector("#qr-placement").innerHTML = res)
            .catch(err => console.log(err));
    }, []);

    return (
        <>
            <h1 className="text-center mt-5 mt-md-0">Witaj {name}, oto podsumowanie:</h1>
            <DrugList isEditMode={false} isEmpty={!drugList.length}/>
            <div className="row mt-3">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header text-center">
                            Dzisiaj muszę zażyć <i className="fa-solid fa-clock"></i>
                        </div>
                        <div className={cardBodyClasses}>
                            {drugList.length > 0 ? <Schedule/> : <EmptyDrugListInfo/>}
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mt-3 mt-md-0">
                    <div className="card">
                        <div className="card-header text-center">
                            Stan zapasów <i className="fa-solid fa-warehouse"></i>
                        </div>
                        <div className={cardBodyClasses}>
                            {drugList.length > 0 ? <StockStatusChecker/> : <EmptyDrugListInfo/>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col">
                    <div className="card">
                        <div className="card-header text-center">
                            Zaloguj się do aplikacji mobilnej <i className="fa-solid fa-mobile"></i>
                        </div>
                        <div id="qr-placement" className="card-body d-flex justify-content-center"></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Summary;