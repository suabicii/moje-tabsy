import React from "react";
import {createRoot} from "react-dom/client";
import MainPage from "./components/MainPage";
import {DrugListContainer} from "./container/DrugListContainer";

const drugList = JSON.parse(localStorage.getItem('drugs')) || [];

const root = createRoot(document.getElementById('react'));
root.render(
    <DrugListContainer.Provider initialState={drugList}>
        <MainPage/>
    </DrugListContainer.Provider>
);