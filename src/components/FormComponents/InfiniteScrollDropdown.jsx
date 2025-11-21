import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
// eslint-disable-next-line no-unused-vars
import Select, { components } from "react-select";
import CreatableSelect from "react-select/creatable";

/**
 * InfiniteScrollDropdown - A dropdown component with infinite scroll functionality
 * @param {Object} props - Component props
 * @param {Array} props.optionsConfig - Array of options for the dropdown
 * @param {Object|Array} props.value - Selected value(s)
 * @param {Function} props.onChangeFunc - Callback when selection changes
 * @param {Function} props.onInputChange - Callback when input value changes
 * @param {Function} props.onBlur - Callback when dropdown loses focus
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.shouldMenuScrollIntoView - Whether menu should scroll into view
 * @param {number} props.totalDataCount - Total count of available data
 * @param {number} props.totalDataPages - Total number of pages
 * @param {Function} props.updateOptionsConfig - Function to fetch more options
 * @param {Object} props.dropdownPayload - Current payload for fetching data
 * @param {Function} props.setDropdownPayload - Function to update dropdown payload
 * @param {boolean} props.isCreateable - Whether users can create new options
 * @param {boolean} props.isClearable - Whether selection can be cleared
 * @param {boolean} props.isDisabled - Whether dropdown is disabled
 * @param {boolean} props.isMulti - Whether multiple selections are allowed
 * @param {boolean} props.isLoading - Whether data is currently loading
 */
function InfiniteScrollDropdown({
  optionsConfig,
  value,
  onChangeFunc,
  onInputChange,
  onBlur,
  placeholder = "",
  shouldMenuScrollIntoView = false,
  totalDataCount = 0,
  totalDataPages = 0,
  updateOptionsConfig,
  dropdownPayload,
  setDropdownPayload,
  isCreateable = false,
  isClearable = false,
  isDisabled = false,
  isMulti = false,
  isLoading = false,
}) {
  const selectRef = useRef(null);

  const [inputValue, setInputValue] = useState("");

  const _handleOnChangeInputValue = useCallback(
    (value, actionMeta) => {
      setInputValue(value);
      if (onInputChange) {
        onInputChange(value, actionMeta);
      }
      return value;
    },
    [onInputChange]
  );

  const _scrollToBottom = useCallback(() => {
    const newDropDownPayload = { ...dropdownPayload };
    newDropDownPayload["page"] = newDropDownPayload["page"] + 1;

    if (newDropDownPayload["page"] <= totalDataPages) {
      setDropdownPayload(newDropDownPayload);
      updateOptionsConfig(newDropDownPayload);
    }
  }, [
    dropdownPayload,
    totalDataPages,
    setDropdownPayload,
    updateOptionsConfig,
  ]);

  const MenuListWithLoader = useCallback(
    (props) => {
      const hasMoreData = optionsConfig?.length < totalDataCount;

      return (
        <components.MenuList {...props}>
          {props.children}
          {hasMoreData && isLoading && (
            <div className="flex justify-center items-center p-2">
              <i className="fa fa-spinner fa-spin mr-1" />
              <span className="text-sm text-gray-500">Loading more...</span>
            </div>
          )}
        </components.MenuList>
      );
    },
    [optionsConfig?.length, totalDataCount, isLoading]
  );

  const handleMenuScrollToBottom = useCallback(() => {
    const hasMoreData = optionsConfig?.length < totalDataCount;
    if (hasMoreData && !isLoading) {
      _scrollToBottom();
    }
  }, [optionsConfig?.length, totalDataCount, isLoading, _scrollToBottom]);

  useEffect(() => {
    if (updateOptionsConfig && dropdownPayload) {
      updateOptionsConfig(dropdownPayload);
    }
    // Only run on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const CustomStyle = useMemo(
    () => ({
      menuList: (base) => ({
        ...base,
      }),
      option: (styles) => ({
        ...styles,
        zIndex: 1,
      }),
      menu: (base) => ({
        ...base,
        zIndex: 100,
      }),
    }),
    []
  );

  const commonProps = {
    components: { MenuList: MenuListWithLoader },
    placeholder: placeholder || "Enter",
    classNamePrefix: "select",
    isClearable,
    isDisabled,
    options: optionsConfig,
    onBlur,
    value,
    inputValue,
    onChange: onChangeFunc,
    onInputChange: _handleOnChangeInputValue,
    onMenuScrollToBottom: handleMenuScrollToBottom,
    styles: CustomStyle,
    ref: selectRef,
  };

  return (
    <>
      {isCreateable ? (
        <CreatableSelect
          {...commonProps}
          isMulti={isMulti}
          aria-label={placeholder || "Select or create an option"}
        />
      ) : (
        <Select
          {...commonProps}
          isMulti={isMulti}
          menuShouldScrollIntoView={shouldMenuScrollIntoView}
          aria-label={placeholder || "Select an option"}
        />
      )}
    </>
  );
}
export default InfiniteScrollDropdown;
