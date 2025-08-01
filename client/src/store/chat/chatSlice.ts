import { ChatList, GroupList } from "@/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatState {
  data: null | ChatList;
  groupData: null | GroupList;
}

const initialState: ChatState = {
  data: null,
  groupData: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChat: (state, action: PayloadAction<ChatList | null>) => {
      state.data = action.payload;
    },
    setGroup: (state, action: PayloadAction<GroupList | null>) => {
      state.groupData = action.payload;
    },
    updateName: (state, action: PayloadAction<string>) => {
      if (state.groupData) {
        state.groupData = { ...state.groupData, name: action.payload };
      }
    },
    updatememebers: (
      state,
      action: PayloadAction<{
        _id: string;
        name: string;
        avatar?: {
          url: string;
          public_id: string;
        };
        gooleavatar?: string;
      }>
    ) => {
      if (state.groupData) {
        state.groupData = {
          ...state.groupData,
          members: [...state.groupData.members, action.payload],
        };
      }
    },

    removeMembers: (state, action: PayloadAction<string>) => {
      if (state.groupData) {
        state.groupData = {
          ...state.groupData,
          members: state.groupData.members.filter(
            (member) => member._id !== action.payload
          ),
        };
      }
    },
  },
});

export const { setChat, setGroup, updateName, updatememebers, removeMembers } =
  chatSlice.actions;
export default chatSlice.reducer;
