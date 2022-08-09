import React from "react";
import DrugList from "./DrugList";

function DrugListPage() {
    return (
        <>
            <h1 className="text-center mt-5 mt-md-0">Moje leki i suplementy</h1>
            <DrugList isEditMode={true}/>
        </>
    );
}

export default DrugListPage;