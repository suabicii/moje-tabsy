import React, {useState} from "react";
import DosingMomentsInputs from "./DosingMomentsInputs";

function DrugModalContent(props) {
    const dosingMomentsDefaultValue = props.drug ? Object.entries(props.drug.dosingMoments) : [["1", null]];
    const [dosingMoments, setDosingMoments] = useState(dosingMomentsDefaultValue);

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
                                   defaultValue={props.drug ? props.drug.name : ""} placeholder="Nazwa" required/>
                            <label htmlFor="name">Nazwa</label>
                        </div>
                        <div className="form-floating mt-3">
                            <input type="text" className="form-control" id="unit" name="unit"
                                   defaultValue={props.drug ? props.drug.unit : ""} placeholder="Jednostka" required/>
                            <label htmlFor="unit">Jednostka (szt., ml. itp.)</label>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-floating mt-3">
                            <input type="number" step="1" className="form-control" id="quantity" name="quantity"
                                   defaultValue={props.drug ? props.drug.quantity : ""} placeholder="Bieżąca ilość"
                                   required/>
                            <label htmlFor="quantity">Bieżąca ilość</label>
                        </div>
                        <div className="form-floating mt-3">
                            <input type="number" step="1" className="form-control" id="quantityMax"
                                   defaultValue={props.drug ? props.drug.quantityMax : ""} name="quantityMax"
                                   placeholder="Ilość całkowita" required/>
                            <label htmlFor="quantityMax">Ilość całkowita</label>
                        </div>
                    </div>
                </div>
                <div className="form-floating mt-3">
                    <input type="number" step="1" className="form-control" id="dosing" name="dosing"
                           placeholder="Dawkowanie (ile razy dziennie)"
                           defaultValue={props.drug ? props.drug.dosing : "1"} aria-valuemin="1" required
                    />
                    <label htmlFor="dosing">Dawkowanie (ile razy dziennie)</label>
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