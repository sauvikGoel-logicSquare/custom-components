import { Badge } from "@/components/ui/badge";

const allowedVariants = [
  "default",
  "secondary",
  "destructive",
  "success",
  "warning",
  "outline",
];
const allowedSizes = ["sm", "default", "lg"];

/**
 * CustomBadge - A versatile badge component for status indicators and tags
 *
 * @param {string} text - Badge text content (required)
 * @param {string} variant - Badge style: default, secondary, destructive, success, warning, outline
 * @param {string} size - Badge size: sm, default, lg
 * @param {node} leftIcon - Optional icon on the left
 * @param {node} rightIcon - Optional icon on the right
 * @param {boolean} dot - Shows a dot indicator before text
 * @param {string} dotColor - Custom color for dot indicator
 * @param {function} onRemove - If provided, shows X button to remove badge
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props passed to the Badge component
 */
const CustomBadge = ({
  text = "Default",
  variant = "default",
  size = "default",
  leftIcon,
  rightIcon,
  dot = false,
  dotColor,
  onRemove,
  className = "",
  ...props
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          padding: "2px 8px",
          fontSize: "11px",
          gap: "4px",
        };
      case "lg":
        return {
          padding: "4px 12px",
          fontSize: "13px",
          gap: "6px",
        };
      default:
        return {
          padding: "2px 10px",
          fontSize: "12px",
          gap: "5px",
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <Badge
      variant={
        variant && allowedVariants?.includes(variant)
          ? variant
          : allowedVariants?.Badge?.[0] // default variant
      }
      size={
        size && allowedSizes?.includes(size) ? size : allowedSizes?.Badge?.[0] // default size
      }
      className={className}
      style={{
        ...sizeStyles,
        display: "inline-flex",
        alignItems: "center",
        ...props.style,
      }}
      {...props}
    >
      {/* Dot Indicator */}
      {dot ? (
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: dotColor || "currentColor",
          }}
        />
      ) : null}

      {/* Left Icon */}
      {leftIcon ? (
        <span style={{ display: "inline-flex", alignItems: "center" }}>
          {leftIcon}
        </span>
      ) : null}

      {/* Badge Text */}
      {text ? <span>{text}</span> : null}

      {/* Right Icon */}
      {rightIcon ? (
        <span style={{ display: "inline-flex", alignItems: "center" }}>
          {rightIcon}
        </span>
      ) : null}

      {/* Remove Button */}
      {onRemove ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            marginLeft: "4px",
            display: "inline-flex",
            alignItems: "center",
            color: "inherit",
            opacity: 0.7,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.7)}
          aria-label="Remove"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M9 3L3 9M3 3l6 6" />
          </svg>
        </button>
      ) : null}
    </Badge>
  );
};

export default CustomBadge;
