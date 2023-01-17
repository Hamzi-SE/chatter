import { createReducer } from "@reduxjs/toolkit";


const initialState = {
    loading: true,
    users: null,
    usersCount: 0,
    error: null,
}

export const usersReducer = createReducer(initialState, {

    LOAD_USERS_REQUEST: (state, action) => {
        state.loading = true;
    },
    LOAD_USERS_SUCCESS: (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.usersCount = action.payload.usersCount;
    },
    LOAD_USERS_FAIL: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

});

