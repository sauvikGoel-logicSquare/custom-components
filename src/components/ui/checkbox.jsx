import * as React from "react";
import { Check, Minus } from "lucide-react";

const Checkbox = React.forwardRef(
  (
    {
      className = "",
      checked,
      onCheckedChange,
      disabled,
      indeterminate,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(
      checked || false
    );

    // Use checked prop if provided (controlled), otherwise use internal state (uncontrolled)
    const isChecked = checked !== undefined ? checked : internalChecked;
    const isIndeterminate = indeterminate === true;

    // Sync internal state with external checked prop
    React.useEffect(() => {
      if (checked !== undefined) {
        setInternalChecked(checked);
      }
    }, [checked]);

    const handleClick = (e) => {
      if (disabled) return;
      e.stopPropagation();
      const newChecked = !isChecked;

      // Update internal state only if uncontrolled
      if (checked === undefined) {
        setInternalChecked(newChecked);
      }

      // Always call the callback
      if (onCheckedChange) {
        onCheckedChange(newChecked);
      }
    };

    const checkboxStyle = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "16px",
      height: "16px",
      borderRadius: "4px",
      border: "2px solid #cbd5e1",
      backgroundColor: isChecked || isIndeterminate ? "#667eea" : "#ffffff",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.2s ease",
      outline: "none",
      opacity: disabled ? 0.5 : 1,
      position: "relative",
      ...props.style,
    };

    return (
      <div
        ref={ref}
        className={className}
        style={checkboxStyle}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick(e);
          }
        }}
        tabIndex={disabled ? -1 : 0}
        role="checkbox"
        aria-checked={isIndeterminate ? "mixed" : isChecked}
        aria-disabled={disabled}
        {...props}
      >
        {isIndeterminate ? (
          <Minus
            size={12}
            style={{
              color: "#ffffff",
              strokeWidth: 3,
            }}
          />
        ) : isChecked ? (
          <Check
            size={12}
            style={{
              color: "#ffffff",
              strokeWidth: 3,
            }}
          />
        ) : null}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
