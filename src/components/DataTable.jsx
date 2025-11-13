import { useState, useMemo } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Columns } from "lucide-react";
import PaginationComponent from "./PaginationComponent";
import "./DataTable.css";

/**
 * DataTable Component
 * A reusable table component that accepts JSX elements directly in cell data
 *
 * @param {Array} data - Array of objects where values can be JSX elements
 *   Example: [{ name: <span>Alice</span>, age: <span>25</span> }]
 *
 * @param {Array} headerData - Array of header configurations. Each object should have:
 *   - accessorKey: string - The key in data object (e.g., "name", "age", "status")
 *   - label: string - The header label text to display
 *   - tooltip: JSX.Element - Optional JSX icon element for tooltip (e.g., <span>ℹ️</span>)
 *   - tooltipText: string - Optional tooltip text shown on hover
 *   - icons: Array<JSX.Element> - Optional array of JSX icon elements
 *
 * @param {Function} onRowClick - Optional callback function when a row is clicked
 *   Receives (rowData, rowId) as parameters
 *
 * @param {string|number} selectedRowId - Optional selected row ID for highlighting
 *
 *   Example:
 *   [{
 *     accessorKey: "name",
 *     label: "Name",
 *     tooltip: <span>ℹ️</span>,
 *     tooltipText: "Full name of the person",
 *     icons: [
 *       <span key="sort" onClick={() => {}}>↕️</span>,
 *       <span key="filter" onClick={() => {}}>🔍</span>,
 *       <span key="export" onClick={() => {}}>📥</span>
 *     ]
 *   }]
 *
 */
function DataTable({
  data,
  headerData,
  onRowClick = null,
  selectedRowId = null,
  // Pagination props
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPagination = false,
  // Selection props - simple array and one function
  selectedIds = [],
  onSelection = null,
}) {
  const [columnVisibility, setColumnVisibility] = useState({});

  /**
   * Generate columns from headerData array
   *
   * WHY accessorKey IS NEEDED (different from label):
   *
   * Your data looks like: { name: "Alice", age: 25, status: "Active" }
   *
   * - accessorKey: "name" → Tells table: "Get data from row.name"
   *                 This MUST match the key in your data object!
   *
   * - label: "Name" → Tells table: "Display 'Name' in the header"
   *           This is just for display, can be anything!
   *
   * Example:
   *   Data: { fullName: "Alice", userAge: 25 }
   *   accessorKey: "fullName" (must match data key)
   *   label: "Full Name" (can be different, just for display)
   *
   * Without accessorKey, the table wouldn't know which data field to use!
   */
  /**
   * HOW accessorKey MATCHING WORKS:
   *
   * Step 1: We get accessorKey from headerData (e.g., "name")
   * Step 2: We set it in column definition: accessorKey: "name"
   * Step 3: TanStack Table AUTOMATICALLY uses accessorKey to access data
   *
   * When you write: accessorKey: "name"
   * TanStack Table does: row["name"] or row.name
   *
   * Example:
   *   headerData: { accessorKey: "name" }
   *   data: { name: "Alice", age: 25 }
   *
   *   Column definition: { accessorKey: "name" }
   *   → TanStack Table automatically accesses: row.name
   *   → Gets value: "Alice"
   *
   * The matching happens HERE - when we set accessorKey in column definition!
   * TanStack Table uses it to automatically look up the value from your data.
   */
  // Generate columns with checkbox column first
  const tableColumns = useMemo(() => {
    const regularColumns = headerData
      ? headerData.map((header) => {
          const accessorKey = header.accessorKey;
          return {
            accessorKey: accessorKey, // Maps to data[accessorKey] - e.g., data.name
            id: accessorKey,
            header: header.label, // Just for display in header
            cell: (info) => info.getValue(), // Gets value from data[accessorKey]
          };
        })
      : [];

    /**
     * checkboxColumn - Checkbox column for row selection
     *
     * HOW IT WORKS:
     * ============
     * This column is automatically added as the FIRST column in the table.
     * It does NOT need to be included in headerData array.
     *
     * STRUCTURE:
     * - id: "select" - Unique identifier for this column
     * - header: Function that returns JSX for the HEADER checkbox (select-all checkbox)
     * - cell: Function that returns JSX for each ROW checkbox (individual row selection)
     *
     * HEADER CHECKBOX (Select All):
     * ----------------------------
     * The header function receives the table instance and:
     * 1. Checks if ALL rows are selected: tableInstance.getIsAllRowsSelected()
     * 2. Checks if SOME (but not all) rows are selected: tableInstance.getIsSomeRowsSelected()
     * 3. Returns a Checkbox component that:
     *    - Shows checked state when ALL rows are selected
     *    - Shows semi-transparent (0.7 opacity) when SOME rows are selected
     *    - When clicked, toggles ALL rows selected/unselected
     *
     * ROW CHECKBOX (Individual Row Selection):
     * ----------------------------------------
     * The cell function receives the row object and:
     * 1. Checks if THIS specific row is selected: row.getIsSelected()
     * 2. Returns a Checkbox component that:
     *    - Shows checked state when THIS row is selected
     *    - When clicked, toggles THIS row's selected state: row.toggleSelected(checked)
     *
     * RENDERING FLOW:
     * --------------
     * 1. DataTable creates checkboxColumn with header and cell functions
     * 2. TableHeader component detects column.id === "select" and renders the header checkbox
     * 3. TableBody component renders each row, and flexRender calls the cell function for each row
     * 4. Each row gets its own checkbox that controls that row's selection
     */
    const checkboxColumn = {
      id: "select",
      header: () => {
        // Check if all current page rows are selected
        const currentPageIds = data.map((row) => row.id).filter(Boolean);
        const isAllSelected =
          currentPageIds.length > 0 &&
          currentPageIds.every((id) => selectedIds.includes(id));
        const isSomeSelected = currentPageIds.some((id) =>
          selectedIds.includes(id)
        );

        return (
          <Checkbox
            checked={isAllSelected}
            indeterminate={isSomeSelected && !isAllSelected}
            onCheckedChange={() => {
              if (onSelection) {
                onSelection(); // No ID = select all
              }
            }}
          />
        );
      },
      cell: ({ row }) => {
        const rowId = row.original.id;
        const isChecked = rowId && selectedIds.includes(rowId);

        return (
          <Checkbox
            checked={isChecked}
            onCheckedChange={() => {
              if (onSelection && rowId) {
                onSelection(rowId); // With ID = toggle single
              }
            }}
          />
        );
      },
    };

    return [checkboxColumn, ...regularColumns];
  }, [headerData, data, selectedIds, onSelection]);

  /**
   * useReactTable() - TanStack Table Hook
   *
   * WHERE IT COMES FROM:
   * - Imported from '@tanstack/react-table' package
   * - This is the main hook that creates a table instance
   * - It's NOT general JavaScript - it's from TanStack Table library
   *
   * WHAT IT DOES:
   * - Takes your data and columns, processes them
   * - Returns a 'table' object with methods like:
   *   - table.getRowModel() - gets all rows
   *   - table.getHeaderGroups() - gets all header groups
   *   - And many other table methods
   *
   * PARAMETERS:
   * - data: Your array of row data
   *   Example: [{ id: "1", name: "Alice" }, { id: "2", name: "Bob" }]
   *
   * - columns: Column definitions (created from headerData)
   *   Defines how each column should be displayed and what data to show
   *   Example: [{ accessorKey: "name", header: "Name" }, ...]
   *
   * - getCoreRowModel: Required - tells table how to process rows
   *   This is a function that returns the core row model
   *   Always use: getCoreRowModel() from '@tanstack/react-table'
   *
   * - getRowId: Optional - function to get unique ID for each row
   *   WHY NEEDED: By default, TanStack Table uses array index (0, 1, 2...) as row IDs
   *   PROBLEM: When data changes (e.g., pagination), indices change but actual row IDs don't
   *   SOLUTION: Use getRowId to use actual candidate IDs (e.g., "candidate123") instead of indices
   *   BENEFIT: Row selection persists across page changes because IDs stay the same
   *   Example: getRowId: (row) => String(row.id) - uses row.id as unique identifier
   *
   * - onColumnVisibilityChange: Optional - callback when column visibility changes
   *   WHY NEEDED: When user shows/hides columns via "Show Columns" dropdown
   *   WHAT IT DOES: Updates columnVisibility state to track which columns are visible
   *   Example: User unchecks "Designation" → this function updates state → column hides
   *
   * - state: Object containing table state
   *   - columnVisibility: Object tracking which columns are visible
   *     Format: { "name": true, "designation": false, "status": true }
   *     WHY NEEDED: Controls which columns are shown/hidden in the table
   *     Example: { "name": true, "designation": false } means "name" is visible, "designation" is hidden
   */
  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => {
      return row.id !== undefined ? String(row.id) : undefined;
    },
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  /**
   * Handle row click event
   * - Calls the onRowClick callback if provided
   * - Parent component manages selectedRowId state externally
   */
  const handleRowClick = (rowData, rowId) => {
    // Call the parent's onRowClick callback if provided
    // Parent will update selectedRowId state externally
    if (onRowClick) {
      onRowClick(rowData, rowId);
    }
  };

  // Get all columns except the checkbox column for visibility dropdown
  const allColumns = table.getAllColumns().filter((column) => {
    return column.id !== "select";
  });

  // Create a map for quick lookup of header labels by column id
  const headerLabelMap = {};
  if (headerData && headerData.length > 0) {
    headerData.forEach((header) => {
      headerLabelMap[header.accessorKey] = header.label;
    });
  }

  return (
    <div className="data-table-container">
      <div className="table-controls">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="column-visibility-trigger"
            >
              <Columns className="column-icon" size={16} />
              <span>Show Columns</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="column-dropdown-content">
            <DropdownMenuLabel>Show/Hide Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allColumns.map((column) => {
              const columnId = column.id;
              const columnLabel = headerLabelMap[columnId] || columnId;
              const isVisible = column.getIsVisible();

              return (
                <DropdownMenuCheckboxItem
                  key={columnId}
                  checked={isVisible}
                  onCheckedChange={(checked) => {
                    column.toggleVisibility(checked);
                  }}
                  className="column-checkbox-item"
                >
                  {columnLabel}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <table className="data-table">
        <TableHeader table={table} headerData={headerData} />
        <TableBody
          table={table}
          onRowClick={onRowClick ? handleRowClick : null}
          selectedRowId={selectedRowId}
        />
      </table>
      {showPagination && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
}

export default DataTable;
