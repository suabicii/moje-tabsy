import React, {useEffect, useState} from "react";
import DosingMomentsInputs from "./DosingMomentsInputs";
import {DrugListContainer} from "../../container/DrugListContainer";

function DrugForm(props) {
    const dosingMomentInputDefaultAmount = props.drug ? Object.keys(props.drug.dosingMoments).length : 1;
    const dosingMoments = props.drug ? Object.entries(props.drug.dosingMoments) : null;
    const [dosingMomentInputAmount, setDosingMomentInputAmount] = useState(dosingMomentInputDefaultAmount);
    const [allInputValues, setAllInputValues] = useState({});
    const [timeInputValues, setTimeInputValues] = useState({});
    const {addDrug, drugList, editDrug} = DrugListContainer.useContainer();

    useEffect(() => {
        setAllInputValues( prevState => ({
            ...prevState,
            dosingMoments: {
                ...timeInputValues
            }
        }));
    }, [timeInputValues]);

    useEffect(() => {
        localStorage.setItem('drugs', JSON.stringify(drugList));
    });

    /** EVENT HANDLERS */
    const handleChangeDosingInput = value => {
        setDosingMomentInputAmount(value);
    };

    const handleInputChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        setAllInputValues(prevState => ({...prevState, [name]: value}));
    };

    const handleTimeInputChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        setTimeInputValues(prevState => ({...prevState, [name]: value}));
    };

    const handleSubmit = () => {
        if (props.drug) {
            editDrug(props.drug.id, allInputValues);
        } else {
            const id = drugList ? drugList[drugList.length - 1].id + 1 : 1;
            addDrug({id, ...allInputValues});
        }
        props.setIsFormVisible(false);
    };
    /** EVENT HANDLERS */


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
                    handleSubmit();
                }}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-floating mt-3">
                                <input type="text" className="form-control" id="name" name="name"
                                       defaultValue={props.drug ? props.drug.name : ""} placeholder="Nazwa"
                                       data-testid="drugName" onChange={handleInputChange} required
                                />
                                <label htmlFor="name">Nazwa</label>
                            </div>
                            <div className="form-floating mt-3">
                                <input type="text" className="form-control" id="unit" name="unit"
                                       defaultValue={props.drug ? props.drug.unit : ""} placeholder="Jednostka"
                                       data-testid="unit" onChange={handleInputChange} required
                                />
                                <label htmlFor="unit">Jednostka (szt., ml. itp.)</label>
                            </div>
                            <div className="form-floating mt-3">
                                <input type="number" step="0.01" name="dosing" id="dosing" className="form-control"
                                       min="0.01"
                                       aria-valuemin="0.01"
                                       defaultValue={props.drug ? props.drug.dosing : ""}
                                       placeholder="Dawkowanie (ile na raz?)" data-testid="dosing"
                                       onChange={handleInputChange} required
                                />
                                <label htmlFor="dosing">Dawkowanie (ile na raz?)</label>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-floating mt-3">
                                <input type="number" step="1" className="form-control" id="quantity" name="quantity"
                                       defaultValue={props.drug ? props.drug.quantity : ""} placeholder="Bieżąca ilość"
                                       min="1" aria-valuemin="1" data-testid="quantity" onChange={handleInputChange} required
                                />
                                <label htmlFor="quantity">Bieżąca ilość</label>
                            </div>
                            <div className="form-floating mt-3">
                                <input type="number" step="1" className="form-control" id="quantityMax"
                                       defaultValue={props.drug ? props.drug.quantityMax : ""} name="quantityMax"
                                       placeholder="Ilość całkowita" min="1" aria-valuemin="1" data-testid="quantityMax"
                                       onChange={handleInputChange} required
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
                        <DosingMomentsInputs
                            dosingMoments={dosingMoments}
                            inputAmount={dosingMomentInputAmount}
                            handleTimeInputChange={handleTimeInputChange}
                        />
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