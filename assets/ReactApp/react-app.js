import React from "react";
import {createRoot} from "react-dom/client";
import MainPage from "./components/MainPage";
import {Provider} from "react-redux";
import store from "./store";
import {setDarkMode} from "./features/darkMode/darkModeSlice";

const root = createRoot(document.getElementById('react'));

const darkModeFromLocalStorage = !!JSON.parse(localStorage.getItem('darkMode'));
store.dispatch(setDarkMode(darkModeFromLocalStorage));

root.render(
    <Provider store={store}>
        <MainPage/>
    </Provider>
);
