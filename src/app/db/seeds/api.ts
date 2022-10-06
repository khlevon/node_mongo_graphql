import axios from "axios";

export const fetchNextChunk = async (
  resource: string,
  skip: number,
  limit: number = 50
) => {
  const { data } = await axios.get(
    `https://dummyjson.com/${resource}?limit=${limit}&skip=${skip}`
  );

  return data;
};
