import { Spinner } from "../ui/spinner";

const allowedSpinnerSizes = ["sm", "default", "lg", "xl"];
const allowedSpinnerVariants = ["solid", "dotted"];

/**
 * CustomSpinner - A versatile loading spinner component
 *
 * @param {string} size - Spinner size: sm, default, lg, xl
 * @param {string} variant - Spinner style: solid, dotted (default: solid)
 * @param {string} className - Additional CSS classes
 * @param {string} color - Custom color for the spinner (default: primary blue)
 * @param {boolean} fullScreen - If true, centers spinner in full viewport
 * @param {string} label - Optional loading text to display below spinner
 * @param {object} props - Additional props passed to the Spinner component
 */
const CustomSpinner = ({
  size = allowedSpinnerSizes?.[1], // default size
  variant = allowedSpinnerVariants?.[0], // default variant (solid)
  className = "",
  color,
  fullScreen = false,
  label,
  ...props
}) => {
  const spinnerStyle = color
    ? {
        borderTopColor: color,
        borderRightColor: color,
      }
    : {};

  if (fullScreen) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          zIndex: 9999,
        }}
      >
        <Spinner
          size={
            size && allowedSpinnerSizes?.includes(size)
              ? size
              : allowedSpinnerSizes?.[1]
          }
          variant={
            variant && allowedSpinnerVariants?.includes(variant)
              ? variant
              : allowedSpinnerVariants?.[0]
          }
          className={className}
          style={spinnerStyle}
          {...props}
        />
        {label && (
          <span style={{ fontSize: "14px", color: "#64748b" }}>{label}</span>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <Spinner
        size={
          size && allowedSpinnerSizes?.includes(size)
            ? size
            : allowedSpinnerSizes?.[1]
        }
        variant={
          variant && allowedSpinnerVariants?.includes(variant)
            ? variant
            : allowedSpinnerVariants?.[0]
        }
        className={className}
        style={spinnerStyle}
        {...props}
      />
      {label && (
        <span style={{ fontSize: "13px", color: "#64748b" }}>{label}</span>
      )}
    </div>
  );
};

export default CustomSpinner;
