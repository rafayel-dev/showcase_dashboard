import { api } from "../api";

export interface Setting {
  key: string;
  value: any;
  type?: string;
}

export const settingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSetting: builder.query<Setting, string>({
      query: (key) => `/api/settings/${key}`,
      providesTags: (_, __, key) => [{ type: "Setting" as const, id: key }],
    }),
    updateSetting: builder.mutation<
      Setting,
      { key: string; value: any; type?: string }
    >({
      query: ({ key, value, type }) => ({
        url: `/api/settings/${key}`,
        method: "PUT",
        body: { value, type },
      }),
      invalidatesTags: (_, __, { key }) => [
        { type: "Setting" as const, id: key },
      ],
    }),
    getAbout: builder.query<any, void>({
      query: () => "/api/settings/about",
      providesTags: ["Setting"],
    }),
    updateAbout: builder.mutation<any, any>({
      query: (data) => ({
        url: "/api/settings/about",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Setting"],
    }),
  }),
});

export const {
  useGetSettingQuery,
  useUpdateSettingMutation,
  useGetAboutQuery,
  useUpdateAboutMutation,
} = settingApi;
