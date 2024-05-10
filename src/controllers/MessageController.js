import ServerCall from "./ServerCall";

const MessageController = {
  sendComunity: async (id,input) => {
    let data = {
      messageCommunity: input
    }
  
    delete input.challenge;
    console.log("input", input);
    try {
      const response = await ServerCall.post(
        `/community/community-create-message/${id}`, data
      );
      /* console.log("response send-comunity:", response.data); */
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  SmsComunnuty: async(id,data) => {
    try {
      const response = await ServerCall.post(`/community/community-sms/${id}`, data)
      return response.data
      
    } catch (error) {
      
      throw error
    }
  }
};

export default MessageController;
