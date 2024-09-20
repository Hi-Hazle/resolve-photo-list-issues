import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getMockedData } from '@/api';

export const useMockedData = (id: string, option?: UseQueryOptions) => {
  return useQuery({
    queryKey: [id],
    queryFn: async () => {
      return getMockedData({ id: id });
    },
    ...option,
  });
};
