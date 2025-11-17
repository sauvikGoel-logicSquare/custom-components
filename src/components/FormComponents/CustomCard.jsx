import React, { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";

/**
 * CustomCard - A versatile card component with customizable header, body, and footer
 *
 * @param {ReactNode} children - Card body content
 * @param {string|ReactNode} title - Card title (can be string or custom React element)
 * @param {string|ReactNode} description - Card description/subtitle (can be string or custom React element)
 * @param {ReactNode} header - Custom header content (overrides title/description if provided)
 * @param {ReactNode} footer - Footer content
 * @param {string} className - Additional CSS classes for the card
 * @param {string} headerClassName - Additional CSS classes for the header
 * @param {string} contentClassName - Additional CSS classes for the content/body
 * @param {string} footerClassName - Additional CSS classes for the footer
 * @param {string} headerBgColor - Background color for the header (e.g., "#EEF2FF")
 * @param {object} headerStyle - Inline styles for the header
 * @param {object} contentStyle - Inline styles for the content/body
 * @param {object} footerStyle - Inline styles for the footer
 * @param {boolean} noPadding - If true, removes default padding from content
 * @param {boolean} hoverable - If true, adds hover effect to the card
 * @param {function} onClick - Click handler for the card
 * @param {object} props - Additional props passed to the Card component
 */

const CustomCard = ({
  children,
  title,
  description,
  header,
  footer,
  className = "",
  headerClassName = "",
  contentClassName = "",
  footerClassName = "",
  headerBgColor,
  headerStyle,
  contentStyle,
  footerStyle,
  noPadding = false,
  hoverable = true,
  onClick,
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const cardStyle = useMemo(
    () => ({
      transition: hoverable ? "all 0.2s ease-in-out" : undefined,
      cursor: onClick ? "pointer" : undefined,
      transform: hoverable && isHovered ? "translateY(-2px)" : undefined,
      boxShadow:
        hoverable && isHovered
          ? "3px 6px 12px 0 rgba(0, 0, 0, 0.12), 2px 4px 8px 0 rgba(0, 0, 0, 0.08)"
          : undefined,
      ...props.style,
    }),
    [hoverable, onClick, isHovered, props.style]
  );

  const contentPadding = useMemo(
    () => (noPadding ? { padding: 0 } : {}),
    [noPadding]
  );

  const finalHeaderStyle = useMemo(
    () => ({
      ...(headerBgColor ? { backgroundColor: headerBgColor } : {}),
      ...headerStyle,
    }),
    [headerBgColor, headerStyle]
  );

  const handleMouseEnter = () => {
    if (hoverable) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (hoverable) {
      setIsHovered(false);
    }
  };

  return (
    <Card
      className={className}
      style={cardStyle}
      onClick={(e) => {
        if (e) e.stopPropagation();
        onClick?.(e);
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Render header section */}
      {(header || title || description) && (
        <CardHeader className={headerClassName} style={finalHeaderStyle}>
          {header ? (
            // Custom header content
            typeof header === "string" ? (
              <CardTitle>{header}</CardTitle>
            ) : (
              header
            )
          ) : (
            // Default header with title and description
            <>
              {title && (
                <CardTitle>
                  {typeof title === "string" ? title : title}
                </CardTitle>
              )}
              {description && (
                <CardDescription>
                  {typeof description === "string" ? description : description}
                </CardDescription>
              )}
            </>
          )}
        </CardHeader>
      )}

      {/* Render body/content section */}
      {children && (
        <CardContent
          className={contentClassName}
          style={{ ...contentPadding, ...contentStyle }}
        >
          <div className="py-2">{children}</div>
        </CardContent>
      )}

      {/* Render footer section */}
      {footer && (
        <CardFooter className={footerClassName} style={footerStyle}>
          {typeof footer === "string" ? <span>{footer}</span> : footer}
        </CardFooter>
      )}
    </Card>
  );
};

export default CustomCard;
