import React from "react";

const DateFormat = ({date}) => {
    const data = new Date(date);
  // Using Intl.DateTimeFormat
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(data);

  return <div>{formattedDate}</div>;
};

export default DateFormat;