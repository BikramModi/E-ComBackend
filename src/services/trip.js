import Trip from "../models/trips.js";

export const createTrip = async (tripData) => {
  // tripData.user = userID
  const trip = await Trip.create(tripData);
  return trip;
};
