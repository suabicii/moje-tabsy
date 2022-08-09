import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Header from "../components/Header";
import Summary from "../components/Summary";
import Profile from "../components/Profile";
import Settings from "../components/Settings";
import NotFoundPage from "../components/NotFoundPage";
import DrugListPage from "../components/DrugListPage";

export const mainRoute = "/dashboard";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={mainRoute} element={<Summary />} />
                <Route path={`${mainRoute}/drug-list`} element={<DrugListPage/>} />
                <Route path={`${mainRoute}/profile`} element={<Profile/>} />
                <Route path={`${mainRoute}/settings`} element={<Settings/>} />
                <Route path={`${mainRoute}/*`} element={<NotFoundPage/>} />
            </Routes>
            <Header/>
        </BrowserRouter>
    );
}

export default AppRouter;