import axios from 'axios';

export const getMockedData = async ({ id }) => {
  // const delay = 1000;
  //
  // const delayPromise = new Promise((resolve) => setTimeout(resolve, delay));
  //
  // await delayPromise;

  const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
  return response.data;
};
