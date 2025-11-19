import Api from "@/common/api";
import { Raffle } from "@/common/interfaces/raffles.interface";
import { UsersRaffleNumber } from "@/common/interfaces/users-raffle-number.interface";
import { useQuery } from "@tanstack/react-query";

interface GetOneRaffleRespose {
  raffle: Raffle;
  percentage: number;
  winners: UsersRaffleNumber[];
}

export const useGetOneRaffle = (id: string, withGiftWinners?: boolean) => {
  const fetchRaffle = async (): Promise<GetOneRaffleRespose> => {
    let url = `/raffles/${id}`;
    if (withGiftWinners) url = url + "?with-gift-winners=true";
    const { data } = await Api.get(url);
    return data as GetOneRaffleRespose;
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["oneRaffle", id],
    queryFn: fetchRaffle,
  });

  return {
    raffle: data?.raffle,
    percentage: data?.percentage,
    refetch,
    winners: data?.winners,
    isLoading,
  };
};
