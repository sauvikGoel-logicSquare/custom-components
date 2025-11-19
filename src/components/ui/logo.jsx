import * as React from "react";
import { cn } from "@/lib/utils";

const Logo = React.forwardRef(
  (
    {
      className,
      size = "default",
      src,
      alt = "Logo",
      fallbackSrc,
      defaultFallbackSrc,
      ...props
    },
    ref
  ) => {
    const [imgSrc, setImgSrc] = React.useState(src);
    const [hasError, setHasError] = React.useState(false);

    React.useEffect(() => {
      setImgSrc(src);
      setHasError(false);
    }, [src]);

    const getSizeStyles = () => {
      switch (size) {
        case "sm":
          return { width: "40px", height: "40px" };
        case "lg":
          return { width: "150px", height: "150px" };
        default:
          return { width: "100px", height: "100px" };
      }
    };

    const sizeStyles = getSizeStyles();

    const handleError = () => {
      if (!hasError) {
        setHasError(true);
        // First try fallbackSrc, then defaultFallbackSrc
        if (imgSrc !== fallbackSrc && fallbackSrc) {
          setImgSrc(fallbackSrc);
        } else if (defaultFallbackSrc) {
          setImgSrc(defaultFallbackSrc);
        }
      }
    };

    const currentSrc = imgSrc || fallbackSrc || defaultFallbackSrc;

    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center", className)}
        style={{
          ...sizeStyles,
          borderRadius: "50%",
          overflow: "hidden",
          border: "2px solid rgba(255, 255, 255, 0.9)",
          boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.05)",
          backgroundColor: "#f8fafc",
          ...props.style,
        }}
        {...props}
      >
        {currentSrc ? (
          <img
            src={currentSrc}
            alt={alt}
            onError={handleError}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#e2e8f0",
              color: "#64748b",
              fontSize:
                size === "sm" ? "12px" : size === "lg" ? "24px" : "16px",
              fontWeight: "500",
            }}
          >
            {alt ? alt.charAt(0).toUpperCase() : "?"}
          </div>
        )}
      </div>
    );
  }
);

Logo.displayName = "Logo";

export { Logo };
