import {createSelector, createSlice} from "@reduxjs/toolkit";
import {fetchData} from "../../utils/fetchData";

const drugsSlice = createSlice({
    name: 'drugs',
    initialState: [],
    reducers: {
        addDrug: (state, action) => {
            const {id, name, quantity, quantityMax, unit, dosing, dosingMoments} = action.payload;
            state.push({id, name, quantity, quantityMax, unit, dosing, dosingMoments});
        },
        removeDrug: (state, action) => {
            const id = action.payload;
            return state.filter(drug => drug.id !== id);
        },
        editDrug: (state, action) => {
            const {id, ...updates} = action.payload;
            const drugIndex = state.findIndex(drug => drug.id === id);
            if (drugIndex !== -1) {
                state[drugIndex] = {...state[drugIndex], ...updates};
            }
        },
        setDrugs: (state, action) => action.payload
    },
    sort: true
});

const {reducer, actions} = drugsSlice;
export const {addDrug, removeDrug, editDrug, setDrugs} = actions;

const defaultDrugsSelector = state => state.drugs;

export const sortedDrugsSelector = createSelector(
    defaultDrugsSelector,
    drugs => [...drugs].sort((a, b) => a.name.localeCompare(b.name))
);

export const fetchDrugs = () => async dispatch => {
    await fetchData('/api/drug-list').then(data => {
        dispatch(setDrugs(data));
    }).catch(err => {
        console.log(err);
    });
};

export default reducer;