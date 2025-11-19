import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    style={{
      backgroundColor: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      boxShadow:
        "2px 4px 8px 0 rgba(0, 0, 0, 0.08), 1px 2px 4px 0 rgba(0, 0, 0, 0.05)",
      overflow: "hidden",
      ...props.style,
    }}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      padding: "28px 32px",
      backgroundColor: "#f8fafc",
      ...props.style,
    }}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    style={{
      fontSize: "24px",
      fontWeight: "700",
      lineHeight: "1.2",
      color: "#0f172a",
      ...props.style,
    }}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    style={{
      fontSize: "14px",
      color: "#64748b",
      lineHeight: "1.4",
      ...props.style,
    }}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0", className)}
    style={{
      padding: "32px",
      backgroundColor: "#ffffff",
      ...props.style,
    }}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    style={{
      display: "flex",
      alignItems: "center",
      padding: "24px",
      paddingTop: "0",
      borderTop: "1px solid #f1f5f9",
      gap: "12px",
      ...props.style,
    }}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
