import React, {useState} from "react";
import {createContainer} from "unstated-next";

const useDrugListing = (initialState = []) => {
    const [drugList, setDrugList] = useState(initialState.sort((a, b) => {
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
        } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
        } else {
            return 0;
        }
    }));
    const addDrug = ({id, name, quantity, quantityMax, unit, dosing, dosingMoments}) => setDrugList([
        ...drugList,
        {
            id,
            name,
            quantity,
            quantityMax,
            unit,
            dosing,
            dosingMoments
        }
    ]);
    const removeDrug = id => setDrugList(drugList.filter(drug => drug.id !== id));
    const editDrug = (id, updates = {}) => setDrugList(drugList.map(drug => drug.id === id ? {...drug, ...updates} : drug));
    return {drugList, addDrug, removeDrug, editDrug};
};

export const DrugListContainer = createContainer(useDrugListing);