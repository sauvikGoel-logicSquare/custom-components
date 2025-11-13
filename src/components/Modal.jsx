import DataTable from "./DataTable";
import "./Modal.css";

/**
 * Modal Component
 * Displays row data in a modal dialog with optional nested table
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Function} onClose - Function to call when closing the modal
 * @param {Object} rowData - The row data to display
 * @param {Array} nestedTableData - Optional nested table data to display
 * @param {Array} nestedTableHeaderData - Optional nested table header configuration
 */
function Modal({
  isOpen,
  onClose,
  rowData,
  nestedTableData,
  nestedTableHeaderData,
}) {
  if (!isOpen || !rowData) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Row Details</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          {/* Show nested table if provided */}
          {nestedTableData && nestedTableHeaderData ? (
            <div className="modal-table-container">
              <h3 className="modal-table-title">Related Data</h3>
              <DataTable
                data={nestedTableData}
                headerData={nestedTableHeaderData}
              />
            </div>
          ) : (
            <div>No nested table data provided</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
