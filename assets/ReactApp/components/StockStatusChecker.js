import React from "react";
import {useSelector} from "react-redux";

function StockStatusChecker() {
    const drugList = useSelector(state => state.drugs);

    const runningOutOfStock = [];
    const outOfStock = [];
    const percentsToWarnUserAboutRunningOutOfStock = 30;
    drugList.forEach(drug => {
        if (parseInt(drug.quantity) === 0) {
            outOfStock.push(drug);
        } else if (drug.quantity * 100 / drug.quantityMax <= percentsToWarnUserAboutRunningOutOfStock) {
            runningOutOfStock.push(drug);
        }
    });

    if (!runningOutOfStock.length && !outOfStock.length) {
        return (
            <>
                <h5 className="card-title text-uppercase text-bg-success text-center rounded"
                    data-testid="stock-ok">Ok 👍</h5>
                <p className="card-text">Zapasy Twoich leków i suplementów są wystarczające 🤩</p>
            </>
        );
    } else {
        return (
            <>
                <h5 className="card-title text-uppercase text-bg-danger text-center rounded"
                    data-testid="stock-warning">Uwaga! 😱</h5>
                <ul className="list-unstyled">
                    {
                        runningOutOfStock.length > 0 &&
                        <p className="card-text">Zapasy następujących leków/suplementów ulegają wyczerpaniu:</p>
                    }
                    {runningOutOfStock.length > 0 && runningOutOfStock.map(drug =>
                        <li key={drug.id} className="text-danger" data-testid="drug-end">
                            {drug.name} – <strong>{drug.quantity}/{drug.quantityMax}</strong>
                        </li>
                    )}
                    {
                        outOfStock.length > 0 &&
                        <p className="card-text">Zapasy następujących leków/suplementów uległy wyczerpaniu:</p>
                    }
                    {outOfStock.length > 0 && outOfStock.map(drug =>
                        <li key={drug.id} className="text-bg-danger" data-testid="drug-end">
                            {drug.name} – <strong>{drug.quantity}/{drug.quantityMax}</strong>
                        </li>
                    )}
                </ul>
            </>
        );
    }
}

export default StockStatusChecker;