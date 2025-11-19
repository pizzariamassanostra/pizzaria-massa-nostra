import translateRaffleStatus from "@/common/helpers/translate-raffle-status";
import { Raffle } from "@/common/interfaces/raffles.interface";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import Link from "next/link";

export function generateRaffleDataTableColumn() {
  const columns: ColumnDef<Raffle>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <span className="text-black">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "prize_name",
      header: "Prêmio",
      cell: ({ row }) => {
        return <span className="text-black">{row.original.prize_name}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <span className="text-black">
            {translateRaffleStatus(row.original.status)}
          </span>
        );
      },
    },
    {
      accessorKey: "price_number",
      header: "Preço da cota",
      cell: ({ row }) => {
        return (
          <span className="text-black">
            R${row.original.price_number.toFixed(2).replace(".", ",")}
          </span>
        );
      },
    },
    {
      header: "Ações",
      cell: ({ row }) => {
        return (
          <Link href={`/rifas/editar/${row.original.id}`}>
            <Pencil size={20} />
          </Link>
        );
      },
    },
  ];

  return columns;
}
