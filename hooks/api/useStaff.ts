import { StaffApi } from '@/api';
import { apiConfig } from '@/api/config';
import type { User } from '@/api/models';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner-native';

/**
 * The `ShopperItem` interface is a subset of the `Staff` model,
 * tailored for display purposes in the UI.
 */

const staffKeys = {
  all: ['staff'] as const,
  list: (vendorId?: string) => [...staffKeys.all, 'list', { vendorId }] as const,
  detail: (id: string) => [...staffKeys.all, 'detail', id] as const,
};

/**
 * Fetches a list of staff members (staff), optionally filtered by vendorId.
 * @param vendorId - The ID of the vendor/store to filter by.
 */
export const useStaff = (vendorId?: string) => {
  const staffApi = useMemo(() => new StaffApi(apiConfig), []);

  return useQuery<User[], Error>({
    queryKey: staffKeys.list(vendorId),
    queryFn: async (): Promise<User[]> => {
      try {
        // The API call to fetch staff, passing the optional vendorId for filtering.
        const response = await staffApi.staffGet(vendorId);
        return response.data ?? [];
      } catch (err: any) {
        const message =
          err?.response?.data?.message || err?.message || 'Failed to load staff';
        toast.error(message);
        throw new Error(message);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Fetches details for a single staff member.
 * @param staffId - The ID of the staff member to fetch.
 */
export const useStaffMember = (staffId?: string) => {
  const staffApi = useMemo(() => new StaffApi(apiConfig), []);

  return useQuery<User, Error>({
    queryKey: staffKeys.detail(staffId!),
    queryFn: async (): Promise<User> => {
      if (!staffId) {
        throw new Error('Staff ID is required');
      }
      try {
        const response = await staffApi.staffStaffIdGet(staffId);
        return response.data ?? {};
      } catch (err: any) {
        const message =
          err?.response?.data?.message || err?.message || 'Failed to load staff member';
        toast.error(message);
        throw new Error(message);
      }
    },
    enabled: !!staffId,
  });
};