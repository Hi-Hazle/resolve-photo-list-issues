import { Inter } from 'next/font/google';
import { Link, Typography } from '@mui/material';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <Link href='/refactoring/zustand/rerender'>
        <Typography variant='h6'>1. Zustand - Rerender : Problem & Solutions</Typography>
      </Link>
      <Link href='/refactoring/react-query/problem-1?id=1'>
        <Typography variant='h6'>2. ReactQuery - Prefetch & useQuery : Problem</Typography>
      </Link>
      <Link href='/refactoring/react-query/solution-1-1?id=1'>
        <Typography variant='h6'>2. ReactQuery - Prefetch & useQuery : Solution1</Typography>
      </Link>
      <Link href='/refactoring/react-query/solution-1-2?id=1'>
        <Typography variant='h6'>2. ReactQuery - Prefetch & useQuery : Solution2</Typography>
      </Link>
    </>
  );
}
