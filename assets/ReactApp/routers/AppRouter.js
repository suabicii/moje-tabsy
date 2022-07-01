import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import MainPage from "../components/MainPage";
import Header from "../components/Header";

export const mainRoute = "/dashboard";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={mainRoute} element={<MainPage />} />
            </Routes>
            <Header/>
        </BrowserRouter>
    );
}

export default AppRouter;