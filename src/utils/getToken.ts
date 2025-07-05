import axios from "axios";
import Cookies from "js-cookie";

const TOKEN_EXPIRY = 30000;

export const fetchToken = async (): Promise<string | undefined> => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_TOKEN_URL}`,
      {
        grant_type: "client_credentials",
        client_id: import.meta.env.VITE_CLIENT_ID,
        client_secret: import.meta.env.VITE_CLIENT_SECRET,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const token = response.data.access_token;

    if (token) {
      Cookies.set("token", token, { expires: 1 / 48 });
      Cookies.set("token_timestamp", Date.now().toString(), {
        expires: 1 / 48,
      });
      return token;
    }
  } catch (error) {
    console.log("Error", error);
  }
};

export const getToken = async (): Promise<string | undefined> => {
  const token = Cookies.get("token");
  const tokenTimestamp = Cookies.get("token_timestamp");

  if (token && tokenTimestamp) {
    const elapsedTime = Date.now() - parseInt(tokenTimestamp, 10);

    if (elapsedTime < TOKEN_EXPIRY) {
      return token;
    }
  }
  return await fetchToken();
};
