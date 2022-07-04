import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Header from "../components/Header";
import Summary from "../components/Summary";
import DrugList from "../components/DrugList";

export const mainRoute = "/dashboard";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={mainRoute} element={<Summary />} exact={true} />
                <Route path={`${mainRoute}/drug-list`} element={<DrugList/>} />
            </Routes>
            <Header/>
        </BrowserRouter>
    );
}

export default AppRouter;