import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

interface SocketState {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
}

const initialState: SocketState = {
  socket: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (
      state,
      action: PayloadAction<Socket<DefaultEventsMap, DefaultEventsMap>>
    ) => {
      state.socket = action.payload;
    },
    resetSocket: (state) => {
      state.socket = null;
    },
  },
});

export const { setSocket, resetSocket } = socketSlice.actions;
export default socketSlice.reducer;
