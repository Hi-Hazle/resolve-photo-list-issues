import React, { useEffect, useState } from 'react';
import { dehydrate, HydrationBoundary, QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { isNetworkOrServerError } from '@/pages/_app';
import { getMockedData } from '@/api';
import { getRandomInt } from '@/utils';
import { useRouter } from 'next/router';
import { Box, Link, Typography } from '@mui/material';

export default function Problem1({ dehydratedState, prefetchedData }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            staleTime: 1000 * 60,
            gcTime: 1000 * 60 * 10,
            retry: (failureCount: number, error: unknown) => isNetworkOrServerError(error) && failureCount < 2,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <ToBe prefetchedData={prefetchedData} />
      </HydrationBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

const ToBe = ({ prefetchedData }) => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, isFetching } = useQuery({
    queryKey: [id],
    queryFn: async () => {
      return getMockedData({ id: id });
    },
  });

  const [refetchedData, setRefetchedData] = useState(prefetchedData);

  useEffect(() => {
    setRefetchedData(data);
    console.log(data);
  }, [data]);

  const onClick = async (id) => {
    await router.push({
      pathname: '/refactoring/react-query/solution-1-1',
      query: { id: id },
    });
  };

  return (
    <Box sx={{ p: 2, m: 2, border: '1px solid #333' }}>
      <Typography variant='h5'>
        <b>[TO-BE-1]</b>
      </Typography>
      <Typography variant='h6'>
        <b>Prefetched</b> {prefetchedData.id}
      </Typography>
      <Typography variant='h6'>
        <b>Current</b> {refetchedData.id}
      </Typography>
      <button onClick={() => onClick(1)}>RouterPush id : 1</button>
      <button onClick={() => onClick(2)}>RouterPush id : 2</button>
      <Typography variant='subtitle1' sx={{ mt: 2 }}>
        1. <b>staleTime</b> 추가로 <b>prefetch</b> 된 데이터를 올바르게 사용
        <br />
        2. 하지만 해당 쿼리키에 캐시가 존재할 경우 찰나의 순간에 이전 데이터가 보이면서 의도하지 동작 발생 (console.log
        확인)
      </Typography>
      <Link href='/refactoring/react-query/problem-1?id=1'>
        <Typography variant='h6'>AS-IS 보기</Typography>
      </Link>
      <Link href='/refactoring/react-query/solution-1-2?id=1'>
        <Typography variant='h6'>TO-BE-2 보기(위의 문제 해결)</Typography>
      </Link>
    </Box>
  );
};

export async function getServerSideProps(ctx) {
  const queryClient = new QueryClient();
  const { query } = ctx;
  const id = query.id as string;

  await queryClient.prefetchQuery({
    queryKey: [id],
    queryFn: async () => getMockedData({ id: getRandomInt(4, 100) }),
  });

  const prefetchedData = queryClient.getQueryData([id]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      prefetchedData: prefetchedData,
    },
  };
}
