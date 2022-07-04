import React from "react";
import {createRoot} from "react-dom/client";
import MainPage from "./components/MainPage";

const root = createRoot(document.getElementById('react'));
root.render(<MainPage/>);