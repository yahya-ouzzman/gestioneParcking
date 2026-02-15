import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cars: []
};

const carsSlice = createSlice({
    name : "cars",
    initialState,
    reducers : {
        fetchCars : (state, action) => {
            state.cars = action.payload
        },
        addCars : (state, action) => {state.cars.push(action.payload)},
        editeCars : (state, action) => {
            const index = state.cars.findIndex(c => c.id === action.payload.id.toString());
            if (index !== -1){
                state.cars[index] = action.payload;
            }
        },
        deletCars : (state, action) => {state.cars = state.cars.filter(c => c.id !== action.payload.toString())}
    }
})
export const {fetchCars , addCars, editeCars, deletCars} = carsSlice.actions;
export default carsSlice.reducer;