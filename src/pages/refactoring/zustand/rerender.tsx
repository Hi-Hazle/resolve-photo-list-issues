import { Box, Input, Typography } from '@mui/material';
import { useStore } from '@/store';
import { memo, useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

export default function Rerender() {
  return (
    <>
      <AsIsParent />
      <ToBe1Parent />
      <ToBe2Parent />
    </>
  );
}

const AsIsParent = () => {
  const { value3 } = useStore();
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <Box sx={{ p: 2, m: 2, border: '1px solid #333' }}>
      <Typography variant='h6'>
        <b>[AS-IS]</b>
      </Typography>
      <Typography variant='subtitle1' sx={{ mb: 1, background: '#ddd', p: 1 }}>
        1. 자식 컴포넌트만 리렌더링될 것으로 예상했지만, 부모 컴포넌트까지 <b>불필요하게</b> 리렌더링되는 문제 발생{' '}
        <br />
        2. Child1, Child2
      </Typography>
      <Typography variant='h6'>
        <b>Parent1</b> Render Count: {renderCount.current}
      </Typography>
      <Typography variant='h6'>value3 : {value3}</Typography>
      <AsIsChild1 />
      <AsIsChild2 />
    </Box>
  );
};

const AsIsChild1 = () => {
  const { value1, setValue1 } = useStore();
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <Box sx={{ p: 2, m: 2, border: '1px solid #333' }}>
      <Typography variant='h6'>
        <b>Child1</b> Render Count: {renderCount.current}
      </Typography>
      value1 : <Input value={value1} onChange={(e) => setValue1(e.target.value)} placeholder='setValue1' />
      <Typography variant='subtitle1' sx={{ mt: 2, p: 1, background: '#ddd' }}>
        <b>Child1</b>에서 사용하지 않는 상태가 다른 컴포넌트에서 변경되어도 리랜더 발생 <br />
      </Typography>
    </Box>
  );
};

const AsIsChild2 = () => {
  const { value2, setValue2 } = useStore();
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <Box sx={{ p: 2, m: 2, border: '1px solid #333' }}>
      <Typography variant='h6'>
        <b>Child2</b> Render Count: {renderCount.current}
      </Typography>
      value2: <Input value={value2} onChange={(e) => setValue2(e.target.value)} placeholder='setValue2' />
      <Typography variant='subtitle1' sx={{ mt: 2, p: 1, background: '#ddd' }}>
        <b>Child2</b>에서 사용하지 않는 상태가 다른 컴포넌트에서 변경되어도 리랜더 발생 <br />
      </Typography>
    </Box>
  );
};

const ToBe1Parent = () => {
  const [value3, setValue3] = useStore(useShallow(({ value3, setValue3 }) => [value3, setValue3]));
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <Box sx={{ p: 2, m: 2, border: '1px solid #333' }}>
      <Typography variant='h6'>
        <b>[TO-BE-1]</b>
      </Typography>
      <Typography variant='subtitle1' sx={{ mb: 1, background: '#ddd', p: 1 }}>
        1. 각 컴포넌트가 실제로 구독하고 있는 상태에 대해서만 리랜더 발생하도록 <b>useShallow</b> 사용 <br />
        2. 하지만 부모에서 발생하는 리랜더로 인해 자식도 리랜더링 되는 현상은 해결되지 않음
      </Typography>
      <Typography variant='h6'>
        <b>Parent2</b> Render Count: {renderCount.current}
      </Typography>
      <Typography variant='h6'>value3 : {value3}</Typography>
      <Input value={value3} onChange={(e) => setValue3(e.target.value)} placeholder='setValue3' />
      <ToBe1Child1 />
      <ToBe1Child2 />
    </Box>
  );
};

const ToBe1Child1 = () => {
  const [value1, setValue1] = useStore(useShallow(({ value1, setValue1 }) => [value1, setValue1]));
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <Box sx={{ p: 2, m: 2, border: '1px solid #333' }}>
      <Typography variant='h6'>
        <b>Child3</b> Render Count: {renderCount.current}
      </Typography>
      value1 : <Input value={value1} onChange={(e) => setValue1(e.target.value)} placeholder='setValue1' />
    </Box>
  );
};

const ToBe1Child2 = () => {
  const [value2, setValue2] = useStore(useShallow(({ value2, setValue2 }) => [value2, setValue2]));
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <Box sx={{ p: 2, m: 2, border: '1px solid #333' }}>
      <Typography variant='h6'>
        <b>Child4</b> Render Count: {renderCount.current}
      </Typography>
      value2: <Input value={value2} onChange={(e) => setValue2(e.target.value)} placeholder='setValue2' />
    </Box>
  );
};

const ToBe2Parent = () => {
  const [value3, setValue3] = useStore(useShallow(({ value3, setValue3 }) => [value3, setValue3]));
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <Box sx={{ p: 2, m: 2, border: '1px solid #333' }}>
      <Typography variant='h6'>
        <b>[TO-BE-2]</b>
      </Typography>
      <Typography variant='subtitle1' sx={{ mb: 1, background: '#ddd', p: 1 }}>
        부모에서 발생하는 리랜더가 자식에게 영향을 주지 않도록 <b>memo</b> 사용 <br />
      </Typography>
      <Typography variant='h6'>
        <b>Parent2</b> Render Count: {renderCount.current}
      </Typography>
      <Typography variant='h6'>value3 : {value3}</Typography>
      <Input value={value3} onChange={(e) => setValue3(e.target.value)} placeholder='setValue3' />
      <ToBe2Child1 />
      <ToBe2Child2 />
    </Box>
  );
};

const ToBe2Child1 = memo(() => {
  const [value1, setValue1] = useStore(useShallow(({ value1, setValue1 }) => [value1, setValue1]));
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <Box sx={{ p: 2, m: 2, border: '1px solid #333' }}>
      <Typography variant='h6'>
        <b>MemoChild</b> Render Count: {renderCount.current}
      </Typography>
      value1 : <Input value={value1} onChange={(e) => setValue1(e.target.value)} placeholder='setValue1' />
    </Box>
  );
});

const ToBe2Child2 = () => {
  const [value2, setValue2] = useStore(useShallow(({ value2, setValue2 }) => [value2, setValue2]));
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <Box sx={{ p: 2, m: 2, border: '1px solid #333' }}>
      <Typography variant='h6'>
        <b>NormalChild</b> Render Count: {renderCount.current}
      </Typography>
      value2: <Input value={value2} onChange={(e) => setValue2(e.target.value)} placeholder='setValue2' />
    </Box>
  );
};
