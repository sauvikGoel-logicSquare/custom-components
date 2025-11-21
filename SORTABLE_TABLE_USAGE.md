# SortableDataTable Component Usage

A new table component `SortableDataTable` has been created that extends the existing `DataTable` functionality with drag-and-drop row reordering capability.

## Features

- ✅ All existing DataTable features (pagination, selection, column visibility, etc.)
- ✅ Drag-and-drop row reordering using `@dnd-kit` package
- ✅ Visual drag handle column on the left
- ✅ Smooth animations during drag
- ✅ Optional callback when rows are reordered

## Installation

The required packages have already been installed:
- `@dnd-kit/core`
- `@dnd-kit/sortable`
- `@dnd-kit/utilities`

## Usage

Import and use `SortableDataTable` exactly like `DataTable`, with one additional optional prop:

```jsx
import SortableDataTable from "./components/SortableDataTable";

function App() {
  const [data, setData] = useState(tableData);

  // Optional: Handle reordering
  const handleRowReorder = (newDataArray) => {
    console.log("Rows reordered:", newDataArray);
    // Update your data source if needed
    setData(newDataArray);
  };

  return (
    <SortableDataTable
      data={data}
      headerData={headerData}
      onRowReorder={handleRowReorder} // Optional callback
      // ... all other DataTable props work the same
      showSelectionCheckbox={true}
      selectedIds={selectedIds}
      onSelection={handleSelection}
      showPagination={true}
      currentPage={currentPage}
      totalPages={totalPages}
      pageSize={pageSize}
      totalItems={totalItems}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      pageSizeOptions={[10, 20, 50, 100]}
      showColumnsList={["designation", "currentCompany"]}
      size="large"
      selectedRowClassName="bg-red-500"
    />
  );
}
```

## Props

All props from `DataTable` are supported, plus:

- `onRowReorder` (optional): Callback function that receives the reordered data array when rows are rearranged
  - Function signature: `(newDataArray) => void`
  - Called after a successful drag-and-drop operation

## How It Works

1. Each row has a drag handle (grip icon) in the first column
2. Click and drag the handle to reorder rows
3. The table maintains all existing functionality (selection, pagination, etc.)
4. The `onRowReorder` callback is called with the new data order after a successful reorder

## Notes

- The drag handle column is automatically added as the first column
- Existing `DataTable` component remains unchanged and unaffected
- All existing methodologies and features are preserved

