import React, {useState} from "react";
import {mainRoute} from "../routers/AppRouter";
import {useNavigate} from "react-router-dom";
import {DrugListContainer} from "../container/DrugListContainer";
import Modal from "./modal/Modal";
import DrugModalContent from "./modal/DrugModalContent";

function DrugList(props) {
    const navigate = useNavigate();
    const drugListContainer = DrugListContainer.useContainer();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [drugDataForEdit, setDrugDataForEdit] = useState(undefined);
    const editModalContent = <DrugModalContent setIsModalOpen={setIsEditModalOpen} drug={drugDataForEdit}/>;
    const addModalContent = <DrugModalContent setIsModalOpen={setIsAddModalOpen}/>;
    const customRoot = props.customRoot || null;

    return (
        <div className="card text-center mt-3">
            <div className="card-header">
                Leki/suplementy <i className="fa-solid fa-pills"></i>
            </div>
            <div className="card-body">
                <h5 className="card-title">Lista leków i suplementów:</h5>
                <ul className="card-text list-group">
                    {drugListContainer.drugList.map(drug => <li key={drug.id} className="list-group-item">
                            <strong>{drug.name}</strong>: {drug.quantity}/{drug.quantityMax} {`${drug.unit}, `}
                            <strong>Dzienna
                                dawka: </strong> {drug.dosing} {drug.unit} {`${Object.keys(drug.dosingMoments).length} raz(-y) dziennie `}
                            {
                                // Delete button
                                props.isEditMode &&
                                <button className="btn btn-danger rounded-circle float-md-end" onClick={() => {
                                    drugListContainer.removeDrug(drug.id);
                                }}>
                                    <i className="fa-solid fa-trash-can"></i>
                                </button>
                            }
                            {
                                // Edit button
                                props.isEditMode &&
                                <button className="btn btn-info rounded-circle float-md-end"
                                        data-testid={`edit-drug-${drug.id}`} onClick={() => {
                                    setIsEditModalOpen(true);
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
                            setIsAddModalOpen(true);
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
            {props.isEditMode &&
                <>
                    <Modal modalIsOpen={isEditModalOpen} content={editModalContent} customRoot={customRoot}/>
                    <Modal modalIsOpen={isAddModalOpen} content={addModalContent} customRoot={customRoot}/>
                </>
            }
        </div>
    );
}

export default DrugList;