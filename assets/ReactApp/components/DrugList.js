import React, {useEffect, useState} from "react";
import {mainRoute} from "../routers/AppRouter";
import {useNavigate} from "react-router-dom";
import {DrugListContainer} from "../container/DrugListContainer";
import DrugForm from "./forms/DrugForm";

function DrugList(props) {
    const navigate = useNavigate();
    const {drugList, removeDrug} = DrugListContainer.useContainer();
    const [isEditFormVisible, setIsEditFormVisible] = useState(false);
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);
    const [drugDataForEdit, setDrugDataForEdit] = useState(undefined);

    useEffect(() => {
        localStorage.setItem('drugs', JSON.stringify(drugList));
    });

    return (
        <>
            <div className="card text-center mt-3">
                <div className="card-header">
                    Leki/suplementy <i className="fa-solid fa-pills"></i>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Lista leków i suplementów:</h5>
                    <ul className="card-text list-group">
                        {drugList.map(drug => <li key={drug.id} className="list-group-item" data-testid="drug">
                                <strong>{drug.name}</strong>: {drug.quantity}/{drug.quantityMax} {`${drug.unit}, `}
                                <strong>Dzienna
                                    dawka: </strong> {drug.dosing} {drug.unit} {`${Object.keys(drug.dosingMoments).length} raz(-y) dziennie `}
                                {
                                    // Delete button
                                    props.isEditMode &&
                                    <button className="btn btn-danger rounded-circle float-md-end"
                                            data-testid={`remove-drug-${drug.id}`} onClick={() => {
                                        removeDrug(drug.id);
                                    }}>
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                }
                                {
                                    // Edit button
                                    props.isEditMode &&
                                    <button className="btn btn-info rounded-circle float-md-end"
                                            data-testid={`edit-drug-${drug.id}`} onClick={() => {
                                        setIsEditFormVisible(true);
                                        setDrugDataForEdit(drug);
                                    }}>
                                        <i className="fa-solid fa-pencil"></i>
                                    </button>
                                }
                            </li>
                        )}
                    </ul>
                    <div className="d-grid">
                        <button className="btn btn-primary mt-2" data-testid="add-drug" onClick={() => {
                            if (props.isEditMode) {
                                setIsAddFormVisible(true);
                            } else {
                                navigate(`${mainRoute}/drug-list`);
                            }
                        }}>
                            {props.isEditMode ? 'Dodaj ' : 'Edytuj '}
                            {props.isEditMode ? <i className="fa-solid fa-plus"></i> :
                                <i className="fa-solid fa-pencil"></i>}
                        </button>
                    </div>
                </div>
            </div>
            {
                props.isEditMode &&
                <>
                    {
                        isAddFormVisible &&
                        <div className="card mt-3">
                            <DrugForm setIsFormVisible={setIsAddFormVisible}/>
                        </div>
                    }
                    {
                        isEditFormVisible &&
                        <div className="card mt-3">
                            <DrugForm drug={drugDataForEdit} setIsFormVisible={setIsEditFormVisible}/>
                        </div>
                    }
                </>
            }
        </>
    );
}

export default DrugList;