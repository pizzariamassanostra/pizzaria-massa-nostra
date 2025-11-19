import Api from "@/common/api";
import { Payment } from "@/common/interfaces/payments.interface";
import { useQuery } from "@tanstack/react-query";

export const useGetAllPaymentsByPhone = (phone: string) => {
  const fetchPaymentsByPhone = async (): Promise<Payment[]> => {
    if (!phone) return Promise.resolve([]);
    let url = `/payment/payments-by-user-phone/${phone}`;

    const { data } = await Api.get(url);
    return data.payments as Payment[];
  };

  const { data, isLoading } = useQuery({
    queryKey: ["useGetAllPaymentsByPhone", phone],
    queryFn: fetchPaymentsByPhone,
  });

  return {
    payments: data,
    isLoading,
  };
};
