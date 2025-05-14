
import axios from "axios";

const API_KEY = process.env.BETTERSTACK_API_KEY!;
const BASE_URL = "https://betteruptime.com/api/v2";

export async function createMonitor(name: string, url: string) {
  return axios.post(`${BASE_URL}/monitors`, {
    monitor_type: "status",
    url,
    name
  }, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    }
  });
}
