"use client";

import * as React from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  format,
  isBefore,
  isAfter,
  isToday,
  setMonth,
  setYear,
  getYear,
  getMonth,
} from "date-fns";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Calendar = React.forwardRef(
  (
    {
      className,
      mode = "single",
      selected,
      onSelect,
      disabled,
      fromDate,
      toDate,
      numberOfMonths = 1,
      captionLayout = "buttons",
      ...props
    },
    ref
  ) => {
    // Filter out props that shouldn't be passed to DOM
    const {
      defaultMonth: _defaultMonth,
      initialFocus: _initialFocus,
      ...domProps
    } = props;
    const [currentMonth, setCurrentMonth] = React.useState(() => {
      if (mode === "range" && selected?.from) {
        return startOfMonth(selected.from);
      }
      if (selected instanceof Date) {
        return startOfMonth(selected);
      }
      return startOfMonth(new Date());
    });

    const isDateDisabled = (date) => {
      if (disabled === true) return true;
      if (typeof disabled === "function") return disabled(date);
      if (fromDate && isBefore(date, fromDate)) return true;
      if (toDate && isAfter(date, toDate)) return true;
      return false;
    };

    const isDateSelected = (date) => {
      if (!selected) return false;
      if (mode === "single") {
        return selected instanceof Date && isSameDay(date, selected);
      }
      if (mode === "range") {
        if (!selected.from) return false;
        if (selected.from && selected.to) {
          return (
            isSameDay(date, selected.from) ||
            isSameDay(date, selected.to) ||
            (isAfter(date, selected.from) && isBefore(date, selected.to))
          );
        }
        return isSameDay(date, selected.from);
      }
      return false;
    };

    const isDateInRange = (date) => {
      if (mode !== "range" || !selected?.from || !selected?.to) return false;
      return isAfter(date, selected.from) && isBefore(date, selected.to);
    };

    const isRangeStart = (date) => {
      return (
        mode === "range" && selected?.from && isSameDay(date, selected.from)
      );
    };

    const isRangeEnd = (date) => {
      return mode === "range" && selected?.to && isSameDay(date, selected.to);
    };

    const handleDateClick = (date) => {
      if (isDateDisabled(date)) return;

      if (mode === "single") {
        onSelect?.(date);
      } else if (mode === "range") {
        if (!selected?.from || (selected.from && selected.to)) {
          onSelect?.({ from: date, to: undefined });
        } else if (selected.from && !selected.to) {
          if (isBefore(date, selected.from)) {
            onSelect?.({ from: date, to: selected.from });
          } else {
            onSelect?.({ from: selected.from, to: date });
          }
        }
      }
    };

    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const previousMonth = () => {
      setCurrentMonth(subMonths(currentMonth, 1));
    };

    const nextMonth = () => {
      setCurrentMonth(addMonths(currentMonth, 1));
    };

    const handleMonthChange = (monthIndex, targetMonth) => {
      const newMonth = setMonth(targetMonth, parseInt(monthIndex));
      setCurrentMonth(newMonth);
    };

    const handleYearChange = (year, targetMonth) => {
      const newMonth = setYear(targetMonth, parseInt(year));
      setCurrentMonth(newMonth);
    };

    // Generate month options
    const monthOptions = Array.from({ length: 12 }, (_, i) => ({
      value: String(i),
      label: format(setMonth(new Date(), i), "MMMM"),
    }));

    // Generate year options (current year ± 10 years)
    const currentYear = getYear(new Date());
    const yearOptions = Array.from({ length: 21 }, (_, i) => {
      const year = currentYear - 10 + i;
      return {
        value: String(year),
        label: String(year),
      };
    });

    const months = [];
    for (let i = 0; i < numberOfMonths; i++) {
      const month = addMonths(currentMonth, i);
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
      const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
      const monthDays = eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd,
      });

      months.push({ month, days: monthDays });
    }

    return (
      <div ref={ref} className={cn("p-3", className)} {...domProps}>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0">
          {months.map(({ month, days: monthDays }, monthIndex) => (
            <div key={monthIndex} className="space-y-4">
              <div className="flex justify-center pt-1 relative items-center">
                {captionLayout === "dropdown" ? (
                  <div className="flex items-center gap-2">
                    <Select
                      value={String(getMonth(month))}
                      onValueChange={(value) => handleMonthChange(value, month)}
                    >
                      <SelectTrigger className="w-[140px] h-7 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {monthOptions.map((monthOption) => (
                          <SelectItem
                            key={monthOption.value}
                            value={monthOption.value}
                          >
                            {monthOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={String(getYear(month))}
                      onValueChange={(value) => handleYearChange(value, month)}
                    >
                      <SelectTrigger className="w-[100px] h-7 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {yearOptions.map((yearOption) => (
                          <SelectItem
                            key={yearOption.value}
                            value={yearOption.value}
                          >
                            {yearOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={previousMonth}
                      className="absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="text-sm font-medium">
                      {format(month, "MMMM yyyy")}
                    </div>
                    <button
                      type="button"
                      onClick={nextMonth}
                      className="absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
              <div className="w-full border-collapse space-y-1">
                <div className="flex">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  {Array.from({ length: Math.ceil(monthDays.length / 7) }).map(
                    (_, weekIndex) => (
                      <div key={weekIndex} className="flex w-full mt-2">
                        {monthDays
                          .slice(weekIndex * 7, (weekIndex + 1) * 7)
                          .map((day) => {
                            const isOutsideMonth = !isSameMonth(day, month);
                            const isSelected = isDateSelected(day);
                            const isInRange = isDateInRange(day);
                            const isStart = isRangeStart(day);
                            const isEnd = isRangeEnd(day);
                            const isDisabled = isDateDisabled(day);
                            const isTodayDate = isToday(day);

                            return (
                              <div
                                key={day.toISOString()}
                                className={cn(
                                  "h-9 w-9 text-center text-sm p-0 relative",
                                  isStart && "first:rounded-l-md",
                                  isEnd && "last:rounded-r-md",
                                  isInRange && "bg-accent",
                                  isSelected &&
                                    "bg-primary text-primary-foreground"
                                )}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleDateClick(day)}
                                  disabled={isDisabled}
                                  className={cn(
                                    "h-9 w-9 p-0 font-normal inline-flex items-center justify-center rounded-md text-sm transition-colors",
                                    "hover:bg-accent hover:text-accent-foreground",
                                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                                    "disabled:pointer-events-none disabled:opacity-50",
                                    isSelected &&
                                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                    isTodayDate &&
                                      !isSelected &&
                                      "bg-accent text-accent-foreground",
                                    isOutsideMonth &&
                                      "text-muted-foreground opacity-50",
                                    isDisabled &&
                                      "text-muted-foreground opacity-50"
                                  )}
                                >
                                  {format(day, "d")}
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
Calendar.displayName = "Calendar";

export { Calendar };
