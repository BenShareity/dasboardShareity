import ServerCall from "./ServerCall";

const SponsorController = {
  getAll: async () => {
    try {
      const response = await ServerCall.get("/sponsor/get");
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getAllDashboard: async (boolean) => {
    try {
      const response = await ServerCall.get(
        `/dashboard/sponsors?approve=${boolean}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // getAllDashboard: async (data) => {
  //   try {
  //     const response = await ServerCall.get(
  //       `/sponsor?page=${data?.page}&items=${data?.items}`
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // },

  // getData: async (data) => {
  //   try {
  //     const response = await ServerCall.get(`/sponsor?search=${data.search}`);
  //     return response.data;
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // },

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
      const response = await ServerCall.post("/sponsor", input);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await ServerCall.patch(`/sponsor/${id}`, data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await ServerCall.delete(`/organization/get/${id}`);
      return response.data;
    } catch (error) {}
  },
};

export default SponsorController;
