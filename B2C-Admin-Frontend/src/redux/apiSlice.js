import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Create the API slice using RTK Query
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://b2c-backend-eik4.onrender.com/api/v1/' 
  }),
  tagTypes: ['Outlet', 'OutletPartner', 'DeliveryPartner'],
  endpoints: (builder) => ({
    // Outlet endpoints
    getOutlets: builder.query({
      query: () => 'admin/getOutlets',
      providesTags: ['Outlet']
    }),
    
    addOutlet: builder.mutation({
      query: (formData) => ({
        url: 'admin/addOutlet',
        method: 'POST',
        body: formData,
        // Don't set content type - FormData sets its own with boundary
      }),
      invalidatesTags: ['Outlet']
    }),
    
    updateOutletDeliveryPartners: builder.mutation({
      query: ({ outletId, delPartners, remPartners }) => ({
        url: `admin/outlets/${outletId}/deliveryPartners`,
        method: 'PUT',
        body: { delPartners, remPartners }
      }),
      invalidatesTags: ['Outlet']
    }),
    
    // Outlet Partner endpoints
    getOutletPartners: builder.query({
      query: () => 'admin/getoutletpartners',
      providesTags: ['OutletPartner']
    }),
    
    // Delivery Partner endpoints
    getDeliveryInsights: builder.query({
      query: () => 'admin/deliveryInsights',
      providesTags: ['DeliveryPartner']
    })
  })
});

// Export hooks for using the API endpoints
export const {
  useGetOutletsQuery,
  useAddOutletMutation,
  useUpdateOutletDeliveryPartnersMutation,
  useGetOutletPartnersQuery,
  useGetDeliveryInsightsQuery
} = apiSlice;