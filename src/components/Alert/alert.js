export const fetchAlerts = async (token) => {
  try {
    const response = await fetch("http://localhost:5000/alerts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const alertData = await response.json();
    return alertData.alerts;
  } catch (error) {
    console.error("Error fetching alerts:", error);
    throw error;
  }
};



