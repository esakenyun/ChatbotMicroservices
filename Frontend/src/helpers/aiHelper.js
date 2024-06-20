import axios from "axios";
import Cookies from "js-cookie";

export async function handlePrompt(text) {
  try {
    const token = Cookies.get("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const requestData = {
      text: text,
    };

    const response = await axios.post(process.env.NEXT_PUBLIC_PROMPT_API_KEY + "/prompt", requestData);
    console.time(response);
    return response;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

export async function handleGenerateResponse(prompt_id, text, reply) {
  try {
    const token = Cookies.get("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const requestData = {
      prompt_id: prompt_id,
      text: text,
      response: reply,
    };

    const response = await axios.post(process.env.NEXT_PUBLIC_RESPONSE_API_KEY + "/response", requestData);

    return response;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

export async function handleGetAllHistory() {
  try {
    const token = Cookies.get("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.get(process.env.NEXT_PUBLIC_RESPONSE_API_KEY + "/allresponses");

    return response.data.data;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}
