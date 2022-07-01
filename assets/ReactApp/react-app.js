import React from "react";
import {createRoot} from "react-dom/client";
import AppRouter from "./routers/AppRouter";

const root = createRoot(document.getElementById('react'));
root.render(<AppRouter/>);