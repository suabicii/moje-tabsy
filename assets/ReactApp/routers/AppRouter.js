import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import MainPage from "../components/MainPage";

const mainRoute = "/dashboard";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={mainRoute} element={<MainPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;