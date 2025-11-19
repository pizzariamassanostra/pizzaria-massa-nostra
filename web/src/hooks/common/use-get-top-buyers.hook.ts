import Api from "@/common/api";
import { useQuery } from "@tanstack/react-query";

interface GetTopBuyersResponse {
  common_user_name: string;
  count: string;
}

export const useGetTopBuyers = (id: string) => {
  const fetchTopBuyers = async (): Promise<GetTopBuyersResponse[]> => {
    let url = `/raffles/top-buyers/${id}`;

    const { data } = await Api.get(url);
    return data.topBuyers as GetTopBuyersResponse[];
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["topBuyers", id],
    queryFn: fetchTopBuyers,
  });

  return {
    refetch,
    topBuyers: data,
    isLoading,
  };
};
