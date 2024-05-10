import { data } from "autoprefixer";
import ServerCall from "./ServerCall";

const TwilioController = {
  getAllNumberLink: async () => {
    try {
      const response = await ServerCall.get("/number-link");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  putNumberLink: async (id, data) => {
    try {
      const response = await ServerCall.put(`/number-link/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  newNumber: async (data) =>{
    try {
      const response = await ServerCall.post(`/number-link`, data)
      return response.data
    } catch (error) {
      throw error
    }
  }
};

export default TwilioController;
