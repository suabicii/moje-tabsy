import React from "react";
import DrugList from "./DrugList";
import {useLocation} from "react-router-dom";

function DrugListPage() {
    const {state} = useLocation();
    const isEmpty = state?.isEmpty || false;

    return (
        <>
            <h1 className="text-center mt-5 mt-md-0">Moje leki i suplementy</h1>
            <DrugList isEditMode={true} isEmpty={isEmpty}/>
        </>
    );
}

export default DrugListPage;