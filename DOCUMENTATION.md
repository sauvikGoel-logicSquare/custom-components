# TanStack React Table - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Workflow](#architecture--workflow)
3. [Data Structures](#data-structures)
4. [API Integration](#api-integration)
5. [Component Structure](#component-structure)
6. [Usage Guide](#usage-guide)
7. [Data Flow Diagram](#data-flow-diagram)

---

## Project Overview

This is a React-based data table application built with **TanStack React Table** (formerly React Table). It provides a fully-featured table component with:

- **Pagination**: Server-side pagination support
- **Row Selection**: Multi-select with checkboxes
- **Sorting & Filtering**: UI ready (handlers can be implemented)
- **Column Visibility**: Show/hide columns dynamically
- **Row Click Actions**: Click on row name to view details in modal
- **Responsive Design**: Modern, clean UI
- **Status Management**: Inline status dropdown per row
- **Action Buttons**: Edit, Delete, and More actions per row

---

## Architecture & Workflow

### High-Level Flow

```
User Interaction
    ↓
App.jsx (Main Component)
    ↓
DataTable.jsx (Table Container)
    ↓
├── TableHeader.jsx (Header Row)
├── TableBody.jsx (Data Rows)
└── PaginationComponent.jsx (Pagination Controls)
    ↓
Modal.jsx (Row Details Modal)
```

### Detailed Workflow

1. **Initial Load**

   - `App.jsx` mounts and triggers `useEffect`
   - Fetches data from API with pagination parameters
   - Transforms API response to table format
   - Passes data to `DataTable` component

2. **Data Rendering**

   - `DataTable` receives data and header configuration
   - Creates TanStack Table instance with columns
   - Renders `TableHeader` and `TableBody` components
   - Displays pagination controls

3. **User Interactions**

   - **Row Selection**: Checkbox click → Updates `selectedIds` state → Re-renders checkboxes
   - **Row Click**: Name cell click → Opens modal with row details
   - **Pagination**: Page change → Fetches new data → Updates table
   - **Column Visibility**: Toggle columns → Updates visibility state → Re-renders table

4. **Modal Display**
   - Row click triggers `handleRowClick`
   - Sets `selectedRowData` and opens modal
   - Modal displays row information (can include nested tables)

---

## Data Structures

### 1. API Request Structure

#### Endpoint

```
POST https://api-dev.smoothire.com/api/v1/candidates
```

#### Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

#### Request Body

```json
{
  "page": 1,
  "limit": 10,
  "isCvAvailable": true
}
```

**Field Descriptions:**

- `page` (number, required): Current page number (1-indexed)
- `limit` (number, required): Number of items per page (e.g., 10, 20, 50, 100)
- `isCvAvailable` (boolean, optional): Filter for candidates with CV available

---

### 2. API Response Structure

The API can return data in multiple formats. The application handles all of them:

#### Format 1: Direct Array

```json
[
  {
    "_id": "candidate123",
    "name": "John Doe",
    "phones": ["+91-9876543210"],
    "emails": ["john@example.com"],
    ...
  }
]
```

#### Format 2: Nested Structure (result.result.docs)

```json
{
  "result": {
    "docs": [
      {
        "_id": "candidate123",
        "name": "John Doe",
        ...
      }
    ],
    "totalDocs": 150,
    "total": 150
  }
}
```

#### Format 3: Data Property

```json
{
  "data": [
    {
      "_id": "candidate123",
      "name": "John Doe",
      ...
    }
  ],
  "total": 150,
  "count": 150
}
```

#### Format 4: Results Property

```json
{
  "results": [
    {
      "_id": "candidate123",
      "name": "John Doe",
      ...
    }
  ],
  "total": 150,
  "count": 150
}
```

---

### 3. Candidate Object Structure (API Response)

This is the expected structure of a single candidate object from the API:

```json
{
  "_id": "candidate123",
  "id": "candidate123",

  // Name - Can be string or object
  "name": "John Doe",
  // OR
  "name": {
    "full": "John Doe",
    "first": "John",
    "last": "Doe"
  },
  // OR alternative fields
  "fullName": "John Doe",
  "candidateName": "John Doe",
  "firstName": "John",
  "lastName": "Doe",

  // Contact Information
  "phones": ["+91-9876543210", "+91-9876543211"],
  "emails": ["john@example.com", "john.doe@example.com"],

  // Employment History (Array)
  "employmentHistory": [
    {
      "designation": "Senior Software Engineer",
      "company": "Tech Corp",
      "noticePeriodInDays": 30
    }
  ],

  // Job Function
  "elasticSearchKeywords": {
    "jobFunctionName": "Engineering"
  },

  // Experience
  "computedMonthsOfExperience": 60,

  // Salary Information
  "currentOrLastCtc": 1500000,
  "expectedSalary": 1800000,

  // Location - Can be string or object
  "currentLocation": "Mumbai, Maharashtra",
  // OR
  "currentLocation": {
    "city": "Mumbai",
    "state": "Maharashtra",
    "zone": "West"
  },
  // OR alternative fields
  "location": {
    "city": "Mumbai",
    "state": "Maharashtra"
  },
  "city": "Mumbai",

  // Timestamps
  "lastUpdated": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "modifiedAt": "2024-01-15T10:30:00Z",
  "createdAt": "2024-01-10T08:00:00Z",

  // Applications
  "applications": 5,
  "applicationCount": 5,
  "totalApplications": 5,

  // Status
  "status": "Active",
  "applicationStatus": "Active"
}
```

---

### 4. Table Data Structure (Transformed Data)

After transformation, each row in the table has this structure:

```javascript
{
  // Required: Unique identifier for row selection
  id: "candidate123",

  // Column Data (values can be JSX elements)
  name: <JSX.Element>, // Name with phone/email icons
  designation: <JSX.Element>, // Designation text
  currentCompany: <JSX.Element>, // Company name
  jobFunction: <JSX.Element>, // Job function
  experience: <JSX.Element>, // Experience in months
  ctc: <JSX.Element>, // Current CTC (formatted currency)
  ectc: <JSX.Element>, // Expected CTC (formatted currency)
  noticePeriod: <JSX.Element>, // Notice period or "Immediate"
  currentLocation: <JSX.Element>, // Location text
  lastUpdated: <JSX.Element>, // Formatted date
  applications: <JSX.Element>, // Number of applications
  status: <JSX.Element>, // Status dropdown component
  actions: <JSX.Element>, // Action buttons (Edit, Delete, More)

  // Metadata
  isClickable: true, // Whether name cell is clickable
  originalData: { /* Original candidate object */ } // Full API response data
}
```

**Example Transformed Row:**

```javascript
{
  id: "candidate123",
  name: (
    <div>
      <span style={{ color: "#667eea", fontWeight: "600" }}>John Doe</span>
      <div>
        <Phone size={14} /> {/* Tooltip shows phone */}
        <Mail size={14} /> {/* Tooltip shows email */}
      </div>
    </div>
  ),
  designation: <span style={{ color: "#475569" }}>Senior Software Engineer</span>,
  currentCompany: <span style={{ color: "#475569" }}>Tech Corp</span>,
  jobFunction: <span style={{ color: "#475569" }}>Engineering</span>,
  experience: <span style={{ color: "#475569" }}>60 Months</span>,
  ctc: <span style={{ color: "#475569" }}>₹15,00,000</span>,
  ectc: <span style={{ color: "#475569" }}>₹18,00,000</span>,
  noticePeriod: <span style={{ color: "#475569" }}>30</span>,
  currentLocation: <span style={{ color: "#475569" }}>Mumbai, Maharashtra</span>,
  lastUpdated: <span style={{ color: "#475569" }}>1/15/2024</span>,
  applications: <span style={{ color: "#475569" }}>5</span>,
  status: <Select>...</Select>, // Status dropdown
  actions: <div>...</div>, // Edit, Delete, More buttons
  isClickable: true,
  originalData: { /* Full candidate object */ }
}
```

---

### 5. Header Data Structure

The `headerData` array defines table columns. Each header object has:

```javascript
{
  accessorKey: "name", // REQUIRED: Must match key in data object
  label: "Name", // REQUIRED: Display text in header
  tooltip: <Info className="header-tooltip-icon" />, // Optional: JSX icon element
  tooltipText: "Candidate name", // Optional: Tooltip text on hover
  icons: [ // Optional: Array of JSX icon elements
    <ArrowUpDown
      className="header-action-icon-svg"
      onClick={() => console.log("Sort by name")}
    />,
    <Filter
      className="header-action-icon-svg"
      onClick={() => console.log("Filter name")}
    />
  ]
}
```

**Complete Header Data Example:**

```javascript
const headerData = [
  {
    accessorKey: "name",
    label: "Name",
    tooltip: <Info className="header-tooltip-icon" />,
    tooltipText: "Candidate name",
    icons: [
      <ArrowUpDown onClick={() => console.log("Sort by name")} />,
      <Filter onClick={() => console.log("Filter name")} />,
    ],
  },
  {
    accessorKey: "designation",
    label: "Designation",
    tooltip: <Info className="header-tooltip-icon" />,
    tooltipText: "Current job designation",
    icons: [
      <ArrowUpDown onClick={() => console.log("Sort by designation")} />,
      <Filter onClick={() => console.log("Filter designation")} />,
    ],
  },
  {
    accessorKey: "actions",
    label: "Actions",
    // No tooltip or icons for actions column
  },
];
```

**Important Notes:**

- `accessorKey` **MUST** match the key in your data object
- `label` is just for display and can be different from `accessorKey`
- The checkbox column is automatically added (id: "select") - don't include it in `headerData`
- Order of headers in array determines column order in table

---

### 6. Selection State Structure

Row selection uses a simple array of IDs:

```javascript
// State
const [selectedIds, setSelectedIds] = useState([]);

// Example values
selectedIds = ["candidate123", "candidate456", "candidate789"];
```

**Selection Logic:**

- Single row toggle: Add/remove ID from array
- Select all: Add all current page IDs to array
- Deselect all: Remove all current page IDs from array

---

### 7. Pagination State Structure

```javascript
{
  currentPage: 1, // Current page number (1-indexed)
  pageSize: 10, // Items per page
  totalItems: 150, // Total number of items
  totalPages: 15 // Total number of pages (calculated: Math.ceil(totalItems / pageSize))
}
```

---

### 8. Modal Data Structure

```javascript
{
  isOpen: true, // Boolean: Whether modal is open
  rowData: { /* Transformed row data object */ }, // The row data to display
  nestedTableData: [ /* Optional: Array of nested table rows */ ],
  nestedTableHeaderData: [ /* Optional: Header config for nested table */ ]
}
```

---

## API Integration

### Fetching Data

The application fetches data in `App.jsx` using `useEffect`:

```javascript
useEffect(() => {
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = "https://api-dev.smoothire.com/api/v1/candidates";
      const requestBody = {
        page: currentPage,
        limit: pageSize,
        isCvAvailable: true,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer <JWT_TOKEN>",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // Handle response (see Data Transformation section)
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchCandidates();
}, [currentPage, pageSize]);
```

### Response Handling

The application handles multiple response formats:

```javascript
let candidates = [];
let total = 0;

if (Array.isArray(result)) {
  // Format 1: Direct array
  candidates = result;
  total = result.length;
} else if (result.result?.result?.docs && Array.isArray(result.result.docs)) {
  // Format 2: result.result.docs
  candidates = result.result.docs;
  total =
    result.result.totalDocs || result.result.total || result.result.docs.length;
} else if (result.data && Array.isArray(result.data)) {
  // Format 3: data property
  candidates = result.data;
  total = result.total || result.count || result.data.length;
} else if (result.results && Array.isArray(result.results)) {
  // Format 4: results property
  candidates = result.results;
  total = result.total || result.count || result.results.length;
} else {
  throw new Error("Unexpected API response structure");
}
```

---

## Component Structure

### 1. App.jsx (Main Component)

**Responsibilities:**

- API data fetching
- State management (pagination, selection, modal)
- Data transformation
- Event handlers

**Key State:**

- `candidatesData`: Raw API response data
- `currentPage`, `pageSize`, `totalItems`, `totalPages`: Pagination state
- `selectedIds`: Array of selected row IDs
- `isModalOpen`, `selectedRowData`: Modal state

**Key Functions:**

- `fetchCandidates()`: Fetches data from API
- `transformCandidateData()`: Converts API data to table format
- `handleRowClick()`: Opens modal with row data
- `handleSelection()`: Manages row selection
- `handlePageChange()`: Updates current page
- `handlePageSizeChange()`: Updates page size

---

### 2. DataTable.jsx (Table Container)

**Responsibilities:**

- Creates TanStack Table instance
- Manages column definitions
- Handles column visibility
- Renders table structure

**Props:**

```javascript
{
  data: Array, // Transformed table data
  headerData: Array, // Header configuration
  onRowClick: Function, // Callback when row is clicked
  selectedRowId: string|number, // Currently selected row ID
  showPagination: boolean, // Show pagination controls
  currentPage: number, // Current page number
  totalPages: number, // Total pages
  pageSize: number, // Items per page
  totalItems: number, // Total items
  onPageChange: Function, // Page change callback
  onPageSizeChange: Function, // Page size change callback
  pageSizeOptions: Array, // Available page sizes
  selectedIds: Array, // Selected row IDs
  onSelection: Function // Selection change callback
}
```

**Key Features:**

- Automatically adds checkbox column
- Generates columns from `headerData`
- Manages column visibility state
- Provides "Show Columns" dropdown

---

### 3. TableHeader.jsx

**Responsibilities:**

- Renders table header row
- Displays header labels, tooltips, and action icons
- Renders select-all checkbox

**Props:**

```javascript
{
  table: Object, // TanStack Table instance
  headerData: Array // Header configuration
}
```

---

### 4. TableBody.jsx

**Responsibilities:**

- Renders table body rows
- Handles row click events
- Renders individual row checkboxes
- Applies selected row styling

**Props:**

```javascript
{
  table: Object, // TanStack Table instance
  onRowClick: Function, // Row click callback
  selectedRowId: string|number // Selected row ID
}
```

---

### 5. PaginationComponent.jsx

**Responsibilities:**

- Displays pagination controls
- Shows page numbers with ellipsis
- Provides page size selector
- Displays item count information

**Props:**

```javascript
{
  currentPage: number,
  totalPages: number,
  pageSize: number,
  totalItems: number,
  onPageChange: Function,
  onPageSizeChange: Function,
  pageSizeOptions: Array
}
```

---

### 6. Modal.jsx

**Responsibilities:**

- Displays row details in modal overlay
- Supports nested tables
- Handles modal close

**Props:**

```javascript
{
  isOpen: boolean,
  onClose: Function,
  rowData: Object,
  nestedTableData: Array, // Optional
  nestedTableHeaderData: Array // Optional
}
```

---

## Usage Guide

### Basic Setup

1. **Install Dependencies**

```bash
npm install
```

2. **Configure API**

   - Update API endpoint in `App.jsx` (line 86)
   - Update Authorization token (line 100)

3. **Run Development Server**

```bash
npm run dev
```

### Customizing Table Data

#### Step 1: Update API Endpoint

```javascript
const apiUrl = "https://your-api.com/endpoint";
```

#### Step 2: Update Request Body

```javascript
const requestBody = {
  page: currentPage,
  limit: pageSize,
  // Add your custom filters
  customFilter: "value",
};
```

#### Step 3: Update Data Transformation

Modify `transformCandidateData()` function in `App.jsx` to match your API response structure:

```javascript
const transformCandidateData = (candidates) => {
  return candidates.map((candidate) => {
    return {
      id: candidate._id || candidate.id,
      // Map your fields
      name: candidate.name,
      // ... other fields
    };
  });
};
```

#### Step 4: Update Header Configuration

Update `headerData` array in `App.jsx` to match your columns:

```javascript
const headerData = [
  {
    accessorKey: "name",
    label: "Name",
    tooltip: <Info />,
    tooltipText: "Name tooltip",
    icons: [
      /* your icons */
    ],
  },
  // Add more columns
];
```

### Adding Custom Actions

#### Row Actions

Modify `createActions()` function in `App.jsx`:

```javascript
const createActions = (rowData, rowName) => {
  return (
    <div>
      <Edit onClick={() => handleEdit(rowData)} />
      <Trash2 onClick={() => handleDelete(rowData)} />
      {/* Add more actions */}
    </div>
  );
};
```

#### Status Update

Modify status dropdown `onValueChange` handler:

```javascript
<Select
  defaultValue={status}
  onValueChange={(value) => {
    updateCandidateStatus(candidate._id, value);
  }}
>
  {/* Options */}
</Select>
```

### Implementing Sorting

Add sorting logic to header icon click handlers:

```javascript
{
  accessorKey: "name",
  label: "Name",
  icons: [
    <ArrowUpDown
      onClick={() => {
        setSortBy("name");
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        // Fetch sorted data
      }}
    />
  ]
}
```

### Implementing Filtering

Add filter logic to header icon click handlers:

```javascript
{
  accessorKey: "name",
  label: "Name",
  icons: [
    <Filter
      onClick={() => {
        setShowFilter(true);
        setFilterColumn("name");
        // Show filter modal/input
      }}
    />
  ]
}
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Action                          │
│  (Click, Pagination, Selection, etc.)                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                      App.jsx                                │
│  • State Management                                         │
│  • Event Handlers                                          │
│  • API Calls                                               │
└───────┬─────────────────────────────────────────────────────┘
        │
        ├─────────────────┐
        │                 │
        ▼                 ▼
┌──────────────┐  ┌──────────────────┐
│   API Call   │  │  State Update    │
│  (useEffect) │  │  (setState)      │
└──────┬───────┘  └────────┬──────────┘
       │                  │
       │                  │
       ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Data Transformation                            │
│  transformCandidateData(candidates)                        │
│  • Maps API fields to table columns                        │
│  • Formats values (currency, dates)                        │
│  • Creates JSX elements for cells                          │
└───────┬─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│                    DataTable.jsx                           │
│  • Creates TanStack Table instance                         │
│  • Generates columns from headerData                       │
│  • Manages column visibility                               │
└───────┬─────────────────────────────────────────────────────┘
        │
        ├──────────────────┬──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐
│ TableHeader  │  │  TableBody   │  │ PaginationComponent  │
│  • Headers   │  │  • Rows      │  │  • Page controls     │
│  • Tooltips  │  │  • Cells     │  │  • Page size         │
│  • Icons     │  │  • Checkboxes│  │  • Item count        │
└──────────────┘  └──────┬───────┘  └──────────────────────┘
                         │
                         │ (Row Click)
                         ▼
                 ┌──────────────┐
                 │   Modal.jsx  │
                 │  • Details   │
                 │  • Nested    │
                 │    Tables    │
                 └──────────────┘
```

---

## Key Concepts

### 1. AccessorKey vs Label

- **`accessorKey`**: Must match the key in your data object
  - Example: If data is `{ name: "John" }`, then `accessorKey: "name"`
- **`label`**: Just for display, can be anything
  - Example: `label: "Full Name"` (even if `accessorKey` is "name")

### 2. Row Selection

- Selection is managed by an array of IDs: `selectedIds = ["id1", "id2"]`
- Checkbox column is automatically added (id: "select")
- Selection persists across page changes (uses actual IDs, not indices)

### 3. Data Transformation

- API data is transformed to include JSX elements
- Each cell can contain React components (Select, Buttons, Icons, etc.)
- Original data is preserved in `originalData` field

### 4. Pagination

- Server-side pagination (data fetched per page)
- Page size can be changed (10, 20, 50, 100)
- Total pages calculated from `totalItems / pageSize`

### 5. Modal System

- Click on row name (if `isClickable: true`) opens modal
- Modal receives `rowData` (transformed data)
- Can display nested tables with `nestedTableData` and `nestedTableHeaderData`

---

## Environment Variables (Recommended)

For production, move API configuration to environment variables:

```env
VITE_API_URL=https://api-dev.smoothire.com/api/v1
VITE_API_TOKEN=your_jwt_token_here
```

Then use in code:

```javascript
const apiUrl = `${import.meta.env.VITE_API_URL}/candidates`;
const token = import.meta.env.VITE_API_TOKEN;
```

---

## Error Handling

The application handles:

- HTTP errors (non-200 responses)
- Network errors
- Unexpected API response structures
- Missing data fields (uses fallback values)

Error messages are displayed to the user in the UI.

---

## Performance Considerations

1. **Pagination**: Only loads current page data (reduces memory usage)
2. **Memoization**: Columns are memoized with `useMemo`
3. **Efficient Rendering**: TanStack Table optimizes re-renders
4. **Lazy Loading**: Modal only renders when open

---

## Troubleshooting

### Table Not Displaying Data

- Check API response structure matches expected formats
- Verify `accessorKey` matches data object keys
- Check browser console for errors

### Selection Not Working

- Ensure each row has a unique `id` field
- Verify `selectedIds` state is being updated
- Check `onSelection` callback is provided

### Pagination Not Working

- Verify `totalItems` is set correctly
- Check `onPageChange` callback updates `currentPage`
- Ensure API returns correct total count

### Modal Not Opening

- Check `isClickable: true` in row data
- Verify `onRowClick` callback is provided
- Ensure row name cell is clickable (not disabled)

---

## Future Enhancements

Potential improvements:

- [ ] Server-side sorting
- [ ] Server-side filtering
- [ ] Export to CSV/Excel
- [ ] Column resizing
- [ ] Column reordering
- [ ] Advanced search
- [ ] Bulk actions on selected rows
- [ ] Row grouping
- [ ] Virtual scrolling for large datasets

---

## Support

For issues or questions:

1. Check browser console for errors
2. Verify API response structure
3. Review data transformation logic
4. Check TanStack Table documentation: https://tanstack.com/table

---

**Last Updated**: January 2024
**Version**: 1.0.0
