import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MessageAlert {
  chatId: string;
  count: number;
}

interface MessageAlertState {
  messageAlert: MessageAlert[];
}

const initialState: MessageAlertState = {
  messageAlert: [] as MessageAlert[],
};

export const messageAlertSlice = createSlice({
  name: "messageAlert",
  initialState,
  reducers: {
    setMessageAlert: (state, action: PayloadAction<string>) => {
      const checkIdExist = state.messageAlert.some(
        (chat) => chat.chatId === action.payload
      );

      if (checkIdExist) {
        state.messageAlert = state.messageAlert.map((chat) =>
          chat.chatId === action.payload
            ? { ...chat, count: chat.count + 1 }
            : chat
        );
      } else {
        state.messageAlert.push({
          chatId: action.payload,
          count: 1,
        });
      }
    },
    resetMessageAleart: (state, action: PayloadAction<string>) => {
      state.messageAlert = state.messageAlert.filter(
        (chat) => chat.chatId !== action.payload
      );
    },
    resetAllMessageAlert: (state) => {
      state.messageAlert = [];
    },
  },
});

export const { setMessageAlert, resetMessageAleart, resetAllMessageAlert } =
  messageAlertSlice.actions;
export default messageAlertSlice.reducer;
