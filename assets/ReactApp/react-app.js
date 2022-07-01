import React from "react";
import {createRoot} from "react-dom/client";
import AppRouter from "./routers/AppRouter";
import Header from "./components/Header";

const root = createRoot(document.getElementById('react'));
root.render(
    <div>
        <Header/>
        <AppRouter/>
    </div>
);