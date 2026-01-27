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
  }),
});

export const { useGetSettingQuery, useUpdateSettingMutation } = settingApi;
