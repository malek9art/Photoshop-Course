import { EmptyState } from "../ui";

/**
 * Modern data table shell — sticky header, zebra-free hover rows, horizontal
 * scroll on small screens, and a built-in empty state.
 * Purely presentational: consumers still render their own cells.
 */
export function DataTable({
  columns,
  children,
  empty = "لا توجد بيانات بعد",
  caption,
  rowCount,
}: {
  columns: { key: string; label: string; className?: string }[];
  children?: React.ReactNode;
  empty?: string;
  caption?: string;
  rowCount: number;
}) {
  if (rowCount === 0) {
    return <EmptyState title={empty} />;
  }
  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] text-sm">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead>
            <tr className="border-b border-hairline bg-surface-muted/70">
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={`whitespace-nowrap px-4 py-3 text-right text-2xs font-bold uppercase tracking-wider text-neutral-500 ${c.className ?? ""}`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function Td({
  children,
  className = "",
  mono = false,
  dir,
}: {
  children: React.ReactNode;
  className?: string;
  mono?: boolean;
  dir?: "ltr" | "rtl";
}) {
  return (
    <td dir={dir} className={`px-4 py-3 align-middle ${mono ? "font-mono text-xs" : ""} ${className}`}>
      {children}
    </td>
  );
}

export function Tr({ children }: { children: React.ReactNode }) {
  return <tr className="transition-colors duration-fast hover:bg-surface-muted/70">{children}</tr>;
}
