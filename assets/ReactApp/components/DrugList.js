import React, {useEffect, useState} from "react";
import {mainRoute} from "../routers/AppRouter";
import {useNavigate} from "react-router-dom";
import DrugForm from "./forms/DrugForm";
import {sendOrDeleteData} from "../utils/sendOrDeleteData";
import {useDispatch, useSelector} from "react-redux";
import {removeDrug, sortedDrugsSelector} from "../features/drugs/drugsSlice";
import DosingMoments from "./DosingMoments";

function DrugList({isEditMode, isEmpty}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const drugs = useSelector(sortedDrugsSelector);
    const [isEditFormVisible, setIsEditFormVisible] = useState(false);
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);
    const [drugDataForEdit, setDrugDataForEdit] = useState(undefined);

    useEffect(() => {
        if (isEmpty) {
            setIsAddFormVisible(true);
        }
    }, []);

    return (
        <>
            <div className="card text-center mt-3">
                <div className="card-header">
                    Leki/suplementy <i className="fa-solid fa-pills"></i>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Lista leków i suplementów:</h5>
                    <ul className="card-text list-group">
                        {drugs.map(drug => <li key={drug.id} className="list-group-item" data-testid="drug">
                                <strong>{drug.name}</strong>: {drug.quantity}/{drug.quantityMax} {`${drug.unit}, `}
                                <strong>Dzienna
                                    dawka: </strong> {drug.dosing} {drug.unit} {`${Object.keys(drug.dosingMoments).length} raz(-y) dziennie `}
                                {
                                    // Delete button
                                    isEditMode &&
                                    <button className="btn btn-danger rounded-circle float-md-end"
                                            data-testid={`remove-drug-${drug.id}`} onClick={async () => {
                                        dispatch(removeDrug(drug.id));
                                        await sendOrDeleteData(drug.id, null, 'DELETE', 'delete-drug');
                                    }}>
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                }
                                {
                                    // Edit button
                                    isEditMode &&
                                    <button className="btn btn-info rounded-circle float-md-end"
                                            data-testid={`edit-drug-${drug.id}`} onClick={() => {
                                        setIsEditFormVisible(true);
                                        setDrugDataForEdit(drug);
                                    }}>
                                        <i className="fa-solid fa-pencil"></i>
                                    </button>
                                }
                                <span className="border-start border-dark ml-3 pr-3"
                                      style={{marginLeft: '0.25rem', paddingRight: '0.25rem'}}
                                >
                                </span>
                                <button
                                    type="button"
                                    className="btn dropdown-toggle border-0 pt-0 pb-1 px-1 ml-2"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapseHours${drug.id}`}
                                    aria-expanded="false"
                                    aria-controls={`#collapseHours${drug.id}`}
                                >
                                    Szczegóły
                                </button>
                                <div className="list-group collapse mt-2" id={`collapseHours${drug.id}`}>
                                    <h6>Godziny przyjmowania dawek:</h6>
                                    <ul className="list-group">
                                        <DosingMoments drugId={drug.id} content={drug.dosingMoments}
                                                       className="list-group-item"/>
                                    </ul>
                                </div>
                            </li>
                        )}
                    </ul>
                    <div className="d-grid">
                        <button className="btn btn-primary mt-2" data-testid="add-drug" onClick={() => {
                            if (isEditMode) {
                                setIsAddFormVisible(true);
                            } else if (isEmpty) {
                                navigate(`${mainRoute}/drug-list`, {state: {isEmpty: true}});
                            } else {
                                navigate(`${mainRoute}/drug-list`);
                            }
                        }}>
                            {isEditMode || isEmpty ? 'Dodaj ' : 'Edytuj '}
                            {isEditMode || isEmpty ? <i className="fa-solid fa-plus"></i> :
                                <i className="fa-solid fa-pencil"></i>}
                        </button>
                    </div>
                </div>
            </div>
            {
                isEditMode &&
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