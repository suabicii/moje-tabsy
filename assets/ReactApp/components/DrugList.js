import React from "react";
import {mainRoute} from "../routers/AppRouter";
import {useNavigate} from "react-router-dom";

function DrugList(props) {
    const navigate = useNavigate();

    return (
        <div className="card text-center mt-3">
            <div className="card-header">
                Leki/suplementy <i className="fa-solid fa-pills"></i>
            </div>
            <div className="card-body">
                <h5 className="card-title">Lista leków i suplementów:</h5>
                <ul className="card-text list-group">
                    <li className="list-group-item"><span className="fw-bold">Xanax</span>: 60/120 szt. <button className="btn btn-danger rounded-circle">
                        <i className="fa-solid fa-trash-can"></i></button></li>
                    <li className="list-group-item"><span className="fw-bold">Witamina C</span>: 20/80 szt. <button className="btn btn-danger rounded-circle">
                        <i className="fa-solid fa-trash-can"></i></button></li>
                    <li className="list-group-item"><span className="fw-bold">Metanabol</span>: 4/10 amp. 10 ml <button className="btn btn-danger rounded-circle">
                        <i className="fa-solid fa-trash-can"></i></button></li>
                </ul>
                <div className="d-grid">
                    <button className="btn btn-primary mt-2" onClick={() => {
                        if (props.isEditMode) {
                            console.log('edit mode enabled');
                        } else {
                            navigate(`${mainRoute}/drug-list`);
                        }
                    }}>
                        {props.isEditMode ? 'Dodaj ' : 'Edytuj '}
                        {props.isEditMode ? <i className="fa-solid fa-plus"></i> : <i className="fa-solid fa-pencil"></i>}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DrugList;