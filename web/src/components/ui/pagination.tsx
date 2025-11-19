import { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface DataTablePaginationProps<T> {
  table: Table<T>;
  itemsCount?: number;
}

export const DataTablePagination = <T,>({
  table,
  itemsCount,
}: DataTablePaginationProps<T>) => {
  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <div className="flex justify-between mt-2 gap-3">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Por página</p>
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex space-x-2 items-center">
        <p className="text-sm font-medium">
          {pageIndex * pageSize + 1} -{" "}
          {pageIndex === table.getPageCount() - 1
            ? itemsCount
            : pageIndex === 0
              ? pageSize
              : pageIndex * pageSize + pageSize}{" "}
          de {itemsCount}{" "}
        </p>
        <button
          className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-300"
          onClick={() => {
            table.previousPage();
          }}
        >
          <ArrowLeft />
        </button>

        <button
          className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-300"
          onClick={() => {
            table.nextPage();
          }}
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};
