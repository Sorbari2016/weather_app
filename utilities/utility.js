// UTILITY METHODS
import { format } from "date-fns";

const formatDate = (date, dateFormat) => {
  if (!(date instanceof Date)) throw new Error("Provide a valid date");
  return format(date, dateFormat);
};

export { formatDate };
