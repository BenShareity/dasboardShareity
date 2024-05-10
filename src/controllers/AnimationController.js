import ServerCall from "./ServerCall";
import UserController from "./UserController";

const profile = UserController.getMyProfile();
const AnimationController = {
 getAll: async () => {
  try {
    const response = await ServerCall.get(`/animation/get`);
    return response.data;
  } catch (error) {
    throw error;
  }
 },


  getByUser: async (id) => {
    try {
      const response = await ServerCall.get(`/animation/getByUser/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  create: async (animationData) => {
    try {
      const response = await ServerCall.post(
        `/animation/create`,
        animationData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAnimation: async (id, animationData) => {
    try {
      const response = await ServerCall.put(`/animation/${id}`, animationData);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default AnimationController;
