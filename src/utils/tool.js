export const dataFormat= (date)=>{
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(date);
      return formattedDate
}

export const formatTime = (time) => {
  if (!time) return null;

  // Convert to Date object if it's not already
  const date = new Date(time);
  
  // Format to 12-hour format with am/pm
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
};