import {logout, setCredentials} from "../services/authSlice.js";
import {goMindApi} from "../services/goMind.js";
import {isRejectedWithValue} from "@reduxjs/toolkit/react";
import getRefreshToken from "../utils/tokenUtils/getRefreshToken.js";

let isRefreshing = false;
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 3;

export const authMiddleware =
    ({ dispatch }) =>
        (next) =>
            async (action) => {
                if (isRejectedWithValue(action) && action.payload?.status === 403) {
                    if (action.meta?.arg?.endpointName === 'refreshTokenCookie') {
                        return next(action);
                    }

                    if (!isRefreshing && refreshAttempts < MAX_REFRESH_ATTEMPTS) {
                        isRefreshing = true;
                        console.log("Trying to refresh")
                        try {
                            // Попытка обновить токен
                            const refreshResult = await dispatch(goMindApi.endpoints.refreshTokenCookie.initiate());
                            if (refreshResult.data) {
                                console.log('Refresh successful:', refreshResult.data);
                                await dispatch(setCredentials(refreshResult.data));
                                console.log('Action:', JSON.stringify(action));
                                if (action.meta?.arg) {
                                    console.log('Action meta arg:', JSON.stringify(action.meta.arg));
                                    const { endpointName, originalArgs } = action.meta.arg;
                                    return dispatch(goMindApi.endpoints[endpointName].initiate(originalArgs || {}, { forceRefetch: true }));
                                } else {
                                    console.warn('Original arguments are not available');
                                    return next(action);
                                }
                            }
                        } catch (error) {
                            console.error(`refresh error: ${error}`)
                            await dispatch(logout())

                        } finally {
                            isRefreshing = false;
                        }
                    } else {
                        // Ждём завершения обновления токена
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                        if (action.meta?.arg) {
                            console.log('Action meta arg:', JSON.stringify(action.meta.arg));
                            const { endpointName, originalArgs } = action.meta.arg;
                            return dispatch(goMindApi.endpoints[endpointName].initiate(originalArgs || {}, { forceRefetch: true }));
                        } else {
                            console.warn('Original arguments are not available');
                            return next(action);
                        }
                    }
                }

                return next(action);
            };

export default authMiddleware;