import Api from "@/common/api";
import translateSort from "@/common/helpers/translate-sort";
import { CommonUser } from "@/common/interfaces/common-users.interface";
import { SortDescriptor } from "@nextui-org/table";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useGetPaginatedUsers = (name: string) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "$.0",
    direction: "ascending",
  });

  const fetchUsers = async () => {
    let url = `/common-user/list?page=${page}&per_page=${perPage}&name=${name}`;

    if (sortDescriptor.column)
      url += `&orderBy=${translateSort(sortDescriptor.column, [
        "id",
        "name",
        "phone",
        "all_raffles_numbers_bought",
      ])}`;

    if (sortDescriptor.direction)
      url += `&direction=${sortDescriptor.direction === "ascending" ? "ASC" : "DESC"}`;

    const { data } = await Api.get(url);
    setTotal(data.count);
    return data.commonUsers;
  };

  const { data, isLoading, refetch } = useQuery<
    (CommonUser & { totalRaffles?: string })[]
  >({
    queryKey: ["getAllUsers", page, perPage, name, sortDescriptor],
    queryFn: fetchUsers,
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
    commonUsers: data,
    isLoading,
    refetch,
    name,
    page,
    setPage,
    setSortDescriptor,
    sortDescriptor,
    perPage,
    setPerPage,
    total,
  };
};
