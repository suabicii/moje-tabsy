import React from "react";
import {createRoot} from "react-dom/client";
import MainPage from "./components/MainPage";
import {DrugListContainer} from "./container/DrugListContainer";

const drugList = [
    {
        id: 1,
        name: 'Xanax',
        quantity: 60,
        quantityMax: 120,
        unit: 'szt.',
        dosing: 1,
        dosingMoments: {
            1: '07:00',
            2: '18:00'
        }
    },
    {
        id: 2,
        name: 'Witamina C',
        quantity: 20,
        quantityMax: 80,
        unit: 'szt.',
        dosing: 1,
        dosingMoments: {
            1: '12:00'
        }
    },
    {
        id: 3,
        name: 'Metanabol',
        quantity: 4,
        quantityMax: 10,
        unit: 'amp. 10 ml',
        dosing: 1,
        dosingMoments: {
            1: '17:00'
        }
    },
];

const root = createRoot(document.getElementById('react'));
root.render(
    <DrugListContainer.Provider initialState={drugList}>
        <MainPage/>
    </DrugListContainer.Provider>
);