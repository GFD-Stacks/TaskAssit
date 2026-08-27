import React, { useState } from 'react';
import {
  Table as TableIcon,
  Search,
  Download,
  Filter,
  ArrowUpDown,
  ChevronDown
} from 'lucide-react';
import { StudioDataTable } from '../../types';

interface DataTableModuleProps {
  dataTable: StudioDataTable;
}

export const DataTableModule: React.FC<DataTableModuleProps> = ({ dataTable }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredRows = dataTable.rows.filter((row) => {
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSort = (colKey: string) => {
    if (sortColumn === colKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(colKey);
      setSortDirection('desc');
    }
  };

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return sortDirection === 'asc'
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const handleExportCSV = () => {
    const headers = dataTable.columns.map((c) => `"${c.label}"`).join(',');
    const rows = sortedRows
      .map((r) => dataTable.columns.map((c) => `"${r[c.key] ?? ''}"`).join(','))
      .join('\n');

    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TaskAssit_Telemetry_Data_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="space-y-4 text-gray-200">
      {/* Header & Export */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-gray-100 uppercase tracking-wider flex items-center gap-1.5">
            <TableIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>Telemetry & Campaign Database ({dataTable.totalRecords} Records)</span>
          </h3>
          <p className="text-[11px] text-gray-400">{dataTable.subtitle}</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="p-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-gray-300 text-xs flex items-center gap-1 transition-colors"
          title="Export CSV Dataset"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Filter campaigns, trends, metrics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 bg-[#282a2c] border border-[#3c4043] rounded-lg text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-[#3c4043] bg-[#242527]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#1e1f20] border-b border-[#3c4043] text-[11px] text-gray-400 uppercase tracking-wider select-none">
              {dataTable.columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`p-2.5 font-semibold ${
                    col.sortable ? 'cursor-pointer hover:text-gray-200' : ''
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.label}</span>
                    {col.sortable && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#333538]">
            {sortedRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#282a2c] transition-colors">
                {dataTable.columns.map((col) => {
                  const val = row[col.key];
                  const isPositiveVariance = col.key === 'variance' && String(val).startsWith('+');

                  return (
                    <td key={col.key} className="p-2.5 text-gray-300">
                      {col.key === 'status' ? (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold ${
                            val === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : val === 'Live'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {val}
                        </span>
                      ) : col.key === 'variance' ? (
                        <span
                          className={`font-semibold ${
                            isPositiveVariance ? 'text-emerald-400' : 'text-gray-300'
                          }`}
                        >
                          {val}
                        </span>
                      ) : (
                        <span>{val}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
