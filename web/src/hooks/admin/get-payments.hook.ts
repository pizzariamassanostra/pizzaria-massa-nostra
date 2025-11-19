import Api from "@/common/api";
import { Payment } from "@/common/interfaces/payments.interface";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useGetPaginatedPayments = (name: string) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchPayments = async () => {
    const url = `/payment/list?page=${page}&per_page=${perPage}&name=${name}`;
    const { data } = await Api.get(url);
    setTotal(data.count);
    return data.payments;
  };

  const { data, isLoading, refetch } = useQuery<Payment[]>({
    queryKey: ["payments", page, perPage, name],
    queryFn: fetchPayments,
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
    payments: data,
    isLoading,
    refetch,
    name,
    page,
    setPage,
    perPage,
    setPerPage,
    total,
  };
};
