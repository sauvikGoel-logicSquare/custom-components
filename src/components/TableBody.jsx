import { flexRender } from "@tanstack/react-table";

/**
 * TableBody Component
 * Renders the table body section with rows and cells
 * Supports JSX elements directly in cell data
 * @param {Object} table - TanStack Table instance
 * @param {Function} onRowClick - Function to call when a row is clicked
 * @param {string|number} selectedRowId - ID of the currently selected row
 */
function TableBody({ table, onRowClick, selectedRowId }) {
  return (
    <tbody className="table-body">
      {/**
       * table.getRowModel() - TanStack Table Method
       *
       * WHERE IT COMES FROM:
       * - This is a method provided by TanStack Table library
       * - The 'table' object is created by useReactTable() hook (see DataTable.jsx)
       * - It's NOT general JavaScript syntax - it's specific to TanStack Table
       *
       * WHAT IT DOES:
       * - Returns a RowModel object containing all rows to render
       * - .rows is an array of row objects (one for each item in your data array)
       * - Each row object has properties like: id, original (your data), getVisibleCells(), etc.
       *
       * DOCUMENTATION:
       * - Official docs: https://tanstack.com/table/latest/docs/api/core/table#getrowmodel
       * - The table instance is created in DataTable.jsx using useReactTable() hook
       */}
      {table.getRowModel().rows.map((row) => {
        const isSelected = selectedRowId === row.id;
        // Check if this row's name cell should be clickable
        // Add isClickable: true/false in your data object to control which names are clickable
        // Example: { name: "Alice", isClickable: true } - Alice's name is clickable
        //          { name: "Bob", isClickable: false } - Bob's name is disabled
        const isNameClickable = row.original.isClickable !== false; // Default true, set false to disable

        return (
          <tr
            key={row.id}
            className={`body-row ${isSelected ? "body-row-selected" : ""}`}
          >
            {/**
             * row.getVisibleCells() - TanStack Table Method
             *
             * WHERE IT COMES FROM:
             * - This is a method on the row object returned by table.getRowModel().rows
             * - Each row object (from TanStack Table) has this method
             * - It's NOT general JavaScript syntax - it's specific to TanStack Table
             *
             * WHAT IT DOES:
             * - Returns an array of cell objects for this row
             * - Only returns cells for VISIBLE columns (respects column visibility settings)
             * - Each cell object has: id, column, getValue(), etc.
             *
             * DOCUMENTATION:
             * - Official docs: https://tanstack.com/table/latest/docs/api/core/row#getvisiblecells
             * - The row object comes from table.getRowModel().rows array
             */}
            {row.getVisibleCells().map((cell) => {
              /**
               * ROW CHECKBOX RENDERING
               * ======================
               *
               * HOW IT WORKS:
               * 1. row.getVisibleCells() returns ALL visible cells for this row
               * 2. One of these cells has column.id === "select" (the checkbox column)
               * 3. When we reach the checkbox cell, flexRender() calls the cell function
               * 4. The cell function (defined in DataTable.jsx checkboxColumn) returns a Checkbox component
               * 5. This Checkbox is rendered in the first column of each row
               *
               * WHAT HAPPENS WHEN YOU CLICK A ROW CHECKBOX:
               * - The Checkbox's onCheckedChange is called
               * - It calls row.toggleSelected(checked)
               * - This updates the rowSelection state in DataTable
               * - The header checkbox automatically updates to reflect the new state
               * - All checkboxes re-render with their new checked states
               *
               * NOTE: The checkbox cell is rendered automatically - you don't need to do anything special!
               * The checkboxColumn.cell function handles everything.
               */

              // Only make "name" column clickable, and only if row allows it
              const isNameColumn = cell.column.id === "name";
              const isClickable = isNameColumn && onRowClick && isNameClickable;

              return (
                <td
                  key={cell.id}
                  className={`body-cell ${
                    isClickable ? "body-cell-clickable" : ""
                  } ${
                    isNameColumn && !isNameClickable ? "body-cell-disabled" : ""
                  }`}
                  onClick={() =>
                    isClickable && onRowClick(row.original, row.id)
                  }
                >
                  {/**
                   * flexRender() - Renders the cell content
                   *
                   * FOR CHECKBOX COLUMN:
                   * - When cell.column.id === "select", this calls checkboxColumn.cell()
                   * - The cell function receives { row } and returns <Checkbox />
                   * - Each row gets its own checkbox instance
                   *
                   * FOR OTHER COLUMNS:
                   * - Renders the regular cell content (text, JSX, etc.)
                   */}
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
}

export default TableBody;
