import {logout, setCredentials} from "../services/authSlice.js";
import {goMindApi} from "../services/goMind.js";

let isRefreshing = false;
let refreshAttempts = 0;

const authMiddleware = ({ dispatch }) => (next) => async (action) => {
    console.log(`action rejected ${action.type.endsWith('/rejected')}`)

    // Проверяем, является ли действие ошибкой API
    if (action.type && typeof action.type === 'string' && action.type.endsWith('/rejected')) {
        const errorStatus = action.error?.status || action.payload?.status;

        // Если ошибка 403 (Forbidden), пробуем обновить токен
        if (errorStatus === 403  && !isRefreshing && refreshAttempts < 3) {
            try {
                isRefreshing = true;
                refreshAttempts++;
                await dispatch(goMindApi.endpoints.refreshTokenCookie.initiate());
                dispatch(setCredentials({ isAuthorized: true }));

                // Повторяем исходный запрос
                const originalRequest = action.meta?.baseQueryMeta?.request;
                if (originalRequest) {
                    return dispatch(originalRequest);
                }
            } catch (error) {
                console.error('Ошибка при обновлении токена:', error);
                dispatch(logout()); // Выходим из системы, если обновление не удалось
                return;
            }
            finally {
                isRefreshing = false;
                refreshAttempts = 0;
            }
        }
        else if (refreshAttempts >= 3) {
            console.error("Превышено количество попыток обновления токена");
            dispatch(logout());
        }
    }

    return next(action);
};

export default authMiddleware;