import ServerCall from "./ServerCall";

const DashboardController = {
  getRoutes: async () => {
    try {
      const response = await ServerCall.get("/dashboard/routes");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateAgency: async (data) => {
    try {
      
      const response = await ServerCall.post(
        "/dashboard/agency/admin-approve",
        data
      );
      console.log("updateAgency", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateSponsor: async (data) => {
    try {
      console.log("updateSponsor", data);
      const response = await ServerCall.post(
        "/dashboard/sponsor/admin-approve",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateOrganization: async (data) => {
    try {
      console.log("updateOrganization", data);
      const response = await ServerCall.post(
        "/dashboard/organization/admin-approve",
        data
      );
      return response.data
    } catch (error) {
      throw error;
    }
  },
  getChartsData: async (id) => {
    try {
      const response = await ServerCall.get(`/dashboard/challenge/${id}/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
export default DashboardController;
