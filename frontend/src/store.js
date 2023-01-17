import { configureStore } from "@reduxjs/toolkit";

import { userReducer } from "./reducers/userReducer";
import { usersReducer } from "./reducers/usersReducer";
import { conversationReducer, conversationsReducer } from "./reducers/conversationReducer";

const store = configureStore({
    reducer: {
        user: userReducer,
        users: usersReducer,
        conversation: conversationReducer,
        conversations: conversationsReducer
    },
});

export default store;