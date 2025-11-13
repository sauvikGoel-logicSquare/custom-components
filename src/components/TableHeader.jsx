import { flexRender } from "@tanstack/react-table";

/**
 * TableHeader Component
 * Renders the table header section with custom header data structure
 * @param {Object} table - TanStack Table instance
 * @param {Array} headerData - Array of header configurations with label, tooltip, icons, etc.
 */
function TableHeader({ table, headerData = [] }) {
  // Create a map for quick lookup of header config by column id
  // Uses accessorKey directly (must match column.id from DataTable)
  const headerConfigMap = {};
  if (headerData && headerData.length > 0) {
    headerData.forEach((header) => {
      headerConfigMap[header.accessorKey] = header;
    });
  }

  return (
    <thead className="table-header">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className="header-row">
          {headerGroup.headers.map((header) => {
            const columnId = header.column.id;
            const headerConfig = headerConfigMap[columnId] || {};

            /**
             * CHECKBOX COLUMN DETECTION
             * =========================
             * The checkbox column has id: "select" (defined in DataTable.jsx)
             * It is NOT in headerData array, so headerConfigMap won't have it
             * We detect it by checking if columnId === "select"
             */
            const isCheckboxColumn = columnId === "select";

            return (
              <th key={header.id} className="header-cell">
                {isCheckboxColumn ? (
                  /**
                   * RENDER HEADER CHECKBOX (Select All Checkbox)
                   * ============================================
                   *
                   * HOW IT WORKS:
                   * 1. We detect this is the checkbox column (id === "select")
                   * 2. We use flexRender() to call the header function from checkboxColumn
                   * 3. The header function (defined in DataTable.jsx) returns the Checkbox JSX
                   * 4. We wrap it in a div for proper styling/centering
                   *
                   * WHAT GETS RENDERED:
                   * - A single Checkbox component in the header
                   * - This checkbox controls ALL rows (select all / deselect all)
                   * - It shows checked when ALL rows are selected
                   * - It shows semi-transparent when SOME rows are selected
                   */
                  <div className="header-checkbox-wrapper">
                    {flexRender(
                      header.column.columnDef.header, // Calls the header function from checkboxColumn
                      header.getContext() // Passes table instance and other context
                    )}
                  </div>
                ) : (
                  <div className="header-content">
                    <div className="header-label-section">
                      <span className="header-label">
                        {headerConfig.label ||
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </span>
                      {headerConfig.tooltip && (
                        <span title={headerConfig.tooltipText || ""}>
                          {headerConfig.tooltip}
                        </span>
                      )}
                    </div>
                    <div className="header-actions">
                      {headerConfig.icons &&
                        headerConfig.icons.map((icon, index) => (
                          <span key={index}>{icon}</span>
                        ))}
                    </div>
                  </div>
                )}
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}

export default TableHeader;
