import { Logo } from "../ui/logo";

const allowedLogoSizes = ["sm", "default", "lg"];

// Default fallback image
const DEFAULT_IMAGE = "https://placehold.co/600x400";

/**
 * CustomLogo - A versatile logo/image display component with circular container
 *
 * @param {string} src - Primary logo/image URL to display
 * @param {string} fallbackSrc - Secondary image to use if primary fails or not available (optional)
 * @param {string} size - Logo size: sm (30x30), default (100x100), lg (150x150)
 * @param {string} alt - Alt text for the image (default: "Logo")
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props passed to the Logo component
 */

const CustomLogo = ({
  src,
  fallbackSrc,
  size = allowedLogoSizes?.[1], // default size
  alt = "Logo",
  className = "",
  ...props
}) => {
  // Determine the source to use
  const primarySrc = src ? src : fallbackSrc ? fallbackSrc : DEFAULT_IMAGE;

  return (
    <Logo
      src={primarySrc}
      fallbackSrc={fallbackSrc}
      defaultFallbackSrc={DEFAULT_IMAGE}
      size={
        size && allowedLogoSizes?.includes(size) ? size : allowedLogoSizes?.[1]
      }
      alt={alt}
      className={className}
      {...props}
    />
  );
};

export default CustomLogo;
