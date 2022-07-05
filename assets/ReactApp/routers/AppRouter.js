import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Header from "../components/Header";
import Summary from "../components/Summary";
import DrugList from "../components/DrugList";
import Profile from "../components/Profile";
import Settings from "../components/Settings";
import NotFound from "../components/NotFound";

export const mainRoute = "/dashboard";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={mainRoute} element={<Summary />} />
                <Route path={`${mainRoute}/drug-list`} element={<DrugList/>} />
                <Route path={`${mainRoute}/profile`} element={<Profile/>} />
                <Route path={`${mainRoute}/settings`} element={<Settings/>} />
                <Route path={`${mainRoute}/*`} element={<NotFound/>} />
            </Routes>
            <Header/>
        </BrowserRouter>
    );
}

export default AppRouter;