import { CommonUser } from "@/common/interfaces/common-users.interface";
import { useGetPaginatedUsers } from "@/hooks/admin/get-common-users.hook";
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { useState } from "react";
import mmt from "@/lib/mmt";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Pagination } from "@nextui-org/pagination";
import { Pencil } from "lucide-react";
import UpdateCommonUser from "@/components/admin/update-common-user";
import useDebounce from "@/common/helpers/debouce-helper";

export default function Home() {
  const [name, setName] = useState("");
  const debouncedSearch = useDebounce(name, 500);

  const {
    commonUsers,
    page,
    setPage,
    total,
    perPage,
    refetch,
    setSortDescriptor,
    sortDescriptor,
  } = useGetPaginatedUsers(debouncedSearch);

  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<CommonUser>();

  const pages = Math.ceil(total / perPage);

  return (
    <div className="w-full h-min rounded-xl flex justify-center">
      <UpdateCommonUser
        isOpen={isEditUserModalOpen}
        closeModal={() => {
          setIsEditUserModalOpen(false);
        }}
        onUpdated={async () => {
          refetch();
        }}
        commonUser={selectedUser as CommonUser}
      />
      <Card
        isBlurred
        className="flex space-y-4 max-w-7xl p-8 justify-center items-center w-full"
      >
        <div className="w-full flex flex-row justify-between">
          <span className="text-2xl w-1/2 text-end">Usuários</span>
          <Input
            className="w-[300px]"
            value={name}
            label="Pesquisar por Nome, ID ou Telefone"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Table
          className="max-w-3x w-full"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          bottomContent={
            pages > 0 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn allowsSorting={true}>ID</TableColumn>
            <TableColumn allowsSorting={true}>Nome</TableColumn>
            <TableColumn>Telefone</TableColumn>
            <TableColumn allowsSorting={true}>Números comprados</TableColumn>
            <TableColumn>Cadastro criado</TableColumn>
            <TableColumn>Atualizado em</TableColumn>
            <TableColumn>Ações</TableColumn>
          </TableHeader>
          <TableBody>
            {commonUsers
              ? commonUsers.map((cUser) => (
                  <TableRow key={cUser.id}>
                    <TableCell>{cUser.id}</TableCell>
                    <TableCell>{cUser.name}</TableCell>
                    <TableCell>{cUser.phone}</TableCell>
                    <TableCell>{cUser.totalRaffles ?? 0}</TableCell>
                    <TableCell>
                      {mmt(cUser.created_at).format("DD-MM-YYYY HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      {mmt(cUser.updated_at).format("DD-MM-YYYY HH:mm:ss")}
                    </TableCell>
                    <TableCell className="flex flex-row space-x-2">
                      <div
                        onClick={() => {
                          setSelectedUser(cUser);
                          setIsEditUserModalOpen(true);
                        }}
                        className="cursor-pointer transition-all hover:text-green-500"
                      >
                        <Pencil />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : []}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
