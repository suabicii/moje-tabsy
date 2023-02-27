import React from "react";
import {createRoot} from "react-dom/client";
import MainPage from "./components/MainPage";
import {Provider} from "react-redux";
import store from "./store";

const root = createRoot(document.getElementById('react'));

root.render(
    <Provider store={store}>
        <MainPage/>
    </Provider>
);
