import * as React from "react";

const Switch = React.forwardRef(
  (
    { className, checked = false, onCheckedChange, disabled = false, ...props },
    ref
  ) => {
    const [isChecked, setIsChecked] = React.useState(checked);

    React.useEffect(() => {
      setIsChecked(checked);
    }, [checked]);

    const handleToggle = () => {
      if (!disabled) {
        const newChecked = !isChecked;
        setIsChecked(newChecked);
        if (onCheckedChange) {
          onCheckedChange(newChecked);
        }
      }
    };

    const switchStyle = {
      display: "inline-flex",
      width: "44px",
      height: "24px",
      flexShrink: 0,
      cursor: disabled ? "not-allowed" : "pointer",
      borderRadius: "9999px",
      border: "2px solid transparent",
      transition: "background-color 0.2s ease",
      backgroundColor: isChecked ? "#667eea" : "#cbd5e1",
      opacity: disabled ? 0.5 : 1,
      position: "relative",
      ...props.style,
    };

    const thumbStyle = {
      pointerEvents: "none",
      display: "block",
      width: "20px",
      height: "20px",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      borderRadius: "9999px",
      transition: "transform 0.2s ease",
      transform: isChecked ? "translateX(20px)" : "translateX(0)",
    };

    return (
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        ref={ref}
        className={className}
        style={switchStyle}
        onClick={handleToggle}
        disabled={disabled}
        {...props}
      >
        <span style={thumbStyle} />
      </button>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
