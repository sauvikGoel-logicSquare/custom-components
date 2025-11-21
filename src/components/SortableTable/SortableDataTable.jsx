import { useState, useMemo, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import TableHeader from "../TableHeader";
import TableBody from "../TableBody";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Columns } from "lucide-react";
import { Button } from "@/components/ui/button";
import PaginationComponent from "../PaginationComponent";
import "../DataTable.css";

/**
 * SortableDataTable Component
 * A reusable sortable table component with drag-and-drop row reordering
 * Extends DataTable functionality with row reordering capability
 *
 * @param {Array} data - Array of objects where values can be JSX elements
 * @param {Array} headerData - Array of header configurations
 * @param {Function} onRowReorder - Optional callback when rows are reordered
 *   Receives (newDataArray) as parameter with reordered data
 * @param {Array} selectedIds - IDs of currently selected rows
 * @param {Function} onSelection - Function to handle row selection
 * @param {boolean} showSelectionCheckbox - Whether to show selection checkboxes
 * @param {string} selectedRowClassName - Optional custom CSS class for selected rows
 * @param {string} size - Table size variant ("small", "medium", "large")
 * @param {boolean} showPagination - Whether to show pagination
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {number} pageSize - Number of items per page
 * @param {number} totalItems - Total number of items
 * @param {Function} onPageChange - Callback for page changes
 * @param {Function} onPageSizeChange - Callback for page size changes
 * @param {Array} pageSizeOptions - Options for page size selector
 * @param {Array} showColumnsList - Array of column IDs that can be shown/hidden
 */
function SortableDataTable({
  data,
  headerData,
  onRowReorder = null,
  selectedIds = [],
  onSelection = null,
  showSelectionCheckbox = false,
  selectedRowClassName = "",
  size = "medium",
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showColumnsList = [],
}) {
  // Local state for reordered data
  const [reorderedData, setReorderedData] = useState(data);

  // Update local state when data prop changes
  useEffect(() => {
    setReorderedData(data);
  }, [data]);

  // Initialize columnVisibility with all columns in showColumnsList hidden by default
  const [columnVisibility, setColumnVisibility] = useState(() => {
    const initialVisibility = {};
    showColumnsList?.forEach((columnId) => {
      initialVisibility[columnId] = false;
    });
    return initialVisibility;
  });

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Handle drag end event
   * Reorders the data array when a row is dropped
   */
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setReorderedData((items) => {
        const oldIndex = items.findIndex(
          (item) => String(item.id) === String(active.id)
        );
        const newIndex = items.findIndex(
          (item) => String(item.id) === String(over.id)
        );

        const newData = arrayMove(items, oldIndex, newIndex);

        // Call callback if provided
        if (onRowReorder) {
          onRowReorder(newData);
        }

        return newData;
      });
    }
  };

  /**
   * Generate columns from headerData array
   */
  const tableColumns = useMemo(() => {
    const regularColumns = headerData
      ? headerData.map((header) => {
          const accessorKey = header.accessorKey;
          return {
            accessorKey: accessorKey,
            id: accessorKey,
            header: header.label,
            cell: (info) => info.getValue(),
          };
        })
      : [];

    // Drag handle column (always first)
    const dragHandleColumn = {
      id: "drag-handle",
      header: () => <span style={{ display: "none" }}></span>, // Empty header for drag handle
      cell: () => null, // Cell content is handled in TableBody
    };

    // Checkbox column for row selection
    const checkboxColumn = {
      id: "select",
      header: () => {
        const currentPageIds = reorderedData
          .map((row) => row.id)
          .filter(Boolean);
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
                onSelection();
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
                onSelection(rowId);
              }
            }}
          />
        );
      },
    };

    // Build columns array: drag handle first, then checkbox (if enabled), then regular columns
    const columns = [dragHandleColumn];
    if (showSelectionCheckbox) {
      columns.push(checkboxColumn);
    }
    columns.push(...regularColumns);
    return columns;
  }, [
    headerData,
    reorderedData,
    selectedIds,
    onSelection,
    showSelectionCheckbox,
  ]);

  /**
   * Create TanStack Table instance
   */
  const table = useReactTable({
    data: reorderedData,
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

  // Get all columns except the checkbox column for visibility dropdown
  const showHideColumnsList =
    table?.getAllColumns()?.filter((column) => {
      return column?.id !== "select" && showColumnsList?.includes(column?.id);
    }) || [];

  // Create a map for quick lookup of header labels by column id
  const headerLabelMap = {};
  if (headerData && headerData.length > 0) {
    headerData.forEach((header) => {
      headerLabelMap[header.accessorKey] = header.label;
    });
  }

  // Get row IDs for sortable context
  const rowIds = reorderedData.map((row) => String(row.id)).filter(Boolean);

  return (
    <div className={`data-table-wrapper data-table-wrapper-${size}`}>
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
          <DropdownMenuContent
            align="end"
            className="column-dropdown-content"
            sideOffset={8}
            style={{ zIndex: 1000 }}
          >
            <DropdownMenuLabel>Show/Hide Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {showHideColumnsList?.map((column) => {
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
      <div className={`data-table-container data-table-container-${size}`}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={rowIds}
            strategy={verticalListSortingStrategy}
          >
            <table className={`data-table data-table-${size}`}>
              <TableHeader table={table} headerData={headerData} />
              <TableBody
                table={table}
                selectedIds={selectedIds}
                selectedRowClassName={selectedRowClassName}
                isSortable={true}
              />
            </table>
          </SortableContext>
        </DndContext>

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
    </div>
  );
}

export default SortableDataTable;
