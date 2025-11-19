import * as React from "react";
import { cn } from "@/lib/utils";

const Spinner = React.forwardRef(
  ({ className, size = "default", variant = "solid", ...props }, ref) => {
    const getSizeStyles = () => {
      switch (size) {
        case "sm":
          return { width: "16px", height: "16px", borderWidth: "2px" };
        case "lg":
          return { width: "32px", height: "32px", borderWidth: "3px" };
        case "xl":
          return { width: "48px", height: "48px", borderWidth: "4px" };
        default:
          return { width: "24px", height: "24px", borderWidth: "3px" };
      }
    };

    const sizeStyles = getSizeStyles();

    const getBorderStyle = () => {
      if (variant === "dotted") {
        return {
          border: `${sizeStyles.borderWidth} dotted rgba(0, 0, 0, 0.2)`,
          borderTopColor: "#667eea",
          borderRightColor: "#667eea",
        };
      }
      // Default solid variant
      return {
        border: `${sizeStyles.borderWidth} solid rgba(0, 0, 0, 0.1)`,
        borderTopColor: "#667eea",
      };
    };

    const spinnerStyle = {
      borderRadius: "50%",
      ...getBorderStyle(),
      animation: "spin 0.8s linear infinite",
      ...sizeStyles,
      ...props.style,
    };

    return (
      <>
        <style>
          {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
        </style>
        <div
          ref={ref}
          {...props}
          className={cn("inline-block", className)}
          style={spinnerStyle}
        />
      </>
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner };
