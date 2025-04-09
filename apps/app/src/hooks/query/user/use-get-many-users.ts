import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGetManyUsers = () => {
  return useQuery({
    queryKey: ['get-many-users'],
    queryFn: getManyUsers,
  });
};

async function getManyUsers() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/user`
  );
  return response.data;
}
