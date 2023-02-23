import {configureStore} from "@reduxjs/toolkit";
import drugsReducer from "./features/drugs/drugsSlice"
import userSlice from "./features/user/userSlice";

export default configureStore({
    reducer: {
        drugs: drugsReducer,
        user: userSlice
    }
});