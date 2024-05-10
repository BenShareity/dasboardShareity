import ServerCall from "./ServerCall";

const MessagesController = {
  
  getAllDashboard: async () => {
    try {
      const response = await ServerCall.get("/message");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  create: async (input) => {
    try {
      const data = {
        title: input.title,
        description: input.description,
      };

      const response = await ServerCall.post("/message", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  update: async (id, input) => {
    try {
      const data = {
        title: input.title,
        description: input.description,
      };

      const response = await ServerCall.put(`/message/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  sendMasive: async (data) => {
    try {
      const response = await ServerCall.post(`/message/send-massive`, data)
      return response.data
    } catch (error) {
      throw error
      
    }
  },
  messageCredits: async(data)=>{
    try {
     const response  = await ServerCall.post(`/community/administrative_costs/massive/message/${data}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
};

export default MessagesController;
