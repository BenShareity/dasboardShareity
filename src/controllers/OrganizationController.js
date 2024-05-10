import ServerCall from "./ServerCall";

const OrganizationController = {
  getAll: async () => {
    try {
      const response = await ServerCall.get("/organization/get");
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getDashboard: async () => {
    try {
      const response = await ServerCall.get("/dashboard/organizations");
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // getDashboard: async (data) => {
  //   //COMENTARIO
  //   try {
  //     const response = await ServerCall.get(
  //       `/organization?page=${data?.page || 1}&items=${data?.items || 1000}`
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // },
  // getData: async (data) => {
  //   try {
  //     const response = await ServerCall.get(
  //       `/organization?search=${data.search}`
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // },

  getById: async (id) => {
    try {
      const response = await ServerCall.get(`/organization/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  create: async (input) => {
    try {
      const response = await ServerCall.post(`/organization`, input);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await ServerCall.patch(`/organization/${id}`, data);
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

export default OrganizationController;
