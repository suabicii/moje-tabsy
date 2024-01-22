import {createSlice} from "@reduxjs/toolkit";

const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState: false,
    reducers: {
        setDarkMode: (state, action) => action.payload
    }
});

const {reducer, actions} = darkModeSlice;

export const {setDarkMode} = actions;

export default reducer;