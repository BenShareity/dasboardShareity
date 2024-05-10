import ServerCall from "./ServerCall";

const FaqController = {
  getAll: async () => {
    try {
      const response = await ServerCall.get("/dashboard/faq");
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getAllDashboard: async () => {
    try {
      const response = await ServerCall.get("/dashboard/sponsors");
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await ServerCall.get(`/sponsor/get/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getDashboard: async (id) => {
    try {
      const response = await ServerCall.get(`/sponsor/get-dashboard/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getByUserId: async (id) => {
    try {
      const response = await ServerCall.get(`/sponsor/getByUser/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  create: async (input) => {
    try {
      const response = await ServerCall.post(`/dashboard/faq`, input);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await ServerCall.put(`/dashboard/faq/${id}`, data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await ServerCall.delete(`/dashboard/faq/${id}`);
      return response.data;
    } catch (error) {}
  },
};

export default FaqController;
