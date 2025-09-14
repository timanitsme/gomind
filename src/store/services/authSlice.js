import { createSlice } from '@reduxjs/toolkit';
import { goMindApi } from "./goMind.js";
import {jwtDecode} from "jwt-decode";
import getRefreshToken from "../utils/tokenUtils/getRefreshToken.js";
import getAccessToken from "../utils/tokenUtils/getAccessToken.js";
import { useLogoutMutation as logoutApi } from "./goMind.js"

const initialState = {
    isAuthorized: false,
    userProfile: null,
    isLoading: true,
    error: null,
    isInitialized: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            console.log("hey")
            const { access_token, refresh_token } = action.payload;
            state.isAuthorized = true;
            console.log("Setting tokens:", { access_token, refresh_token });
            document.cookie = `jwt-cookie=${access_token}; path=/; max-age=2592000; Secure; HttpOnly; SameSite=None`;
            document.cookie = `refresh-jwt-cookie=${refresh_token}; path=/; max-age=2592000; Secure; HttpOnly; SameSite=None`;
        },
        logout: (state) => {
            state.isAuthorized = false;
            state.userProfile = null;
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
        setIsInitialized: (state, action) => {
            state.isInitialized = action.payload;
        },
        setIsRefreshing: (state, action) => {
            state.isInitialized = action.payload;
        },
    },
});

export const { setCredentials, logout, setUserProfile, setIsLoading, setError, setIsInitialized, setIsRefreshing } = authSlice.actions;


export const logoutMiddleware =
    ({ dispatch }) =>
        (next) =>
            async (action) => {
                if (action.type === logout.type) {
                    try {
                        // Выполняем запрос на сервер для выхода из системы
                        await dispatch(goMindApi.endpoints.logout.initiate()).unwrap();

                        // Очищаем куки
                        document.cookie = `jwt-cookie=; path=/; max-age=0; Secure; HttpOnly; SameSite=None`;
                        document.cookie = `refresh-jwt-cookie=; path=/; max-age=0; Secure; HttpOnly; SameSite=None`;

                        // Обновляем состояние Redux
                        next(action);
                    } catch (error) {
                        console.error('Ошибка при выходе:', error);
                    }
                } else {
                    next(action);
                }
            };

export const initializeAuthState = (needToRefresh=false) => async (dispatch, getState) => {
    const { isInitialized } = getState().auth;
    if (!needToRefresh && isInitialized) return;
    dispatch(setIsLoading(true)); // Устанавливаем состояние загрузки
    dispatch(setIsInitialized(true));

    try {
        // Загружаем профиль пользователя через API
        const response = await dispatch(goMindApi.endpoints.getUserProfile.initiate({ _timestamp: Date.now() }, { forceRefetch: true }));
        if (response.data) {
            const { accessToken, refreshToken } = response.data;
            dispatch(setCredentials({ accessToken, refreshToken }));
            console.log("initializeAuthState: Пользователь авторизован");
            dispatch(setUserProfile(response.data)); // Устанавливаем данные профиля
            dispatch(setIsLoading(false))
        }
    } catch (error) {
        console.error('Ошибка при проверке сессии:', error);
        dispatch(logout()); // Выполняем выход в случае ошибки
        dispatch(setIsLoading(false))
    } finally {
        console.log("setting isLoading")
    }
};

export default authSlice.reducer;