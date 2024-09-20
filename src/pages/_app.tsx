import { AppProps } from 'next/app';
import React from 'react';
import { isAxiosError } from 'axios';
import { ThemeRegistry } from '@/ThemeRegistry';

export const isNetworkOrServerError = (error: unknown): boolean => {
  return (
    isAxiosError(error) &&
    (!error.response || error.response.status === 500 || error.response?.data?.code === 'UNKNOWN_ERROR')
  );
};

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeRegistry>
      <Component {...pageProps} />
    </ThemeRegistry>
  );
}

export default App;
