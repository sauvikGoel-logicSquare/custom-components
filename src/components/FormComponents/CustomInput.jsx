import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateRandomId } from "@/utils/helper-methods";
import { Button } from "../ui/button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const CustomInput = ({
  id = generateRandomId(), // optional, if not provided, a random id will be generated, used for the input element and the label element
  label, // optional, if not provided, the label will not be displayed
  className = "", // optional, any extra classes / styling to be added to the input element
  placeholder, // optional, if not provided, the placeholder will not be displayed
  type = "text", // or textarea, password, email, number..., optional, default is text
  value, // required, if not provided, the input will not be displayed, used for the input element
  error, // optional, used to display the error message, and red border on the input element
  title, // optional, used to display the tooltip text of the label element (on hover)
  disabled = false, // optional, used to disable the input
  rows = 4, // optional, the number of rows for the textarea
  onChange, // required, the function to handle the change of the input
  isRequired = false, // optional, used to display the required asterisk, and required validation
  onKeyDown, // optional, used to handle the key down event
  helperText, // optional, used to display the helper text below the input
  leftIcon, // optional, used to display the left icon in the input
  rightIcon, // optional, used to display the right icon in the input
  onLeftIconClick, // optional, used to handle the click event of the left icon
  onRightIconClick, // optional, used to handle the click event of the right icon
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2 w-full">
      {/* Label */}
      {label ? (
        <Label
          htmlFor={id}
          className={cn(
            "text-sm font-medium text-heading-dark",
            disabled && "opacity-50",
            error && "text-destructive"
          )}
          title={title}
        >
          {label}
          {isRequired ? <span className="text-destructive ml-1">*</span> : null}
        </Label>
      ) : null}

      {/* Input/Textarea Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && type !== "textarea" && (
          <div
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10",
              onLeftIconClick && "cursor-pointer hover:text-foreground",
              disabled && "opacity-50"
            )}
            onClick={!disabled && onLeftIconClick ? onLeftIconClick : undefined}
          >
            {leftIcon}
          </div>
        )}

        {/* Textarea */}
        {type === "textarea" ? (
          <Textarea
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              "text-base rounded-[10px] resize-none",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            disabled={disabled}
            rows={rows}
            onKeyDown={onKeyDown}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error ? `${id}-error` : helperText ? `${id}-helper` : undefined
            }
          />
        ) : (
          /* Regular Input */
          <Input
            id={id}
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              "h-12 text-base rounded-[10px]",
              error && "border-destructive focus-visible:ring-destructive",
              leftIcon && "pl-10",
              (rightIcon || type === "password") && "pr-10",
              className
            )}
            disabled={disabled}
            onKeyDown={onKeyDown}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error ? `${id}-error` : helperText ? `${id}-helper` : undefined
            }
          />
        )}

        {/* Right Icon or Password Toggle */}
        {type === "password" ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        ) : rightIcon && type !== "textarea" ? (
          <div
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10",
              onRightIconClick && "cursor-pointer hover:text-foreground",
              disabled && "opacity-50"
            )}
            onClick={
              !disabled && onRightIconClick ? onRightIconClick : undefined
            }
          >
            {rightIcon}
          </div>
        ) : null}
      </div>

      {/* Error Message */}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {/* Helper Text */}
      {!error && helperText ? (
        <p id={`${id}-helper`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default CustomInput;
