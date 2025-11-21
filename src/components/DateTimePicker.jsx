import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * DateTimePicker Component
 * A flexible component that can render 3 types of pickers:
 * 1. Normal date picker (type="date")
 * 2. Date range picker (type="date-range")
 * 3. Normal time picker (type="time")
 *
 * @param {string} type - Type of picker: "date" | "date-range" | "time"
 * @param {string} title - Label/title for the picker
 * @param {string} placeholder - Placeholder text
 * @param {boolean} disabled - Whether the picker is disabled
 * @param {string} className - Custom CSS classes
 * @param {object} style - Custom inline styles
 * @param {Date|object} value - Current value (Date for date/time, {from, to} for date-range)
 * @param {function} onChange - Callback when value changes
 * @param {Date} minDate - Minimum selectable date
 * @param {Date} maxDate - Maximum selectable date (defaults to today if not provided)
 * @param {string} dateFormat - Date format string (default: "PPP" for date, "PP" for range)
 * @param {boolean} disableFuture - Whether to disable future dates/times (default: true)
 * @param {string} captionLayout - Calendar caption layout: "dropdown"
 */
const DateTimePicker = ({
  type = "date",
  title,
  placeholder,
  disabled = false,
  className = "",
  style = {},
  value,
  onChange,
  minDate,
  maxDate,
  dateFormat = null,
  disableFuture = true,
  captionLayout = "dropdown",
}) => {
  // All hooks must be called unconditionally at the top level
  const [open, setOpen] = React.useState(false);
  const [timeString, setTimeString] = React.useState(() => {
    if (type === "time" && value instanceof Date) {
      return format(value, "HH:mm");
    }
    return "";
  });

  // Time picker state (always initialized, only used when type === "time")
  const [selectedHour, setSelectedHour] = React.useState(() => {
    if (type === "time" && timeString) {
      const [h] = timeString.split(":");
      const hour24 = parseInt(h || "0");
      // Convert 24-hour to 12-hour format
      if (hour24 === 0) return "12";
      if (hour24 > 12) return String(hour24 - 12).padStart(2, "0");
      return String(hour24).padStart(2, "0");
    }
    return "12";
  });

  const [selectedMinute, setSelectedMinute] = React.useState(() => {
    if (type === "time" && timeString) {
      const [, m] = timeString.split(":");
      return m || "00";
    }
    return "00";
  });

  const [selectedPeriod, setSelectedPeriod] = React.useState(() => {
    if (type === "time" && timeString) {
      const [h] = timeString.split(":");
      const hour24 = parseInt(h || "0");
      return hour24 >= 12 ? "PM" : "AM";
    }
    return "AM";
  });

  // Update hour/minute/period when timeString changes (for time picker)
  React.useEffect(() => {
    if (type === "time" && timeString) {
      const [h, m] = timeString.split(":");
      const hour24 = parseInt(h || "0");
      // Convert 24-hour to 12-hour format
      if (hour24 === 0) {
        setSelectedHour("12");
        setSelectedPeriod("AM");
      } else if (hour24 === 12) {
        setSelectedHour("12");
        setSelectedPeriod("PM");
      } else if (hour24 > 12) {
        setSelectedHour(String(hour24 - 12).padStart(2, "0"));
        setSelectedPeriod("PM");
      } else {
        setSelectedHour(String(hour24).padStart(2, "0"));
        setSelectedPeriod("AM");
      }
      setSelectedMinute(m || "00");
    }
  }, [type, timeString]);

  // Default date formats
  const defaultDateFormat = type === "date-range" ? "PP" : "PPP";
  const formatString = dateFormat || defaultDateFormat;

  // Get today's date for maxDate if disableFuture is true
  const today = React.useMemo(() => {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return date;
  }, []);

  const effectiveMaxDate = React.useMemo(() => {
    if (maxDate) return maxDate;
    if (disableFuture) return today;
    return undefined;
  }, [maxDate, disableFuture, today]);

  // Update time string when value changes (for time picker)
  React.useEffect(() => {
    if (type === "time" && value instanceof Date) {
      setTimeString(format(value, "HH:mm"));
    }
  }, [type, value]);

  // Handle date picker
  if (type === "date") {
    const dateValue = value instanceof Date ? value : undefined;

    return (
      <div className={cn("flex flex-col space-y-2", className)} style={style}>
        {title && (
          <Label
            className={cn("text-sm font-medium", disabled && "opacity-50")}
          >
            {title}
          </Label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateValue && "text-muted-foreground",
                disabled && "cursor-not-allowed opacity-50"
              )}
              disabled={disabled}
              style={style}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateValue
                ? format(dateValue, formatString)
                : placeholder || "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={(date) => {
                if (!disabled) {
                  onChange?.(date);
                  setOpen(false);
                }
              }}
              disabled={disabled}
              captionLayout={captionLayout}
              {...(minDate && { fromDate: minDate })}
              {...(effectiveMaxDate && { toDate: effectiveMaxDate })}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  // Handle date range picker
  if (type === "date-range") {
    const rangeValue =
      value && typeof value === "object"
        ? value
        : { from: undefined, to: undefined };

    return (
      <div className={cn("flex flex-col space-y-2", className)} style={style}>
        {title && (
          <Label
            className={cn("text-sm font-medium", disabled && "opacity-50")}
          >
            {title}
          </Label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !rangeValue?.from && "text-muted-foreground",
                disabled && "cursor-not-allowed opacity-50"
              )}
              disabled={disabled}
              style={style}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {rangeValue?.from ? (
                rangeValue.to ? (
                  <>
                    {format(rangeValue.from, formatString)} -{" "}
                    {format(rangeValue.to, formatString)}
                  </>
                ) : (
                  format(rangeValue.from, formatString)
                )
              ) : (
                placeholder || "Pick a date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={rangeValue}
              onSelect={(range) => {
                if (!disabled) {
                  onChange?.(range);
                  if (range?.from && range?.to) {
                    setOpen(false);
                  }
                }
              }}
              disabled={disabled}
              numberOfMonths={2}
              captionLayout={captionLayout}
              {...(minDate && { fromDate: minDate })}
              {...(effectiveMaxDate && { toDate: effectiveMaxDate })}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  // Handle time picker
  if (type === "time") {
    const now = new Date();
    const currentHour24 = now.getHours();
    const currentMinute = now.getMinutes();
    const currentPeriod = currentHour24 >= 12 ? "PM" : "AM";

    // Generate hours (1-12)
    const hours = Array.from({ length: 12 }, (_, i) =>
      String(i + 1).padStart(2, "0")
    );

    // Generate minutes (0-59)
    const minutes = Array.from({ length: 60 }, (_, i) =>
      String(i).padStart(2, "0")
    );

    // Convert 12-hour to 24-hour format
    const convertTo24Hour = (hour12, period) => {
      const h = parseInt(hour12);
      if (period === "AM") {
        return h === 12 ? 0 : h;
      } else {
        return h === 12 ? 12 : h + 12;
      }
    };

    // Check if a time is in the future
    const isTimeInFuture = (hour12, minute, period) => {
      if (!disableFuture) return false;
      const hour24 = convertTo24Hour(hour12, period);
      if (hour24 > currentHour24) return true;
      if (hour24 === currentHour24 && parseInt(minute) > currentMinute)
        return true;
      return false;
    };

    const isHourDisabled = (hour) => {
      if (!disableFuture) return false;
      const hour24 = convertTo24Hour(hour, selectedPeriod);
      if (selectedPeriod === currentPeriod) {
        if (selectedPeriod === "AM" && currentPeriod === "AM") {
          return hour24 > currentHour24;
        }
        if (selectedPeriod === "PM" && currentPeriod === "PM") {
          return hour24 > currentHour24;
        }
      }
      // If period is different, check based on period
      if (selectedPeriod === "PM" && currentPeriod === "AM") {
        return false; // PM is always after AM
      }
      if (selectedPeriod === "AM" && currentPeriod === "PM") {
        return true; // AM is always before PM (next day)
      }
      return false;
    };

    const isMinuteDisabled = (minute, hour) => {
      if (!disableFuture) return false;
      return isTimeInFuture(hour, minute, selectedPeriod);
    };

    const isPeriodDisabled = (period) => {
      if (!disableFuture) return false;
      if (period === "PM" && currentPeriod === "AM") return false;
      if (period === "AM" && currentPeriod === "PM") return true; // Can't select AM if it's already PM
      // If same period, check if any valid time exists
      if (period === currentPeriod) {
        const hour24 = convertTo24Hour(selectedHour, period);
        if (hour24 < currentHour24) return false;
        if (hour24 === currentHour24) {
          // Check if there are any valid minutes
          return parseInt(selectedMinute) > currentMinute;
        }
      }
      return false;
    };

    const updateTime = (hour, minute, period) => {
      const hour24 = convertTo24Hour(hour, period);
      const timeStr = `${String(hour24).padStart(2, "0")}:${minute}`;
      setTimeString(timeStr);

      const baseDate = value instanceof Date ? value : new Date();
      const newDate = new Date(baseDate);
      newDate.setHours(hour24, parseInt(minute) || 0, 0, 0);

      // Check if future time and validate
      if (disableFuture && isTimeInFuture(hour, minute, period)) {
        // Show warning or prevent selection - for now, we'll allow it but validate
        // You can add a warning message here if needed
      }

      onChange?.(newDate);
    };

    const handleHourChange = (hour) => {
      setSelectedHour(hour);
      updateTime(hour, selectedMinute, selectedPeriod);
    };

    const handleMinuteChange = (minute) => {
      setSelectedMinute(minute);
      updateTime(selectedHour, minute, selectedPeriod);
    };

    const handlePeriodChange = (period) => {
      setSelectedPeriod(period);
      updateTime(selectedHour, selectedMinute, period);
    };

    return (
      <div className={cn("flex flex-col space-y-2", className)} style={style}>
        {title && (
          <Label
            className={cn("text-sm font-medium", disabled && "opacity-50")}
          >
            {title}
          </Label>
        )}
        <div className="relative flex items-center gap-2">
          <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" />
          <div className="flex-1 flex items-center gap-2 pl-10">
            <Select
              value={selectedHour}
              onValueChange={handleHourChange}
              disabled={disabled}
            >
              <SelectTrigger className="flex-1 h-10">
                <SelectValue placeholder="HH" />
              </SelectTrigger>
              <SelectContent>
                {hours.map((hour) => (
                  <SelectItem
                    key={hour}
                    value={hour}
                    disabled={isHourDisabled(hour)}
                  >
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">:</span>
            <Select
              value={selectedMinute}
              onValueChange={handleMinuteChange}
              disabled={disabled}
            >
              <SelectTrigger className="flex-1 h-10">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent>
                {minutes.map((minute) => (
                  <SelectItem
                    key={minute}
                    value={minute}
                    disabled={isMinuteDisabled(minute, selectedHour)}
                  >
                    {minute}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedPeriod}
              onValueChange={handlePeriodChange}
              disabled={disabled}
            >
              <SelectTrigger className="w-20 h-10">
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM" disabled={isPeriodDisabled("AM")}>
                  AM
                </SelectItem>
                <SelectItem value="PM" disabled={isPeriodDisabled("PM")}>
                  PM
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DateTimePicker;
