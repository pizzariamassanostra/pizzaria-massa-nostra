import {
  ColumnDef,
  PaginationState,
  TableOptions,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./pagination";
import { useMemo, useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  itemsCount?: number;
  paginationEnabled?: boolean;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  tableOptions?: Partial<TableOptions<TData>>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  itemsCount = data.length,
  pagination,
  paginationEnabled,
  onPaginationChange,
  tableOptions,
}: Readonly<DataTableProps<TData, TValue>>) {
  const defaultData = useMemo(() => [], []);

  const [internalPagination, setInternalPagination] = useState<PaginationState>(
    pagination ?? { pageIndex: 0, pageSize: 10 }
  );

  const defaultTableOptions: TableOptions<TData> = {
    data: data.length ? data : defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    pageCount: Math.ceil(itemsCount / internalPagination.pageSize),

    ...tableOptions,
  };

  if (pagination) {
    defaultTableOptions.state = {
      ...defaultTableOptions.state,
      pagination,
    };

    defaultTableOptions.manualPagination = true;

    // CORREÇÃO IMPORTANTE — agora é uma função e não um objeto
    defaultTableOptions.onPaginationChange = (updater) => {
      const newValue =
        typeof updater === "function" ? updater(pagination) : updater;

      onPaginationChange?.(newValue);
    };
  } else {
    defaultTableOptions.state = {
      ...defaultTableOptions.state,
      pagination: internalPagination,
    };

    defaultTableOptions.onPaginationChange = (updater) => {
      setInternalPagination((old) => {
        const newValue = typeof updater === "function" ? updater(old) : updater;
        onPaginationChange?.(newValue);
        return newValue;
      });
    };
  }

  const table = useReactTable<TData>(defaultTableOptions);

  return (
    <div>
      <div className="rounded-md border bg-white">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {paginationEnabled && (
        <DataTablePagination itemsCount={itemsCount} table={table} />
      )}
    </div>
  );
}
