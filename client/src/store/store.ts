import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./auth/authSlice";
import chatReducer from "./chat/chatSlice";
import onlineofflineRedicer from "./websocket/onlineofflineUserSlice";
import messageAlertReducer from "./websocket/messageAlertSlice";
import typingReducer from "./websocket/typingSlice";
import socketReducer from "./websocket/storeSocketDetailes";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    auth: authReducer,
    chat: chatReducer,
    onlineofflineUser: onlineofflineRedicer,
    messageAlert: messageAlertReducer,
    typing: typingReducer,
    socket: socketReducer,
  })
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
