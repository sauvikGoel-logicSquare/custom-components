import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Value
    ref={ref}
    style={{
      color: "#1e293b",
      fontSize: "14px",
    }}
    className={className || ""}
    {...props}
  />
));
SelectValue.displayName = "SelectValue";

const SelectTrigger = React.forwardRef(
  ({ className, children, disabled, style, ...props }, ref) => {
    const baseStyle = {
      display: "flex",
      height: "40px",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: "6px",
      border: "1px solid #e2e8f0",
      backgroundColor: disabled ? "#f8f9fa" : "#ffffff",
      padding: "0 12px",
      fontSize: "14px",
      color: "#1e293b",
      outline: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.2s",
      opacity: disabled ? 0.6 : 1,
      ...style,
    };

    return (
      <SelectPrimitive.Trigger
        ref={ref}
        style={baseStyle}
        className={className || ""}
        disabled={disabled}
        onFocus={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = "#667eea";
            e.currentTarget.style.boxShadow =
              "0 0 0 2px rgba(102, 126, 234, 0.1)";
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#e2e8f0";
          e.currentTarget.style.boxShadow = "none";
        }}
        {...props}
      >
        {children}
        <SelectPrimitive.Icon asChild>
          <ChevronDown
            style={{
              height: "16px",
              width: "16px",
              opacity: 0.5,
              marginLeft: "8px",
            }}
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    );
  }
);
SelectTrigger.displayName =
  SelectPrimitive.Trigger?.displayName || "SelectTrigger";

const SelectScrollButton = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.ScrollButton
      ref={ref}
      style={{
        display: "flex",
        cursor: "default",
        alignItems: "center",
        justifyContent: "center",
        height: "25px",
        backgroundColor: "#ffffff",
        color: "#475569",
      }}
      className={className || ""}
      {...props}
    >
      {children}
    </SelectPrimitive.ScrollButton>
  )
);
SelectScrollButton.displayName =
  SelectPrimitive.ScrollButton?.displayName || "SelectScrollButton";

const SelectContent = React.forwardRef(
  ({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        style={{
          zIndex: 9999,
          minWidth: "var(--radix-select-trigger-width)",
          maxHeight: "var(--radix-select-content-available-height)",
          overflow: "hidden",
          borderRadius: "6px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          color: "#0f172a",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          padding: "4px",
        }}
        className={className || ""}
        {...props}
      >
        <SelectPrimitive.Viewport
          style={{
            padding: "4px",
          }}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
);
SelectContent.displayName =
  SelectPrimitive.Content?.displayName || "SelectContent";

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    style={{
      padding: "8px 12px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#475569",
    }}
    className={className || ""}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label?.displayName || "SelectLabel";

const SelectItem = React.forwardRef(
  ({ className, children, disabled, ...props }, ref) => {
    const isDisabled = disabled || props.disabled;
    
    return (
      <SelectPrimitive.Item
        ref={ref}
        disabled={isDisabled}
        style={{
          position: "relative",
          display: "flex",
          cursor: isDisabled ? "not-allowed" : "pointer",
          userSelect: "none",
          alignItems: "center",
          borderRadius: "4px",
          padding: "8px 12px 8px 32px",
          fontSize: "14px",
          color: isDisabled ? "#94a3b8" : "#1e293b",
          outline: "none",
          transition: "background-color 0.2s",
          backgroundColor: "transparent",
          opacity: isDisabled ? 0.5 : 1,
        }}
        className={className || ""}
        onFocus={(e) => {
          if (!isDisabled) {
            e.currentTarget.style.backgroundColor = "#f1f5f9";
            e.currentTarget.style.color = "#1e293b";
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = isDisabled ? "#94a3b8" : "#1e293b";
        }}
        onMouseEnter={(e) => {
          if (!isDisabled) {
            e.currentTarget.style.backgroundColor = "#f1f5f9";
            e.currentTarget.style.color = "#1e293b";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = isDisabled ? "#94a3b8" : "#1e293b";
        }}
        {...props}
      >
      <span
        style={{
          position: "absolute",
          left: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SelectPrimitive.ItemIndicator>
          <Check style={{ height: "16px", width: "16px", color: isDisabled ? "#94a3b8" : "#667eea" }} />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
    );
  }
);
SelectItem.displayName = SelectPrimitive.Item?.displayName || "SelectItem";

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    style={{
      height: "1px",
      margin: "4px -4px",
      backgroundColor: "#e2e8f0",
    }}
    className={className || ""}
    {...props}
  />
));
SelectSeparator.displayName =
  SelectPrimitive.Separator?.displayName || "SelectSeparator";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollButton,
};
