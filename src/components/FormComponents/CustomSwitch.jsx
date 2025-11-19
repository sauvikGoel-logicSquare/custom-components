import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

/**
 * CustomSwitch - Toggle switch component with label support
 *
 * @param {string} label - Optional label text for the switch
 * @param {string} description - Optional description text below label
 * @param {boolean} checked - Controlled checked state
 * @param {function} onCheckedChange - callback when switch state changes - required unless it's disabled
 * @param {boolean} disabled - whether switch is disabled
 * @param {string} id - input id attribute
 * @param {boolean} required - whether switch is required
 * @param {string} labelPosition - label position: right (default), left, top, bottom
 * @param {string} className - additional CSS classes
 * @param {object} props -  additional props passed to the Switch component
 */
const CustomSwitch = ({
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  id,
  required = false,
  labelPosition = "right",
  className = "",
  ...props
}) => {
  const switchId =
    id || `switch-${Math.random()?.toString(36)?.substring?.(2, 9)}`;

  const _getLayoutStyles = () => {
    switch (labelPosition) {
      case "left":
        return {
          flexDirection: "row-reverse",
          justifyContent: "flex-end",
        };
      case "top":
        return {
          flexDirection: "column-reverse",
          alignItems: "flex-start",
        };
      case "bottom":
        return {
          flexDirection: "column",
          alignItems: "flex-start",
        };
      case "right":
      default:
        return {
          flexDirection: "row",
          justifyContent: "flex-start",
        };
    }
  };

  const layoutStyles = _getLayoutStyles();

  const containerStyle = {
    display: "flex",
    alignItems:
      labelPosition === "top" || labelPosition === "bottom"
        ? "flex-start"
        : "center",
    gap: labelPosition === "top" || labelPosition === "bottom" ? "8px" : "12px",
    cursor: disabled ? "not-allowed" : "",
    opacity: disabled ? 0.6 : 1,
    ...layoutStyles,
  };

  const labelContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
  };

  // If no label, just render the switch
  if (!label && !description) {
    return (
      <Switch
        id={switchId}
        name={name}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={className}
        {...props}
      />
    );
  }

  return (
    <div style={containerStyle}>
      <Switch
        id={switchId}
        checked={checked}
        onCheckedChange={disabled ? undefined : onCheckedChange}
        disabled={disabled}
        className={className}
        {...props}
      />

      {label || description ? (
        <div style={labelContainerStyle}>
          {label ? (
            <Label
              htmlFor={switchId}
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#1e293b",
                cursor: disabled ? "not-allowed" : "pointer",
                userSelect: "none",
              }}
            >
              {label}
              {required && (
                <span style={{ color: "#ef4444", marginLeft: "4px" }}>*</span>
              )}
            </Label>
          ) : null}

          {description ? (
            <span
              style={{
                fontSize: "13px",
                color: "#64748b",
                lineHeight: "1.4",
              }}
            >
              {description}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default CustomSwitch;
