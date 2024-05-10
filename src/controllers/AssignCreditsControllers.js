import ServerCall from "./ServerCall";

const AssignCreditsController = {
  getSponsorAgencyOrganizationInformation: async (rol) => {
    console.log("input :>>", rol)
    try {
      const response = await ServerCall.get(
        `/user/Sponsors/Organization/Agencies/Information/${rol}`
       
      );
      console.log("Desde el controlador", response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  assignCredits: async (data) => {
    try {
      console.log("si llega?", data);
      const response = await ServerCall.put(`/user/assing/credits/to/user`, data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

};

export default AssignCreditsController;
