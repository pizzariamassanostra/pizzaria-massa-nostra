import Api from "@/common/api";
import { RaffleStatus } from "@/common/enum/raffle-status.enum";
import { Raffle } from "@/common/interfaces/raffles.interface";
import { useQuery } from "@tanstack/react-query";

export interface GetAllRafflesHookParams {
  status?: RaffleStatus;
  page?: number;
  per_page?: number;
}

export const useGetAllRaffles = (opt?: GetAllRafflesHookParams) => {
  const { status, page, per_page } = opt ?? {};
  const fetchAllRaffles = async (): Promise<Raffle[]> => {
    let url = `/raffles/list?`;
    if (status) url += `&status=${status}`;
    if (page) url += `&page=${page}`;
    if (per_page) url += `&per_page=${per_page}`;

    const { data } = await Api.get(url);
    return data.raffles as Raffle[];
  };

  const { data, isLoading } = useQuery({
    queryKey: ["allRaffles"],
    queryFn: fetchAllRaffles,
  });

  return {
    raffles: data,
    isLoading,
  };
};
