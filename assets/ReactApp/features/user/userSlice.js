import {createSlice} from "@reduxjs/toolkit";
import {fetchData} from "../../utils/fetchData";

const userSlice = createSlice({
    name: 'user',
    initialState: {},
    reducers: {
        setUserData: (state, action) => action.payload
    }
});

const {reducer, actions} = userSlice;
export const {setUserData} = actions;

export const fetchUserData = () => async dispatch => {
    await fetchData('/api/user-data').then(data => {
        dispatch(setUserData(data))
    }).catch(err => {
        console.log(err);
    });
};

export default reducer;