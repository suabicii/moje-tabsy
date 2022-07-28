import React, {useState} from "react";
import DosingMomentsInputs from "./DosingMomentsInputs";

function DrugForm(props) {
    const dosingMomentInputDefaultAmount = props.drug ? Object.keys(props.drug.dosingMoments).length : 1;
    const dosingMoments = props.drug ? Object.entries(props.drug.dosingMoments) : null;
    const [dosingMomentInputAmount, setDosingMomentInputAmount] = useState(dosingMomentInputDefaultAmount);
    const handleChangeDosingInput = value => {
        const dosingMomentInputs = [...document.querySelectorAll('.dosing-moment-input')];
        if (value > dosingMomentInputs.length) {
            setDosingMomentInputAmount(dosingMomentInputAmount + 1);
        } else {
            setDosingMomentInputAmount(dosingMomentInputAmount - 1);
        }
    };

    return (
        <>
            <div className="card-header text-center">
                <button className="btn btn-close float-start" onClick={() => {
                    props.setIsFormVisible(false);
                }}></button>
                {props.drug ? 'Edytuj' : 'Dodaj'} lek/suplement
            </div>
            <div className="card-body">
                <form role="form" name="drug_form" onSubmit={e => {
                    e.preventDefault();
                }}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-floating mt-3">
                                <input type="text" className="form-control" id="name" name="name"
                                       defaultValue={props.drug ? props.drug.name : ""} placeholder="Nazwa" required
                                />
                                <label htmlFor="name">Nazwa</label>
                            </div>
                            <div className="form-floating mt-3">
                                <input type="text" className="form-control" id="unit" name="unit"
                                       defaultValue={props.drug ? props.drug.unit : ""} placeholder="Jednostka" required
                                />
                                <label htmlFor="unit">Jednostka (szt., ml. itp.)</label>
                            </div>
                            <div className="form-floating mt-3">
                                <input type="number" step="0.01" name="dosing" id="dosing" className="form-control"
                                       min="0.01"
                                       aria-valuemin="0.01"
                                       defaultValue={props.drug ? props.drug.dosing : ""}
                                       placeholder="Dawkowanie (ile na raz?)" required
                                />
                                <label htmlFor="dosing">Dawkowanie (ile na raz?)</label>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-floating mt-3">
                                <input type="number" step="1" className="form-control" id="quantity" name="quantity"
                                       defaultValue={props.drug ? props.drug.quantity : ""} placeholder="Bieżąca ilość"
                                       min="1" aria-valuemin="1" required
                                />
                                <label htmlFor="quantity">Bieżąca ilość</label>
                            </div>
                            <div className="form-floating mt-3">
                                <input type="number" step="1" className="form-control" id="quantityMax"
                                       defaultValue={props.drug ? props.drug.quantityMax : ""} name="quantityMax"
                                       placeholder="Ilość całkowita" min="1" aria-valuemin="1" required
                                />
                                <label htmlFor="quantityMax">Ilość całkowita</label>
                            </div>
                            <div className="form-floating mt-3">
                                <input type="number" step="1" className="form-control" id="dailyDosing"
                                       name="daily_dosing"
                                       placeholder="Ile razy dziennie?"
                                       defaultValue={props.drug ? Object.keys(props.drug.dosingMoments).length : "1"}
                                       aria-valuemin="1" min="1"
                                       required data-testid="dailyDosing"
                                       onChange={e => {
                                           handleChangeDosingInput(e.target.value);
                                       }}
                                />
                                <label htmlFor="dailyDosing">Ile razy dziennie?</label>
                            </div>
                        </div>
                    </div>
                    <div className="dosing-hours mt-3">
                        <h4 className="text-center">Godziny przyjęcia dawki</h4>
                        <DosingMomentsInputs dosingMoments={dosingMoments} inputAmount={dosingMomentInputAmount}/>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                        <button type="submit" className="btn btn-info px-5">Zapisz</button>
                        <button type="button" className="btn btn-outline-dark px-5" onClick={() => {
                            props.setIsFormVisible(false);
                        }}>
                            Anuluj
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default DrugForm;