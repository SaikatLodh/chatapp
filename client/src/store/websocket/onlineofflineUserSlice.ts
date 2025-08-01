import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface onlineofflineUser {
  data: string[];
}

const initialState: onlineofflineUser = {
  data: [],
};

const onlineofflineUserSlice = createSlice({
  name: "onlineofflineUser",
  initialState,
  reducers: {
    setOnlineOfflineUser: (state, action: PayloadAction<string[]>) => {
      state.data = action.payload;
    },
    resetOnlineOfflineUser: (state) => {
      state.data = [];
    },
  },
});

export const { setOnlineOfflineUser, resetOnlineOfflineUser } =
  onlineofflineUserSlice.actions;

export default onlineofflineUserSlice.reducer;
