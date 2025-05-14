
import axios from "axios";

const API_KEY = process.env.BETTERSTACK_API_KEY!;
const BASE_URL = "https://betteruptime.com/api/v2";

export async function createIncident(name: string, message: string) {
  return axios.post(`${BASE_URL}/incidents`, {
    name,
    message
  }, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    }
  });
}
