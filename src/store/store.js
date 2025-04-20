import {configureStore} from "@reduxjs/toolkit";
import {setupListeners} from "@reduxjs/toolkit/query/react";
import {goMindApi} from "./services/goMind.js";
import authReducer, {logoutMiddleware} from "./services/authSlice.js"
import authMiddleware from "./middleware/authMiddleware.js";

export const store = configureStore({
    reducer: {
        [goMindApi.reducerPath]: goMindApi.reducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(goMindApi.middleware).concat(authMiddleware).concat(logoutMiddleware),
})

setupListeners(store.dispatch)