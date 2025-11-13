import * as React from "react";

const Button = React.forwardRef(
  (
    { className = "", variant = "default", size = "default", ...props },
    ref
  ) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "ghost":
          return {
            background: "transparent",
            border: "none",
            color: "#475569",
          };
        case "outline":
          return {
            background: "transparent",
            border: "1px solid #e2e8f0",
            color: "#475569",
          };
        case "secondary":
          return {
            background: "#f1f5f9",
            border: "none",
            color: "#1e293b",
          };
        default:
          return {
            background: "#667eea",
            border: "none",
            color: "#ffffff",
          };
      }
    };

    const getSizeStyles = () => {
      switch (size) {
        case "sm":
          return { height: "36px", padding: "0 12px", fontSize: "13px" };
        case "lg":
          return { height: "44px", padding: "0 32px", fontSize: "15px" };
        case "icon":
          return { height: "40px", width: "40px", padding: "0" };
        default:
          return { height: "40px", padding: "0 16px", fontSize: "14px" };
      }
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();

    const buttonStyle = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "6px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      outline: "none",
      ...variantStyles,
      ...sizeStyles,
      ...props.style,
    };

    return (
      <button
        className={className}
        style={buttonStyle}
        ref={ref}
        onMouseEnter={(e) => {
          if (variant === "ghost") {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
          }
        }}
        onMouseLeave={(e) => {
          if (variant === "ghost") {
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
