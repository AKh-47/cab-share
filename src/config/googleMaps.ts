type API = "distancematrix" | "directions";

export default async (api: API, query: any) => {
  let queryString: string = "";
  Object.keys(query).forEach((key: string) => {
    queryString += `${key}=${query[key]}&`;
  });
  const baseUrl = `https://maps.googleapis.com/maps/api/${api}/json?&${queryString}key=${process.env.MAPS_API_KEY}`;
  //   Example = https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key=YOUR_API_KEY
};

// https://developers.google.com/maps/documentation/distance-matrix/overview
// https://developers.google.com/maps/documentation/directions/start
