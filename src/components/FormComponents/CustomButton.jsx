import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const CustomButton = ({
  text, // required, the text to display on the button
  btnSize = "default", // optional, button size: sm, default, lg, icon
  variant = "default", // optional, button variant: default, ghost, outline, secondary
  className = "", // optional, any extra classes / styling to be added to the button element
  disabled = false, // optional, used to disable the button
  loading = false, // optional, shows a loading spinner and disables the button
  onClick, // optional, the function to handle the click event
  type = "button", // optional, button type: button, submit, reset
  leftIcon, // optional, icon to display on the left side of the text
  rightIcon, // optional, icon to display on the right side of the text
  fullWidth = false, // optional, makes the button take full width
  title, // optional, used to display the tooltip text of the button element (on hover)
  ...props // any other props to be passed to the button element
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      size={btnSize}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      className={cn(
        "gap-2", // space between icon and text
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}

      {/* Left Icon */}
      {!loading && leftIcon && (
        <span className="inline-flex items-center">{leftIcon}</span>
      )}

      {/* Button Text */}
      {text && <span>{text}</span>}

      {/* Right Icon */}
      {!loading && rightIcon && (
        <span className="inline-flex items-center">{rightIcon}</span>
      )}
    </Button>
  );
};

export default CustomButton;
