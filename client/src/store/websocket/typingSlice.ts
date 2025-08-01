import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TypingState {
  typing: string[];
}

const initialState: TypingState = {
  typing: [],
};

export const typingSlice = createSlice({
  name: "typing",
  initialState,
  reducers: {
    setTyping: (state, action: PayloadAction<string[]>) => {
      state.typing = action.payload.filter(
        (user, index) => user.indexOf(user) === index
      );
    },
    removeTyping: (state, action: PayloadAction<string[]>) => {
      state.typing = state.typing.filter(
        (user) => !action.payload.includes(user)
      );
    },
    resetTyping: (state) => {
      state.typing = [];
    },
  },
});

export const { setTyping, removeTyping, resetTyping } = typingSlice.actions;
export default typingSlice.reducer;
