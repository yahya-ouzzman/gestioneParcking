import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    clients: [],
    cars:[]
};

const clientsSlice = createSlice({
    name : "Programe",
    initialState,
    reducers : {
        fetchClient : (state, action) => {
            state.clients = action.payload
        },
        addClient : (state, action) => {state.clients.push(action.payload)},
        editeClient : (state, action) => {
            const index = state.clients.findIndex(c => c.id === action.payload.id.toString());
            if (index !== -1){
                state.clients[index] = action.payload;
            }
        },
        deletClient : (state, action) => {
            state.clients = state.clients.filter(c => c.id !== action.payload.toString())
        },
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
export const {fetchClient , addClient, editeClient, deletClient, fetchCars, addCars, editeCars, deletCars} = clientsSlice.actions;
export default clientsSlice.reducer;