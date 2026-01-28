import { api } from "../api";

export const sliderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSliders: builder.query({
      query: () => "/api/sliders/admin",
      providesTags: ["Slider"],
    }),

    addSlider: builder.mutation({
      query: (newSlider) => ({
        url: "/api/sliders",
        method: "POST",
        body: newSlider,
      }),
      invalidatesTags: ["Slider"],
    }),

    updateSlider: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/sliders/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Slider"],
    }),

    deleteSlider: builder.mutation({
      query: (id) => ({
        url: `/api/sliders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Slider"],
    }),
  }),
});

export const {
  useGetSlidersQuery,
  useAddSliderMutation,
  useUpdateSliderMutation,
  useDeleteSliderMutation,
} = sliderApi;
