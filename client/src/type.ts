export interface middlewareShape {
  _id: string;
  role: "user" | "admin";
  iat: number;
  exp: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  role: "user" | "admin";
  isverified: boolean;
  createdAt: string;
  updatedAt: string;
  bio: string;
  avatar?: {
    url: string;
    public_id: string;
  };
  gooleavatar?: string;
  friends: string[];
  groups: string[];
}

export interface SearchUser {
  _id: string;
  name: string;
  avatar?: {
    url: string;
    public_id: string;
  };
  gooleavatar?: string;
  friends: string[];
  request: [
    {
      _id: string;
      friend: boolean;
      receiver: string;
      sender: string;
      status: "pending" | "sent" | "accepted" | "rejected";
    }
  ];
}

export interface FriendRequestNotification {
  _id: string;
  status: "pending" | "sent" | "accepted" | "rejected";
  friend: boolean;
  sender: {
    _id: string;
    name: string;
    avatar?: {
      url: string;
      public_id: string;
    };
    gooleavatar?: string;
  };
  receiver: string;
}

export interface Friends {
  _id: string;
  friends: [
    {
      _id: string;
      name: string;
      avatar?: {
        url: string;
        public_id: string;
      };
      gooleavatar?: string;
    }
  ];
}

export interface ChatList {
  _id: string;
  name: string;
  groupChat: boolean;
  members: string[];
  avatar: [
    {
      _id: string;
      name: string;
      avatar?: {
        url: string;
        public_id: string;
      };
      gooleavatar?: string;
    }
  ];
  MembersDetails: [
    {
      _id: string;
      name: string;
      avatar?: {
        url: string;
        public_id: string;
      };
      gooleavatar?: string;
    }
  ];
}

export interface GroupList {
  _id: string;
  name: string;
  groupChat: boolean;
  members: [
    {
      _id: string;
      name: string;
      avatar?:
        | {
            url: string;
            public_id: string;
          }
        | undefined;
      gooleavatar?: string | undefined;
    }
  ];
  avatar: string[];
}

export interface Message {
  _id: string;
  content?: string;
  sender: {
    _id: string;
    name: string;
    avatar?: {
      url: string;
      public_id: string;
    };
    gooleavatar?: string;
  };
  chat: string;
  attachments?: [
    {
      public_id: string;
      url: string;
      _id: string;
    }
  ];
  createdAt: string;
  updatedAt: string;
}

export interface AdminChatMember {
  _id: string;
  name: string;
  avatar: string;
}

export interface AdminChatCreator {
  name: string;
  avatar: string;
}

export interface AdminChats {
  _id: string;
  groupChat: boolean;
  name: string;
  avatar: string[];
  members: AdminChatMember[];
  creator: AdminChatCreator;
  totalMembers: number;
  totalMessages: number;
}

export interface AdminChatAttachment {
  publicId: string;
  url: string;
  _id: string;
}

export interface AdminChatSender {
  _id: string;
  name: string;
  avatar: string;
}

export interface AdminChatMessage {
  _id: string;
  attachments: AdminChatAttachment[];
  createdAt: string;
  chat: string;
  groupChat: boolean;
  sender: AdminChatSender;
}

export interface AdminDashboardStatus {
  groupsCount: number;
  usersCount: number;
  messagesCount: number;
  totalChatsCount: number;
  messagesChart: number[];
}
