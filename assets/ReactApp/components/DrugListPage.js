import React from "react";
import DrugList from "./DrugList";

function DrugListPage() {
    return (
        <>
            <h1 className="text-center">Moje leki i suplementy</h1>
            <DrugList isEditMode={true}/>
        </>
    );
}

export default DrugListPage;