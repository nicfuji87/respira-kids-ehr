import * as React from "react"
import { Card, CardContent } from "@/components/primitives/card"
import { cn } from "@/lib/utils"

// DataTable - NÍVEL 2: Combinação de primitivos
// TODO: Implementar funcionalidade completa com paginação, ordenação, etc.

export interface DataTableColumn<T> {
  key: keyof T
  header: string
  cell?: (item: T) => React.ReactNode
}

export interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  className?: string
}

export function DataTable<T>({
  data,
  columns,
  className
}: DataTableProps<T>) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className="text-left p-4 font-medium"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  {columns.map((column) => (
                    <td key={String(column.key)} className="p-4">
                      {column.cell 
                        ? column.cell(item) 
                        : String(item[column.key])
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
} 