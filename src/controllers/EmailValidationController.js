
import ServerCall from "./ServerCall";

const SendEmailController = {
    
    sendEmail: async (input) => {
        console.log("sendEmail :>> ", input);
        try {
          const response = await ServerCall.post(`/auth/send-email-validation`, {
            email: input.email,
          });
          return response.data;
        } catch (error) {
          console.log(error);
          throw error.response.data;
        }
      }
    }
  
  export default SendEmailController;
  