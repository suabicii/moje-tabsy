import {configureStore} from "@reduxjs/toolkit";
import drugsSlice from "./features/drugs/drugsSlice"
import userSlice from "./features/user/userSlice";
import darkModeSlice from "./features/darkMode/darkModeSlice";

export default configureStore({
    reducer: {
        drugs: drugsSlice,
        user: userSlice,
        darkMode: darkModeSlice
    }
});