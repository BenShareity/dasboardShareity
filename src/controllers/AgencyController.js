import ServerCall from "./ServerCall";

const AgencyController = {
  getAll: async (data) => {
    try {
      const response = await ServerCall.get(
        `/agency?page=${data.page}&items=${data.items}`
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getData: async (data) => {
    try {
      const response = await ServerCall.get(`/agency?search=${data.search}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getByUser: async (id) => {
    try {
      const response = await ServerCall.get(`/agency/${id}`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await ServerCall.patch(`/agency/${id}`, data);

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await ServerCall.post(`/agency`, data);
      console.log(response.data.name);

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};

export default AgencyController;
