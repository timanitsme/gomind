import { createSlice } from '@reduxjs/toolkit';
import { goMindApi } from "./goMind.js";

const initialState = {
    isAuthorized: false,
    userProfile: null,
    isLoading: true,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.isAuthorized = true;
            const {accessToken, refreshToken} = action.payload;
            // Сохранение токенов в куки
            document.cookie = `jwt-cookie=${accessToken}; path=/; max-age=2592000; Secure; HttpOnly; SameSite=None`;
            document.cookie = `refresh-jwt-cookie=${refreshToken}; path=/; max-age=2592000; Secure; HttpOnly; SameSite=None`;
        },
        logout: (state) => {
            state.isAuthorized = false;
            state.userProfile = null;
            // Удаление токенов из куки
            document.cookie = `jwt-cookie=; path=/; max-age=0; Secure; HttpOnly; SameSite=None`;
            document.cookie = `refresh-jwt-cookie=; path=/; max-age=0; Secure; HttpOnly; SameSite=None`;
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setCredentials, logout, setUserProfile, setIsLoading, setError } = authSlice.actions;

export const initializeAuthState = () => async (dispatch) => {
    dispatch(setIsLoading(true))
    try {
        const response = await dispatch(goMindApi.endpoints.getUserProfile.initiate());
        if (response.data) {
            console.log("initializeAuthState: You are authorized!")
            const { accessToken, refreshToken } = response.data;
            dispatch(setCredentials({ accessToken, refreshToken }));
            dispatch(setUserProfile(response.data));
        } else {
            dispatch(logout());
        }
    } catch (error) {
        console.error('Ошибка при проверке сессии:', error);
        dispatch(logout());
    } finally {
        dispatch(setIsLoading(false))
    }
};

export default authSlice.reducer;