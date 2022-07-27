import React, {useState} from "react";
import DosingMomentsInputs from "./DosingMomentsInputs";

function DrugModalContent(props) {
    const dosingMomentsDefaultValue = props.drug ? Object.entries(props.drug.dosingMoments) : [["1", null]];
    const [dosingMoments, setDosingMoments] = useState(dosingMomentsDefaultValue);
    const handleChangeDosingInput = value => {
        const dosingMomentInputs = [...document.querySelectorAll('.dosing-moment-input')];
        if (value > dosingMomentInputs.length) {
            setDosingMoments([
                ...dosingMoments,
                [value.toString(), null]
            ]);
        } else {
            setDosingMoments(dosingMoments.filter(dosingMoment => dosingMoment[0] !== value));
            console.log(dosingMoments.filter(dosingMoment => dosingMoment[0] !== value));
        }
    };

    return (
        <>
            <button className="btn btn-close" onClick={() => {
                props.setIsModalOpen(false);
            }}>
            </button>
            <h3 className="mt-2 text-center">{props.drug ? 'Edytuj' : 'Dodaj'} lek/suplement</h3>
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
                                   required
                            />
                            <label htmlFor="quantity">Bieżąca ilość</label>
                        </div>
                        <div className="form-floating mt-3">
                            <input type="number" step="1" className="form-control" id="quantityMax"
                                   defaultValue={props.drug ? props.drug.quantityMax : ""} name="quantityMax"
                                   placeholder="Ilość całkowita" required
                            />
                            <label htmlFor="quantityMax">Ilość całkowita</label>
                        </div>
                        <div className="form-floating mt-3">
                            <input type="number" step="1" className="form-control" id="dailyDosing" name="daily_dosing"
                                   placeholder="Ile razy dziennie?"
                                   defaultValue={props.drug ? Object.keys(props.drug.dosingMoments).length : "1"}
                                   aria-valuemin="1"
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
                    <DosingMomentsInputs dosingMoments={dosingMoments}/>
                </div>
                <div className="d-flex justify-content-between mt-3">
                    <button type="submit" className="btn btn-info px-5">Zapisz</button>
                    <button type="button" className="btn btn-outline-dark px-5" onClick={() => {
                        props.setIsModalOpen(false);
                    }}>
                        Anuluj
                    </button>
                </div>
            </form>
        </>
    );
}

export default DrugModalContent;