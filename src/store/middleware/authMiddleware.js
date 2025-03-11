import {logout, setCredentials} from "../services/authSlice.js";
import {goMindApi} from "../services/goMind.js";


const authMiddleware = ({ dispatch }) => (next) => async (action) => {
    console.log(`action rejected ${action.type.endsWith('/rejected')}`)

    // Проверяем, является ли действие ошибкой API
    if (action.type.endsWith('/rejected')) {
        const errorStatus = action.error?.status || action.payload?.status;

        // Если ошибка 403 (Forbidden), пробуем обновить токен
        if (errorStatus === 403) {
            try {
                await dispatch(goMindApi.endpoints.refreshTokenCookie.initiate());
                dispatch(setCredentials({ isAuthorized: true }));

                // Повторяем исходный запрос
                const originalRequest = action.meta.baseQueryMeta.request;
                return next(action); // Повторяем действие
            } catch (error) {
                console.error('Ошибка при обновлении токена:', error);
                dispatch(logout()); // Выходим из системы, если обновление не удалось
                return;
            }
        }
    }

    return next(action);
};

export default authMiddleware;