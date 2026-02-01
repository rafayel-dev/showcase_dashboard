import { api } from "../api";

export interface IMessage {
  sender: "user" | "admin";
  text: string;
  createdAt: string;
  isRead: boolean;
}

export interface IChat {
  _id: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  guestId?: string;
  messages: IMessage[];
  lastMessage?: string;
  isClosed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllChats: builder.query<IChat[], void>({
      query: () => "/api/chat/admin/all",
      providesTags: ["Chat"],
    }),
    getChatById: builder.query<IChat, string>({
      query: (id) => `/api/chat/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Chat", id }],
    }),
    sendReply: builder.mutation<IChat, { id: string; text: string }>({
      query: ({ id, text }) => ({
        url: `/api/chat/admin/reply/${id}`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: ["Chat"],
    }),
    markChatAsRead: builder.mutation<IChat, string>({
      query: (id) => ({
        url: `/api/chat/admin/read/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const {
  useGetAllChatsQuery,
  useGetChatByIdQuery,
  useSendReplyMutation,
  useMarkChatAsReadMutation,
} = chatApi;
