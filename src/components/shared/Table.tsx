import React from 'react';

interface TableProps {
  columns: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ columns, children }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-border-custom">
      <table className="w-full text-sm text-left text-text/80">
        <thead className="text-xs text-text uppercase bg-primary/5 border-b border-border-custom">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} scope="col" className="px-6 py-4 font-bold tracking-wider">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-custom bg-surface">
          {children}
        </tbody>
      </table>
    </div>
  );
};

