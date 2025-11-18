import React from "react";
import Select from "react-select";
import { Label } from "../ui/label";

const allowedSizes = ["sm", "default", "lg"];

/**
 * CustomSelect - A versatile select dropdown component powered by react-select
 *
 * @param {string} label - Label text for the select field
 * @param {array} options - Array of options: [{ value: string, label: string }] or simple string array
 * @param {string|array} value - Selected value(s) (controlled component) - array if isMulti is true
 * @param {function} onChange - Callback when selection changes
 * @param {string} placeholder - Placeholder text when no value selected
 * @param {boolean} disabled - Whether the select is disabled
 * @param {string} error - Error message to display
 * @param {boolean} required - Whether the field is required
 * @param {string} helperText - Helper text to display below the select
 * @param {string} className - Additional CSS classes for the container
 * @param {string} size - Select size: sm, default, lg (default: default)
 * @param {boolean} showLabel - Whether to show the label (default: true)
 * @param {boolean} isSearchable - Enable search functionality (default: false)
 * @param {boolean} isClearable - Enable clear button (default: false)
 * @param {boolean} isMulti - Enable multi-select (default: false)
 * @param {boolean} closeMenuOnSelect - Close menu after selection (default: true for single, false for multi)
 * @param {string} noOptionsMessage - Message when no options available
 * @param {number} maxMenuHeight - Maximum height of dropdown menu
 * @param {object} customStyles - Custom styles for react-select components
 * @param {object} props - Additional props passed to the react-select component
 *
 */

const CustomSelect = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  error,
  required = false,
  helperText,
  className = "",
  size = allowedSizes?.[1],
  showLabel = true,
  isSearchable = false,
  isClearable = false,
  isMulti = false,
  closeMenuOnSelect,
  noOptionsMessage = "No options available",
  maxMenuHeight = 300,
  customStyles,
  ...props
}) => {
  const selectId = React.useMemo(
    () => `select-${Math.random().toString(36).substring(2, 9)}`,
    []
  );

  // Normalize options to always have value and label
  const normalizedOptions = React.useMemo(() => {
    return options.map((option) => {
      if (typeof option === "string") {
        return { value: option, label: option };
      }
      return option;
    });
  }, [options]);

  // Convert value to react-select format
  const selectedValue = React.useMemo(() => {
    if (!value) return isMulti ? [] : null;

    if (isMulti) {
      if (Array.isArray(value)) {
        return value.map((val) => {
          if (typeof val === "string") {
            return (
              normalizedOptions.find((opt) => opt.value === val) || {
                value: val,
                label: val,
              }
            );
          }
          return val;
        });
      }
      return [];
    } else {
      if (typeof value === "string") {
        return (
          normalizedOptions.find((opt) => opt.value === value) || {
            value,
            label: value,
          }
        );
      }
      return value;
    }
  }, [value, normalizedOptions, isMulti]);

  // Handle change event
  const handleChange = (selectedOption) => {
    if (isMulti) {
      // For multi-select, return array of values
      onChange?.(selectedOption ? selectedOption.map((opt) => opt.value) : []);
    } else {
      // For single-select, return single value
      onChange?.(selectedOption ? selectedOption.value : null);
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case allowedSizes?.[0]:
        return { minHeight: "32px", fontSize: "13px" };
      case allowedSizes?.[2]:
        return { minHeight: "48px", fontSize: "16px" };
      default:
        return { minHeight: "40px", fontSize: "14px" };
    }
  };

  const sizeStyles = getSizeStyles();

  // Custom styles for react-select
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      ...sizeStyles,
      borderColor: error ? "#ef4444" : state.isFocused ? "#667eea" : "#e2e8f0",
      borderRadius: "6px",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(102, 126, 234, 0.1)"
        : "none",
      "&:hover": {
        borderColor: error
          ? "#ef4444"
          : state.isFocused
          ? "#667eea"
          : "#cbd5e1",
      },
      backgroundColor: disabled ? "#f8f9fa" : "#ffffff",
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? "not-allowed" : "pointer",
    }),
    valueContainer: (base) => ({
      ...base,
      padding:
        size === allowedSizes?.[0]
          ? "2px 8px"
          : size === allowedSizes?.[2]
          ? "8px 12px"
          : "4px 12px",
    }),
    input: (base) => ({
      ...base,
      margin: "0px",
      padding: "0px",
      fontSize: sizeStyles.fontSize,
    }),
    placeholder: (base) => ({
      ...base,
      color: "#94a3b8",
      fontSize: sizeStyles.fontSize,
    }),
    singleValue: (base) => ({
      ...base,
      color: "#1e293b",
      fontSize: sizeStyles.fontSize,
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#f1f5f9",
      borderRadius: "4px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#1e293b",
      fontSize: size === allowedSizes?.[0] ? "12px" : "13px",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#64748b",
      "&:hover": {
        backgroundColor: "#e2e8f0",
        color: "#1e293b",
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "6px",
      border: "1px solid #e2e8f0",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 9999,
    }),
    menuList: (base) => ({
      ...base,
      padding: "4px",
      maxHeight: maxMenuHeight,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#667eea"
        : state.isFocused
        ? "#f1f5f9"
        : "transparent",
      color: state.isSelected ? "#ffffff" : "#1e293b",
      cursor: "pointer",
      borderRadius: "4px",
      padding:
        size === allowedSizes?.[0]
          ? "6px 10px"
          : size === allowedSizes?.[2]
          ? "10px 12px"
          : "8px 12px",
      fontSize: sizeStyles.fontSize,
      "&:active": {
        backgroundColor: state.isSelected ? "#667eea" : "#e2e8f0",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#94a3b8",
      padding:
        size === allowedSizes?.[0]
          ? "4px"
          : size === allowedSizes?.[2]
          ? "10px"
          : "8px",
      "&:hover": {
        color: "#64748b",
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      color: "#94a3b8",
      padding:
        size === allowedSizes?.[0]
          ? "4px"
          : size === allowedSizes?.[2]
          ? "10px"
          : "8px",
      "&:hover": {
        color: "#64748b",
      },
    }),
    ...customStyles,
  };

  return (
    <div className={className} style={{ width: "100%" }}>
      {/* Label */}
      {label && showLabel && (
        <Label
          htmlFor={selectId}
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "500",
            color: error ? "#ef4444" : "#374151",
            marginBottom: "6px",
          }}
        >
          {label}
          {required && (
            <span style={{ color: "#ef4444", marginLeft: "4px" }}>*</span>
          )}
        </Label>
      )}

      {/* React Select Component */}
      <Select
        inputId={selectId}
        options={normalizedOptions}
        value={selectedValue}
        onChange={handleChange}
        placeholder={placeholder}
        isDisabled={disabled}
        isSearchable={isSearchable}
        isClearable={isClearable}
        isMulti={isMulti}
        closeMenuOnSelect={closeMenuOnSelect ?? !isMulti}
        noOptionsMessage={() => noOptionsMessage}
        styles={selectStyles}
        {...props}
      />

      {/* Helper Text / Error Message */}
      {(error || helperText) && (
        <div
          style={{
            fontSize: "13px",
            marginTop: "6px",
            color: error ? "#ef4444" : "#64748b",
            lineHeight: "1.4",
          }}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
