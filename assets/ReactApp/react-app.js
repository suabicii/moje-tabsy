import React from "react";
import {createRoot} from "react-dom/client";
import MainPage from "./components/MainPage";
import {DrugListContainer} from "./container/DrugListContainer";
import {fetchData} from "./utils/fetchData";

const root = createRoot(document.getElementById('react'));

fetchData('/api/drug-list').then(data => {
    root.render(
        <DrugListContainer.Provider initialState={data}>
            <MainPage/>
        </DrugListContainer.Provider>
    );
}).catch(error => {
    console.log(error);
});
