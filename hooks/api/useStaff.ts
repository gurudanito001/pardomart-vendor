import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner-native';
import { StaffApi, type User } from '@/api';
import { apiConfig } from '@/api/config';

export type StaffMember = User & {
  image?: string | null;
  isAvailable?: boolean;
  storeAddress?: string | null;
};

export const useStaffMember = (staffId?: string) => {
  const staffApi = useMemo(() => new StaffApi(apiConfig), []);

  return useQuery<StaffMember, Error>({
    queryKey: ['staff', 'detail', staffId ?? 'unknown'],
    enabled: !!staffId,
    queryFn: async () => {
      if (!staffId) throw new Error('Missing staffId');
      try {
        const response = await staffApi.staffStaffIdGet(staffId);
        const u: any = response?.data ?? response;
        const image = u?.image ?? u?.dynamicMediaUrls?.avatar?.small ?? null;
        const isAvailable = (u?.isAvailable ?? u?.active) ?? false;
        const storeAddress = u?.storeAddress ?? u?.vendor?.address ?? null;
        return {
          ...u,
          image,
          isAvailable,
          storeAddress,
        } as StaffMember;
      } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || 'Failed to load shopper';
        toast.error(message);
        throw err;
      }
    },
    staleTime: 60 * 1000,
    retry: 1,
  });
};
