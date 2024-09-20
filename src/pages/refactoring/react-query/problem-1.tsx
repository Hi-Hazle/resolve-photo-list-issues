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
            gcTime: 1000 * 60 * 10,
            retry: (failureCount: number, error: unknown) => isNetworkOrServerError(error) && failureCount < 2,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <AsIs prefetchedData={prefetchedData} />
      </HydrationBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

const AsIs = ({ prefetchedData }) => {
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
      pathname: '/refactoring/react-query/problem-1',
      query: { id: id },
    });
  };

  return (
    <Box sx={{ p: 2, m: 2, border: '1px solid #333' }}>
      <Typography variant='h5'>
        <b>[AS-IS]</b>
      </Typography>
      <Typography variant='h6'>
        <b>Prefetched</b> {prefetchedData.id}
      </Typography>
      <Typography variant='h6'>
        <b>Current</b> {refetchedData.id}
      </Typography>
      <button onClick={() => onClick(1)}>RouterPush id : 1</button>
      <button onClick={() => onClick(2)}>RouterPush id : 2</button>
      <Typography variant='subtitle1' sx={{ mt: 1, mb: 1, background: '#ddd', p: 1 }}>
        1. <b>staleTime:0(default)</b>설정 때문에 prefetch된 데이터가 존재하더라도 <b>client-side</b>에서 한번 더
        즉각적인 <b>refetch</b>를 실행함
        <br />(<b>prefetch</b>된 데이터는 <b>random</b>한 숫자가 맞고 <b>client-side</b>에서 <b>refetch</b>된 데이터는
        현재 페이지 query id와 같은 숫자)
      </Typography>
      <Link href='/refactoring/react-query/solution-1-1?id=1'>
        <Typography variant='h6'>TO-BE-1 보기</Typography>
      </Link>
      <Link href='/refactoring/react-query/solution-1-2?id=1'>
        <Typography variant='h6'>TO-BE-2 보기</Typography>
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
