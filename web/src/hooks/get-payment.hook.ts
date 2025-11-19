import Api from "@/common/api";
import { Payment } from "@/common/interfaces/payments.interface";
import { useQuery } from "@tanstack/react-query";

export const useGetOnePayment = (id: string) => {
  const fetchPayment = async (): Promise<Payment> => {
    let url = `/payment/find-one/${id}`;

    const { data } = await Api.get(url);
    return data.payment as Payment;
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["useGetOnePayment", id],
    queryFn: fetchPayment,
  });

  return {
    payment: data,
    isLoading,
    refetch,
  };
};
