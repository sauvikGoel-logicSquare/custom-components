import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "./button";

const Pagination = ({ className, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={className || ""}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "4px",
      listStyle: "none",
      padding: 0,
      margin: 0,
    }}
    className={className || ""}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={className || ""} {...props} />
));
PaginationItem.displayName = "PaginationItem";

const PaginationLink = React.forwardRef(
  (
    {
      className,
      isActive = false,
      size = "default",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const baseStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "6px",
      border: "1px solid #e2e8f0",
      backgroundColor: isActive ? "#667eea" : "#ffffff",
      color: isActive ? "#ffffff" : "#475569",
      fontWeight: isActive ? "600" : "500",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.2s ease",
      outline: "none",
      opacity: disabled ? 0.5 : 1,
      userSelect: "none",
    };

    const sizeStyles = {
      sm: {
        height: "32px",
        minWidth: "32px",
        padding: "0 8px",
        fontSize: "13px",
      },
      default: {
        height: "40px",
        minWidth: "40px",
        padding: "0 12px",
        fontSize: "14px",
      },
      lg: {
        height: "44px",
        minWidth: "44px",
        padding: "0 16px",
        fontSize: "15px",
      },
    };

    return (
      <a
        ref={ref}
        style={{
          ...baseStyle,
          ...sizeStyles[size],
          ...props.style,
        }}
        className={className || ""}
        aria-disabled={disabled}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          props.onClick?.(e);
        }}
        {...props}
      />
    );
  }
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = React.forwardRef(
  ({ className, disabled = false, ...props }, ref) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to previous page"
      size="default"
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
      className={className || ""}
      {...props}
    >
      <ChevronLeft style={{ height: "16px", width: "16px" }} />
      <span>Previous</span>
    </PaginationLink>
  )
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = React.forwardRef(
  ({ className, disabled = false, ...props }, ref) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to next page"
      size="default"
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
      className={className || ""}
      {...props}
    >
      <span>Next</span>
      <ChevronRight style={{ height: "16px", width: "16px" }} />
    </PaginationLink>
  )
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }) => (
  <div
    style={{
      display: "flex",
      height: "40px",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "40px",
      padding: "0 12px",
    }}
    className={className || ""}
    {...props}
  >
    <MoreHorizontal
      style={{ height: "16px", width: "16px", color: "#94a3b8" }}
    />
    <span className="sr-only">More pages</span>
  </div>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
