import * as React from "react";

const Badge = React.forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "secondary":
          return {
            backgroundColor: "#f1f5f9",
            color: "#1e293b",
            borderColor: "transparent",
          };
        case "destructive":
          return {
            backgroundColor: "#ef4444",
            color: "#ffffff",
            borderColor: "transparent",
          };
        case "success":
          return {
            backgroundColor: "#10b981",
            color: "#ffffff",
            borderColor: "transparent",
          };
        case "warning":
          return {
            backgroundColor: "#f59e0b",
            color: "#ffffff",
            borderColor: "transparent",
          };
        case "outline":
          return {
            backgroundColor: "transparent",
            color: "#475569",
            borderColor: "#e2e8f0",
          };
        default:
          return {
            backgroundColor: "#667eea",
            color: "#ffffff",
            borderColor: "transparent",
          };
      }
    };

    const variantStyles = getVariantStyles();

    const badgeStyle = {
      display: "inline-flex",
      alignItems: "center",
      borderRadius: "9999px",
      border: "1px solid",
      padding: "2px 10px",
      fontSize: "12px",
      fontWeight: "600",
      lineHeight: "1",
      transition: "all 0.2s ease",
      ...props?.style,
      ...variantStyles,
    };

    return (
      <div ref={ref} className={className} {...props} style={badgeStyle} />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
