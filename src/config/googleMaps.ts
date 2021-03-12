type API = "distancematrix" | "directions" | "other";

export default async (api: API) => {
  const baseUrl = `https://maps.googleapis.com/maps/api/${api}/json?&key=${process.env.MAPS_API_KEY}`;
};
