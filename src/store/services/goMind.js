import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";


export const goMindApi = createApi({
    reducerPath: "goMindApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api",
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers
        },
        responseHandler: async (response) => {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')){
                return response.json();
            }
            else{
                return response.text();
            }
        },
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => {
                return({
                    url: 'authentication/login',
                    method: 'POST',
                    body: credentials
                })}
        }),
        getUserProfile: (builder.query({
            query: () => `user/profile`
        })),
        refreshToken: builder.mutation({
            query: (refreshToken) => {
                return({
                  url: 'authentication/refresh-token',
                  method: "POST",
                  body: refreshToken
                })}
        }),
        refreshTokenCookie: builder.mutation({
            query: () => {
                return({
                    url: 'authentication/refresh-token-cookie',
                    method: "POST"
                })
            }
        }),
        getAllUsers: (builder.query({
            query:  ({page, size}) =>{
                const params = new URLSearchParams();
                params.append('page', page.toString());
                params.append('size', size.toString());
                return(`admin/all-users?${params.toString()}`)
            }
        })),
        rejectAdvertisement: builder.mutation({
            query: ({adId}) => {
                return({
                    url: `admin/reject-advertisement?adId=${adId}`,
                    method: 'POST'
                })
            }
        }),
        approveAdvertisement: builder.mutation({
            query: ({adId}) => {
                return({
                    url: `admin/approve-advertisement?adId=${adId}`,
                    method: 'POST'
                })
            }
        }),
        getAdvertisementsByCost: (builder.query({
            query: ({status}) => `advertisements/advertisements-by-moderation-status?status=${status}`
        })),
        getAdvertisementById: (builder.query({
            query: ({id}) => `advertisements/get-by-id/${id}`
        })),
        getSuspiciousWins: (builder.query({
            query: ({limit}) =>{
                return(`admin/suspicious-wins?limit=${limit.toString()}`)
            }
        })),
        getFileSystemImageById: (builder.query({
            query: ({fileDataId}) =>({
                url: `files/file-system-image-by-id/${Number(fileDataId)}`,
                responseHandler: (response) => response.blob()
            })
        })),
        catchPears: builder.mutation({
            query: ({userId, pearsCaught}) => {
                return({
                    url: `user/catch-pear?userId=${userId}&pearsCaught=${pearsCaught}`,
                    method: 'POST'
                })
            }
        }),
        getWithdrawals: (builder.query({
            query: ({status}) => `admin/withdrawals?status=${status}`
        })),
        approveWithdrawal: builder.mutation({
            query: ({requestId}) => {
                return({
                    url: `admin/withdrawals/approve?requestId=${requestId}`,
                    method: 'POST'
                })
            }
        }),
        rejectWithdrawal: builder.mutation({
            query: ({requestId, reason}) => {
                return({
                    url: `admin/withdrawals/reject?requestId=${requestId}&reason=${reason}`,
                    method: 'POST'
                })
            }
        }),
    })
})



export const {useLoginMutation, useGetUserProfileQuery, useRefreshTokenMutation, useRefreshTokenCookieMutation,
    useGetAllUsersQuery, useApproveAdvertisementMutation, useRejectAdvertisementMutation , useGetAdvertisementsByCostQuery,
    useGetSuspiciousWinsQuery, useGetFileSystemImageByIdQuery, useGetAdvertisementByIdQuery,
    useCatchPearsMutation, useGetWithdrawalsQuery, useApproveWithdrawalMutation, useRejectWithdrawalMutation} = goMindApi
