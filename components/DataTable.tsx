"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  className?: string;
  mobileLabel?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No records found.",
  className,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm text-neutral-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop & Tablet Table View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
        <table className="w-full text-left text-sm text-neutral-600 dark:text-neutral-300">
          <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-xs font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              {columns.map((col, index) => (
                <th key={index} scope="col" className={cn("px-4 py-3.5", col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {data.map((item) => (
              <tr key={keyExtractor(item)} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                {columns.map((col, cIndex) => {
                  const content = col.cell
                    ? col.cell(item)
                    : col.accessorKey
                    ? (item[col.accessorKey] as ReactNode)
                    : null;
                  return (
                    <td key={cIndex} className={cn("px-4 py-3.5", col.className)}>
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Responsive Layout (transforms tables on smaller screens) */}
      <div className="md:hidden space-y-3">
        {data.map((item) => (
          <div
            key={keyExtractor(item)}
            className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-2.5"
          >
            {columns.map((col, cIndex) => {
              const content = col.cell
                ? col.cell(item)
                : col.accessorKey
                ? (item[col.accessorKey] as ReactNode)
                : null;
              return (
                <div key={cIndex} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-400">
                    {col.mobileLabel || col.header}:
                  </span>
                  <div className="font-medium text-neutral-900 dark:text-neutral-100 text-right">
                    {content}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
