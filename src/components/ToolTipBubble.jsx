import React from "react";

function ToolTipBubble({
  tooltipText,
  className = "",
  backgroundColor = "#1e293b",
  color = "#ffffff",
}) {
  return (
    <span
      style={{
        visibility: "hidden",
        background: backgroundColor,
        color: color,
        padding: "7px 12px",
        borderRadius: 6,
        position: "absolute",
        left: "50%",
        zIndex: 10,
        top: "110%",
        minWidth: 120,
        fontSize: 13,
        transform: "translateX(-50%)",
        whiteSpace: "pre-line",
        boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
        pointerEvents: "none",
      }}
      className={`header-tooltip-popover ${className || ""}`}
    >
      {tooltipText || ""}
    </span>
  );
}

export default ToolTipBubble;
