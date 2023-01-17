import { createReducer } from "@reduxjs/toolkit";


const initialState = {
    loading: true,
    user: null,
    isAuthenticated: false,
    error: null,
}

export const userReducer = createReducer(initialState, {

    LOAD_USER_REQUEST: (state, action) => {
        state.loading = true;
    },
    LOAD_USER_SUCCESS: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
    },
    LOAD_USER_FAIL: (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
    },

    LOGIN_USER_REQUEST: (state) => {
        state.loading = true;
        state.isAuthenticated = false;
    },
    LOGIN_USER_SUCCESS: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
    },
    LOGIN_USER_FAIL: (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
    },

    SIGNUP_USER_REQUEST: (state) => {
        state.loading = true;
        state.isAuthenticated = false;
    },
    SIGNUP_USER_SUCCESS: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
    },
    SIGNUP_USER_FAIL: (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
    },

    LOGOUT_USER_REQUEST: (state, action) => {
        state.loading = true;
    },
    LOGOUT_USER_SUCCESS: (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
    },
    LOGOUT_USER_FAIL: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
});