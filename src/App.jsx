import { useState, useEffect } from "react";
import DataTable from "./components/DataTable";
import Modal from "./components/Modal";
import {
  ArrowUpDown,
  Filter,
  Info,
  Edit,
  Trash2,
  MoreVertical,
  Phone,
  Mail,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import "./App.css";

function App() {
  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  // API data and pagination state
  const [candidatesData, setCandidatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Simple selection state - just an array of selected candidate IDs
  const [selectedIds, setSelectedIds] = useState([]);

  /**
   * Handle row click from DataTable
   * Opens modal with row data
   */
  const handleRowClick = (rowData, rowId) => {
    console.log({ rowData, rowId });
    setSelectedRowData(rowData);
    setIsModalOpen(true);
  };

  /**
   * Handle modal close
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Optionally clear selection when modal closes
    // setSelectedRowId(null);
  };

  /**
   * Fetch candidates data from API
   */
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        setError(null);

        // API endpoint
        const apiUrl = "https://api-dev.smoothire.com/api/v1/candidates";

        // Request body with pagination parameters
        const requestBody = {
          page: currentPage,
          limit: pageSize,
          isCvAvailable: true,
        };

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMzI3YWNiNmFiYTYwMTA5NzhiZDFiMiIsIl9pZCI6IjVmMzI3YWNiNmFiYTYwMTA5NzhiZDFiMiIsImZ1bGxOYW1lIjoiQWxleCBTaHJtYSIsImVtYWlsIjoiYWJoaXNoZWsuc2hhcm1hK2FsZXhAbG9naWMtc3F1YXJlLmNvbSIsInBob25lIjoiNzg0Nzg2MzQ3NSIsIm9yZ2FuaXphdGlvbklkIjoiNWYzMjdhY2I2YWJhNjAxMDk3OGJkMmIwIiwib3JnYW5pemF0aW9uQ2F0ZWdvcnkiOiJhZ2VuY3kiLCJyb2xlIjoiYWRtaW4iLCJwcm9maWxlUGljVXJsIjoiaHR0cHM6Ly9zbW9vdGhpcmUtZGV2LnMzLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tL291dHB1dC1vbmxpbmVwbmd0b29scy5wbmciLCJpc1JlY3J1aXRlck1hbmFnZXIiOmZhbHNlLCJpc1Nlbmlvck1hbmFnZXIiOmZhbHNlLCJkZXZpY2VJZCI6IjI2ZTQwYTlhLTU5NGMtNDIwOS04MGY3LTJhNDIwNjZiZGMwZSIsImNvdW50cnlDb2RlIjoiKzkxIiwiY3VycmVuY3kiOiJJTlIiLCJjb3VudHJ5TmFtZSI6IklOIiwiaWF0IjoxNzYyODM5MjQ4LCJleHAiOjE3NjU0MzEyNDh9.1ligbM52L0T3rdqia038jXL8Ubcb7hm60knkNHC2fXE",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Handle different possible response structures
        let candidates = [];
        let total = 0;

        if (Array.isArray(result)) {
          // If response is directly an array
          candidates = result;
          total = result.length;
        } else if (
          result.result &&
          result.result.docs &&
          Array.isArray(result.result.docs)
        ) {
          // If response has result.result.docs structure
          candidates = result.result.docs;
          total =
            result.result.totalDocs ||
            result.result.total ||
            result.result.docs.length;
        } else if (result.data && Array.isArray(result.data)) {
          // If response has a data property with array
          candidates = result.data;
          total = result.total || result.count || result.data.length;
        } else if (result.results && Array.isArray(result.results)) {
          // If response has a results property
          candidates = result.results;
          total = result.total || result.count || result.results.length;
        } else {
          throw new Error("Unexpected API response structure");
        }

        setCandidatesData(candidates);
        setTotalItems(total);
        setTotalPages(Math.ceil(total / pageSize));
      } catch (err) {
        console.error("Error fetching candidates:", err);
        setError(err.message);
        setCandidatesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [currentPage, pageSize]);

  /**
   * Handle page change
   */
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  /**
   * Handle page size change
   */
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  /**
   * Helper function to create actions JSX with dropdown menu
   * @param {Object} rowData - The row data object
   * @param {string} rowName - The name identifier for the row
   */
  const createActions = (
    rowData,
    rowName,
    isEditEnabled = false,
    isDeleteEnabled = false,
    onEdit = () => {},
    onDelete = () => {}
  ) => {
    return (
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {isEditEnabled && (
          <Edit
            className="body-action-icon"
            onClick={() => onEdit(rowData)}
            size={16}
          />
        )}
        {isDeleteEnabled && (
          <Trash2
            className="body-action-icon"
            style={{ color: "#ef4444" }}
            onClick={() => onDelete(rowData)}
            size={16}
          />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="body-action-icon" size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                console.log("Details Page for:", {
                  name: rowName,
                  data: rowData,
                });
                // Add your details page navigation logic here
              }}
            >
              Details Page
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log("View:", {
                  name: rowName,
                  data: rowData,
                });
                // Add your view logic here
              }}
            >
              View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  /**
   * Transform API candidate data to table format
   * Maps API response fields to table columns
   */
  const transformCandidateData = (candidates) => {
    // Helper function to extract name from string or object
    const extractName = (nameValue) => {
      if (!nameValue) return null;
      if (typeof nameValue === "string") return nameValue;
      if (typeof nameValue === "object") {
        return nameValue.full || nameValue.first || nameValue.last || null;
      }
      return null;
    };

    // Helper function to extract location from string or object
    const extractLocation = (locationValue) => {
      if (!locationValue) return null;
      if (typeof locationValue === "string") return locationValue;
      if (typeof locationValue === "object") {
        const parts = [];
        if (locationValue.city) parts.push(locationValue.city);
        if (locationValue.state) parts.push(locationValue.state);
        if (locationValue.zone) parts.push(locationValue.zone);
        return parts.length > 0 ? parts.join(", ") : null;
      }
      return null;
    };

    return candidates.map((candidate) => {
      // Extract data from candidate object
      // Adjust field names based on actual API response structure
      const name =
        extractName(candidate.name) ||
        candidate.fullName ||
        candidate.candidateName ||
        (candidate.firstName
          ? `${candidate.firstName} ${candidate.lastName || ""}`.trim()
          : null) ||
        "N/A";
      const phone = candidate.phones[0] || null;
      const email = candidate.emails[0] || null;
      const designation = candidate.employmentHistory[0].designation || "N/A";
      const currentCompany = candidate.employmentHistory[0].company || "N/A";
      const jobFunction =
        candidate.elasticSearchKeywords.jobFunctionName || "N/A";
      const experience = candidate.computedMonthsOfExperience || "N/A";
      const ctc = candidate.currentOrLastCtc || "N/A";
      const ectc = candidate.expectedSalary || "N/A";
      const noticePeriod =
        (candidate.employmentHistory[0].noticePeriodInDays > 1
          ? candidate.employmentHistory[0].noticePeriodInDays
          : "Immediate") || "N/A";
      const currentLocation =
        extractLocation(candidate.currentLocation) ||
        extractLocation(candidate.location) ||
        candidate.city ||
        "N/A";
      const lastUpdated =
        candidate.lastUpdated ||
        candidate.updatedAt ||
        candidate.modifiedAt ||
        candidate.createdAt ||
        "N/A";
      const applications =
        candidate.applications ||
        candidate.applicationCount ||
        candidate.totalApplications ||
        0;
      const status =
        candidate.status || candidate.applicationStatus || "Active";

      // Format date if it's a date string
      let formattedLastUpdated = lastUpdated;
      if (lastUpdated !== "N/A" && typeof lastUpdated === "string") {
        try {
          const date = new Date(lastUpdated);
          if (!isNaN(date.getTime())) {
            formattedLastUpdated = date.toLocaleDateString();
          }
        } catch {
          // Keep original value if parsing fails
        }
      }

      // Format currency values
      const formatCurrency = (value) => {
        if (value === "N/A" || !value) return "N/A";
        if (typeof value === "number") {
          return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(value);
        }
        return value;
      };

      // Get unique ID from candidate (try _id first, then id)
      const candidateId =
        candidate._id || candidate.id || `temp-${Math.random()}`;

      return {
        id: candidateId, // Unique identifier for row selection
        name: (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <span
              style={{ color: "#667eea", fontWeight: "600", cursor: "pointer" }}
              onClick={() => handleRowClick(candidate, candidateId)}
            >
              {name}
            </span>
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                marginTop: "2px",
              }}
            >
              {phone && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      style={{
                        position: "relative",
                        display: "inline-flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Phone
                        size={14}
                        style={{
                          color: "#64748b",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#667eea";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#64748b";
                        }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <a style={{ color: "#fff" }} href={`tel:${phone}`}>
                      {phone}
                    </a>
                  </TooltipContent>
                </Tooltip>
              )}
              {email && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      style={{
                        position: "relative",
                        display: "inline-flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Mail
                        size={14}
                        style={{
                          color: "#64748b",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#667eea";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#64748b";
                        }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <a style={{ color: "#fff" }} href={`mailto:${email}`}>
                      {email}
                    </a>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        ),
        designation: <span style={{ color: "#475569" }}>{designation}</span>,
        currentCompany: (
          <span style={{ color: "#475569" }}>{currentCompany}</span>
        ),
        jobFunction: <span style={{ color: "#475569" }}>{jobFunction}</span>,
        experience: (
          <span style={{ color: "#475569" }}>{experience} Months</span>
        ),
        ctc: <span style={{ color: "#475569" }}>{formatCurrency(ctc)}</span>,
        ectc: <span style={{ color: "#475569" }}>{formatCurrency(ectc)}</span>,
        noticePeriod: <span style={{ color: "#475569" }}>{noticePeriod}</span>,
        currentLocation: (
          <span style={{ color: "#475569" }}>{currentLocation}</span>
        ),
        lastUpdated: (
          <span style={{ color: "#475569" }}>{formattedLastUpdated}</span>
        ),
        applications: <span style={{ color: "#475569" }}>{applications}</span>,
        status: (
          <Select
            defaultValue={status}
            onValueChange={(value) => {
              console.log(
                `Status changed to ${value} for candidate:`,
                candidate
              );
              // Add your status update logic here (e.g., API call)
            }}
          >
            <SelectTrigger style={{ padding: "4px 8px", height: "auto" }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        ),
        isClickable: true, // sauvik: use of this ????
        actions: createActions(
          candidate,
          name,
          true,
          true,
          () => console.log(`Edit ${name}`, candidate), // sauvik: edit logic here
          () => console.log(`Delete ${name}`, candidate) // sauvik: delete logic here
        ),
        // Store original candidate data for modal/details
        originalData: candidate,
      };
    });
  };

  // Transform API data to table format
  const data = transformCandidateData(candidatesData);

  /**
   * Handle selection - works for both single selection and select all
   * @param {string|null} candidateId - If provided, toggle that candidate. If null/undefined, toggle all on current page
   */
  const handleSelection = (candidateId = null) => {
    if (candidateId) {
      // Toggle single candidate
      setSelectedIds((prev) => {
        if (prev.includes(candidateId)) {
          return prev.filter((id) => id !== candidateId);
        } else {
          return [...prev, candidateId];
        }
      });
    } else {
      // Toggle all on current page
      const currentPageIds = data.map((row) => row.id).filter(Boolean);
      const allSelected =
        currentPageIds.length > 0 &&
        currentPageIds.every((id) => selectedIds.includes(id));

      if (allSelected) {
        // Deselect all on current page
        setSelectedIds((prev) =>
          prev.filter((id) => !currentPageIds.includes(id))
        );
      } else {
        // Select all on current page
        setSelectedIds((prev) => {
          const newIds = [...prev];
          currentPageIds.forEach((id) => {
            if (!newIds.includes(id)) {
              newIds.push(id);
            }
          });
          return newIds;
        });
      }
    }
  };

  /**
   * Header Data Array
   * Defines the table headers with labels, tooltips, and action icons.
   * Headers: Name, Designation, Current Company, Job Function, Exp., CTC, ECTC, Notice Period, Current Location, Last Updated, Applications, Status
   */
  const headerData = [
    {
      accessorKey: "name",
      label: "Name",
      tooltipText: "Candidate name",
      // icons for sorting and filtering
      icons: [
        <ArrowUpDown
          key="sort"
          className="header-action-icon-svg"
          onClick={() => console.log("Sort by name")}
        />,
        <Filter
          key="filter"
          className="header-action-icon-svg"
          onClick={() => console.log("Filter name")}
        />,
      ],
    },
    {
      accessorKey: "designation",
      label: "Designation",
      tooltipText: "Current job designation",
      // icons for sorting and filtering
      icons: [
        <ArrowUpDown
          key="sort"
          className="header-action-icon-svg"
          onClick={() => console.log("Sort by designation")}
        />,
        <Filter
          key="filter"
          className="header-action-icon-svg"
          onClick={() => console.log("Filter designation")}
        />,
      ],
    },
    {
      accessorKey: "currentCompany",
      label: "Current Company",
      tooltipText: "Current employer",
      // icons for sorting and filtering
      icons: [
        <ArrowUpDown
          key="sort"
          className="header-action-icon-svg"
          onClick={() => console.log("Sort by company")}
        />,
        <Filter
          key="filter"
          className="header-action-icon-svg"
          onClick={() => console.log("Filter company")}
        />,
      ],
    },
    {
      accessorKey: "jobFunction",
      label: "Job Function",
      tooltipText: "Job function or department",
      // icons for sorting and filtering
      icons: [
        <ArrowUpDown
          key="sort"
          className="header-action-icon-svg"
          onClick={() => console.log("Sort by job function")}
        />,
        <Filter
          key="filter"
          className="header-action-icon-svg"
          onClick={() => console.log("Filter job function")}
        />,
      ],
    },
    {
      accessorKey: "experience",
      label: "Exp.",
      tooltipText: "Years of experience",
      // icons for sorting and filtering
      icons: [
        <ArrowUpDown
          key="sort"
          className="header-action-icon-svg"
          onClick={() => console.log("Sort by experience")}
        />,
        <Filter
          key="filter"
          className="header-action-icon-svg"
          onClick={() => console.log("Filter experience")}
        />,
      ],
    },
    {
      accessorKey: "ctc",
      label: "CTC",
      tooltipText: "Current CTC (Cost to Company)",
      // icons for sorting and filtering
      icons: [
        <ArrowUpDown
          key="sort"
          className="header-action-icon-svg"
          onClick={() => console.log("Sort by CTC")}
        />,
        <Filter
          key="filter"
          className="header-action-icon-svg"
          onClick={() => console.log("Filter CTC")}
        />,
      ],
    },
    {
      accessorKey: "ectc",
      label: "ECTC",
      tooltipText: "Expected CTC",
      // icons for sorting and filtering
      icons: [
        <ArrowUpDown
          key="sort"
          className="header-action-icon-svg"
          onClick={() => console.log("Sort by ECTC")}
        />,
        <Filter
          key="filter"
          className="header-action-icon-svg"
          onClick={() => console.log("Filter ECTC")}
        />,
      ],
    },
    {
      accessorKey: "noticePeriod",
      label: "Notice Period",
      tooltip: <Info className="header-tooltip-icon" />,
      tooltipText: "Notice period in days",
      // icons for sorting and filtering
      icons: [
        <ArrowUpDown
          key="sort"
          className="header-action-icon-svg"
          onClick={() => console.log("Sort by notice period")}
        />,
        <Filter
          key="filter"
          className="header-action-icon-svg"
          onClick={() => console.log("Filter notice period")}
        />,
      ],
    },
    {
      accessorKey: "currentLocation",
      label: "Current Location",
      tooltipText: "Current location",
      // icons for sorting and filtering
      icons: [
        <ArrowUpDown
          key="sort"
          className="header-action-icon-svg"
          onClick={() => console.log("Sort by location")}
        />,
        <Filter
          key="filter"
          className="header-action-icon-svg"
          onClick={() => console.log("Filter location")}
        />,
      ],
    },
    {
      accessorKey: "lastUpdated",
      label: "Last Updated",
      tooltipText: "Last updated date",
      // icons for sorting and filtering
      icons: [
        <ArrowUpDown
          key="sort"
          className="header-action-icon-svg"
          onClick={() => console.log("Sort by last updated")}
        />,
        <Filter
          key="filter"
          className="header-action-icon-svg"
          onClick={() => console.log("Filter last updated")}
        />,
      ],
    },
    {
      accessorKey: "applications",
      label: "Applications",
      tooltipText: "Number of applications",
      // icons for sorting and filtering
      icons: [
        <ArrowUpDown
          key="sort"
          className="header-action-icon-svg"
          onClick={() => console.log("Sort by applications")}
        />,
        <Filter
          key="filter"
          className="header-action-icon-svg"
          onClick={() => console.log("Filter applications")}
        />,
      ],
    },
    {
      accessorKey: "status",
      label: "Status",
      tooltipText: "Application status",
      // icons for sorting and filtering
      icons: [
        <ArrowUpDown
          key="sort"
          className="header-action-icon-svg"
          onClick={() => console.log("Sort by status")}
        />,
        <Filter
          key="filter"
          className="header-action-icon-svg"
          onClick={() => console.log("Filter status")}
        />,
      ],
    },
    {
      accessorKey: "actions",
      label: "Actions",
    },
  ];

  return (
    <TooltipProvider>
      <div className="app-container">
        <h1>Candidates Table</h1>
        <p className="app-description">
          View and manage candidate data. Click on a candidate name to view
          details.
        </p>

        {loading && (
          <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
        )}
        {error && (
          <div
            style={{ textAlign: "center", padding: "20px", color: "#ef4444" }}
          >
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {selectedIds.length > 0 && (
              <div
                style={{
                  padding: "12px 16px",
                  marginBottom: "16px",
                  backgroundColor: "#f1f5f9",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#475569", fontWeight: "500" }}>
                  {selectedIds.length} candidate
                  {selectedIds.length !== 1 ? "s" : ""} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedIds([])}
                >
                  Clear Selection
                </Button>
              </div>
            )}
            <DataTable
              size="large"
              data={data}
              headerData={headerData}
              //for modal open when click on row name open modal
              onRowClick={handleRowClick}
              selectedRowClassName="bg-red-500'"
              // pagination props
              showPagination={true}
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={[10, 20, 50, 100]}
              //for selection checkboxes
              showSelectionCheckbox={true}
              selectedIds={selectedIds}
              onSelection={handleSelection}
              // show/hide columns list, -- pass the accessorKey of the columns to show/hide
              showColumnsList={["designation", "currentCompany"]}
            />
          </>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          rowData={selectedRowData}
          nestedTableData={selectedRowData?.nestedTableData}
          nestedTableHeaderData={selectedRowData?.nestedTableHeaderData}
        />
      </div>
    </TooltipProvider>
  );
}

export default App;
