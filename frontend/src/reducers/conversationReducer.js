import { createReducer } from "@reduxjs/toolkit";


const initialState = {
    loading: true,
    conversation: null,
    error: null,
}

export const conversationReducer = createReducer(initialState, {

    CREATE_CONVERSATION_REQUEST: (state) => {
        state.loading = true;
        state.conversation = null;
        state.error = null;
    },
    CREATE_CONVERSATION_SUCCESS: (state, action) => {
        state.conversation = action.payload;
        state.loading = false;
        state.error = null;
    },
    CREATE_CONVERSATION_FAIL: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

})


const conversationsInitialState = {
    loading: false,
    conversations: null,
    error: null,
}

export const conversationsReducer = createReducer(conversationsInitialState, {
    GET_ALL_CONVERSATIONS_REQUEST: (state) => {
        state.loading = true;
        state.conversations = null;
        state.error = null;
    },
    GET_ALL_CONVERSATIONS_SUCCESS: (state, action) => {
        state.conversations = action.payload;
        state.loading = false;
    },
    GET_ALL_CONVERSATIONS_FAIL: (state, action) => {
        state.conversations = false;
        state.error = action.payload;
    },
})