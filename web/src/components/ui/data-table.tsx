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
import { useEffect, useMemo, useState } from "react";

// Props
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  itemsCount?: number;
  paginationEnabled?: boolean;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  tableOptions?: Partial<TableOptions<TData>>;
}

// Component itself
export function DataTable<TData, TValue>({
  columns,
  data,
  itemsCount = data.length,
  pagination,
  paginationEnabled,
  onPaginationChange,
  tableOptions,
}: DataTableProps<TData, TValue>) {
  const defaultData = useMemo(() => [], []);

  // Table definition
  const defaultTableOptions: TableOptions<TData> = {
    data: data.length ? data : defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    pageCount: Math.ceil(itemsCount / (pagination?.pageSize ?? 10)),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    ...tableOptions,
  };

  const [internalPagination, setPagination] = useState<PaginationState>(
    pagination ?? { pageIndex: 0, pageSize: 10 },
  );

  if (pagination) {
    defaultTableOptions.state = {
      ...defaultTableOptions.state,
      pagination,
    };
    defaultTableOptions.manualPagination = true;
    defaultTableOptions.onPaginationChange = setPagination;
  }

  useEffect(() => {
    onPaginationChange?.(internalPagination);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalPagination]);

  const table = useReactTable<TData>({
    ...defaultTableOptions,
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="rounded-md border bg-white">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
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
                        cell.getContext(),
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
