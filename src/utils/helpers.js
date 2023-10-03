export function formatTimestamp(timestamp) {
  const date = new Date(timestamp * 1000); // Convert to milliseconds

  const options = {
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = date.toLocaleDateString("en-US", options).split(" ");

  return {
    day: formattedDate[0],
    time: formattedDate[1],
    unit: formattedDate[2],
  };
}

export function isNightTime() {
  const currentTime = new Date();

  // currentTime.setHours(20);

  const currentHour = currentTime.getHours();
  return currentHour >= 18 || currentHour < 6;
}
