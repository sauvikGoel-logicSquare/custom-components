import { cn } from "@/lib/utils";

const CustomInputGroup = ({
  children, // required, JSX elements to be displayed in the group
  columns = 1, // optional, number of items per line: 1 or 2 or 3 (default: 1), can add support for more columns in the future if required
  gap = "default", // optional, gap between items: sm, default, lg (default: "default")
  className = "", // optional, any extra classes / styling to be added to the group container
}) => {
  // Determine grid columns based on the columns prop
  const getGridColumns = () => {
    switch (columns) {
      case 3:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 1:
        return "grid-cols-1";
      default:
        return "grid-cols-1 md:grid-cols-2";
    }
  };

  // Determine gap size
  const getGapSize = () => {
    switch (gap) {
      case "sm":
        return "gap-3";
      case "lg":
        return "gap-8";
      default:
        return "gap-6";
    }
  };

  return (
    <div
      className={cn(
        "grid w-full mb-2",
        getGridColumns(),
        getGapSize(),
        className
      )}
    >
      {children}
    </div>
  );
};

export default CustomInputGroup;
