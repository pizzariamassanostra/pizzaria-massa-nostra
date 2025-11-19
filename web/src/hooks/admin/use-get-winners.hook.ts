import Api from "@/common/api";
import { UsersRaffleNumber } from "@/common/interfaces/users-raffle-number.interface";
import { useQuery } from "@tanstack/react-query";

interface GetRaffleWinnersResponse {
  winner: UsersRaffleNumber;
  giftWinners: UsersRaffleNumber[];
}

export const useGetRaffleWinners = (id: string) => {
  const fetchRaffleWinner = async (): Promise<GetRaffleWinnersResponse> => {
    let url = `/raffles/winners/${id}`;

    const { data } = await Api.get(url);
    console.log(data);
    return data as GetRaffleWinnersResponse;
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["raffleWinner", id],
    queryFn: fetchRaffleWinner,
  });

  return {
    refetch,
    winner: data?.winner,
    giftWinners: data?.giftWinners,
    isLoading,
  };
};
