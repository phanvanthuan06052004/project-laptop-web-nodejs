import React from "react"
import { cn } from "~/lib/utils"

export const Table = ({ className, children, ...props }) => (
  <div className="relative w-full overflow-auto">
    <table className={cn("w-full caption-bottom text-sm", className)} {...props}>
      {children}
    </table>
  </div>
)

export const TableHeader = ({ className, children, ...props }) => (
  <thead className={cn("[&_tr]:border-b", className)} {...props}>
    {children}
  </thead>
)

export const TableBody = ({ className, children, ...props }) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props}>
    {children}
  </tbody>
)

export const TableFooter = ({ className, children, ...props }) => (
  <tfoot className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)} {...props}>
    {children}
  </tfoot>
)

export const TableRow = ({ className, children, ...props }) => (
  <tr
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  >
    {children}
  </tr>
)

export const TableHead = ({ className, children, ...props }) => (
  <th
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  >
    {children}
  </th>
)

export const TableCell = ({ className, children, ...props }) => (
  <td
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  >
    {children}
  </td>
)

export const TableCaption = ({ className, children, ...props }) => (
  <caption className={cn("mt-4 text-sm text-muted-foreground", className)} {...props}>
    {children}
  </caption>
)
