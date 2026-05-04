export const scheduleTime = async (token, dateTime) => {
  const response = await fetch("http://127.0.0.1:8000/scheduling/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: "Test User",
      date: dateTime.toISOString(),
    }),
  });

  return response;
};
