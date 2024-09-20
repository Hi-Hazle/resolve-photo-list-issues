import React, {useEffect, useState} from 'react';
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
    QueryClientProvider,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {isNetworkOrServerError} from '@/pages/_app';
import {getMockedData} from '@/api';
import {getRandomInt} from '@/utils';
import {useRouter} from 'next/router';
import {Box, Link, Typography} from '@mui/material';

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
  const queryClient = useQueryClient();
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
        pathname: '/refactoring/react-query/solution-1-2',
      query: { id: id },
    });
  };

  useEffect(() => {
    const handleRemoveQuery = (url: string) => {
      const cachedQuery = queryClient.getQueryCache().find({ queryKey: [id] });

      if (!cachedQuery) return;

      cachedQuery.gcTime = 0;
    };

    router.events.on('routeChangeStart', handleRemoveQuery);

    return () => {
      router.events.off('routeChangeStart', handleRemoveQuery);
    };
  }, [router.events, queryClient, id]);

  return (
    <Box sx={{ p: 2, m: 2, border: '1px solid #333' }}>
      <Typography variant='h5'>
        <b>[TO-BE-2]</b>
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
            1. <b>gcTime:0</b> 추가로 리스트 페이지 => 리스트 페이지로 이동할때는 캐시를 삭제하도록 처리 (console.log & devtools
            확인)
            <br />
            2. 실제 <b>QplaecWeb</b>에서는 리스트 페이지 => 뒤로가기로 리스트 페이지에 돌아왔을때 이전 데이터가 보여져야하기 때문에
            <b>디테일 페이지로 넘어갈때는 캐시를 유지</b>하도록 처리
        </Typography>
        <Link href='/refactoring/react-query/problem-1?id=1'>
            <Typography variant='h6'>AS-IS 보기</Typography>
        </Link>
        <Link href='/refactoring/react-query/solution-1-1?id=1'>
            <Typography variant='h6'>TO-BE-1 보기</Typography>
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
