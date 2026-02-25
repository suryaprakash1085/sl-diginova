import React from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  hideMobile?: boolean;
}

interface ResponsiveTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyField: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  loadingRows?: number;
  renderMobileCard?: (item: T) => React.ReactNode;
  className?: string;
}

export function ResponsiveTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No data found",
  loadingRows = 3,
  renderMobileCard,
  className,
}: ResponsiveTableProps<T>) {
  const visibleColumns = columns.filter(col => !col.hideMobile);

  // Desktop table view
  const desktopView = (
    <div className="hidden md:block overflow-x-auto">
      <Table className={className}>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  "whitespace-nowrap",
                  column.className
                )}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array(loadingRows)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={`loading-${i}`}>
                    {columns.map((column) => (
                      <TableCell key={column.key} className="h-10 bg-slate-100 animate-pulse" />
                    ))}
                  </TableRow>
                ))
            : isEmpty
            ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-slate-500">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )
            : data.map((item) => (
              <TableRow key={item[keyField]}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn("py-4", column.className)}
                  >
                    {column.render ? column.render(item) : String(item[column.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );

  // Mobile card view
  const mobileView = renderMobileCard ? (
    <div className="md:hidden space-y-3">
      {isLoading
        ? Array(loadingRows)
            .fill(0)
            .map((_, i) => (
              <div
                key={`loading-${i}`}
                className="bg-slate-100 animate-pulse rounded-lg h-32"
              />
            ))
        : isEmpty
        ? (
          <div className="text-center py-8 text-slate-500">
            {emptyMessage}
          </div>
        )
        : data.map((item) => (
          <div key={item[keyField]}>
            {renderMobileCard(item)}
          </div>
        ))}
    </div>
  ) : (
    <div className="md:hidden overflow-x-auto">
      <Table className={className}>
        <TableHeader>
          <TableRow>
            {visibleColumns.map((column) => (
              <TableHead
                key={column.key}
                className={cn("text-xs", column.className)}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array(loadingRows)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={`loading-${i}`}>
                    {visibleColumns.map((column) => (
                      <TableCell key={column.key} className="h-10 bg-slate-100 animate-pulse" />
                    ))}
                  </TableRow>
                ))
            : isEmpty
            ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} className="text-center py-4 text-xs text-slate-500">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )
            : data.map((item) => (
              <TableRow key={item[keyField]}>
                {visibleColumns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn("py-2 text-xs", column.className)}
                  >
                    {column.render ? column.render(item) : String(item[column.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      {desktopView}
      {mobileView}
    </>
  );
}
