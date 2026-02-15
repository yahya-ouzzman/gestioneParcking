import clientReducer from './slices/clientSlice';

import { configureStore } from '@reduxjs/toolkit';

const Store = configureStore(
    {
        reducer : {
            Programe : clientReducer,
            
        }
    }
);
export default Store;