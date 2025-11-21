import { flexRender } from "@tanstack/react-table";
import { Info } from "lucide-react";
import ToolTipBubble from "./ToolTipBubble";

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
            const isDragHandleColumn = columnId === "drag-handle";

            return (
              <th key={header.id} className="header-cell">
                {isDragHandleColumn ? (
                  // Drag handle header - empty
                  <div className="drag-handle-header"></div>
                ) : isCheckboxColumn ? (
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

                      {/* tooltip utility -- tooltipText is required to show the tooltip, tooltip is optional to show custom tooltip icon */}
                      {headerConfig?.tooltipText ? (
                        <div
                          className="header-tooltip-trigger"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            marginLeft: 2,
                            position: "relative",
                          }}
                          tabIndex={0}
                          onClick={(e) => e.stopPropagation()} // Prevent header sort on icon click
                          onMouseEnter={(e) => {
                            const tip = e.currentTarget.querySelector(
                              ".header-tooltip-popover"
                            );
                            if (tip) tip.style.visibility = "visible";
                          }}
                          onMouseLeave={(e) => {
                            const tip = e.currentTarget.querySelector(
                              ".header-tooltip-popover"
                            );
                            if (tip) tip.style.visibility = "hidden";
                          }}
                        >
                          {/* show custom tooltip icon if provided, otherwise show default tooltip icon */}
                          {headerConfig?.tooltip ? (
                            headerConfig?.tooltip
                          ) : (
                            <Info
                              className="header-tooltip-icon"
                              style={{
                                color: "#fff",
                                transition: "color 0.2s",
                              }}
                              size={16}
                            />
                          )}

                          {/* tooltip bubble */}
                          <ToolTipBubble
                            tooltipText={headerConfig?.tooltipText || ""}
                          />
                        </div>
                      ) : null}
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
