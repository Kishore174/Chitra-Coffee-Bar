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

export const calculateDuration = (inTime, outTime) => {
  if (!inTime || !outTime) return null;

  const startTime = new Date(inTime);
  const endTime = new Date(outTime);

  // Calculate difference in milliseconds
  const diffMs = endTime - startTime;

  // Convert to hours and minutes
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes };
};

export const formatDuration = (duration) => {
  if (!duration) return null;

  const { hours, minutes } = duration;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};