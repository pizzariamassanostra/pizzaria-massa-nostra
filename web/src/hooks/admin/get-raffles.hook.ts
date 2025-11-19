import Api from "@/common/api";
import { Raffle } from "@/common/interfaces/raffles.interface";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useGetRafflesHook = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchRaffles = async () => {
    const url = `/raffles/list?page=${page}&per_page=${perPage}`;
    const { data } = await Api.get(url);
    setTotal(data.count);
    return data.raffles;
  };

  const { data, isFetching, refetch } = useQuery<Raffle[]>({
    queryKey: ["raffles"],
    queryFn: fetchRaffles,
  });

  useEffect(() => {
    if (page === 1) {
      refetch();
    } else {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return {
    raffles: data,
    isFetching,
    refetch,
    page,
    setPage,
    perPage,
    setPerPage,
    total,
  };
};
