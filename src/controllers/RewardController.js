import ServerCall from "./ServerCall";
import { useCookies } from "vue3-cookies";
import { useSessionStore } from "@/stores/session";

const sessionStore = useSessionStore();
const cookies = useCookies();

const RewardController = {
  getAll: async () => {
    try {
      const response = await ServerCall.get("/reward/list-rewards");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAllDashboard: async () => {
    try {
      const response = await ServerCall.get("/dashboard/rewards-messages");
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
        type: input.type,
        point: input.point,
        imgBgReward: input.imgBgReward,
        imgBadReward: input.imgBadReward,
        userId: input.userId,
        stock: input.stock
      };

      const response = await ServerCall.post("/reward/create", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  giveReward: async (input) => {
    try {
      const data = {
        idUser: input.idUsr,
        idReward: input.idReward,
        idChallenge: input.idChallenge
      };
      const response = await ServerCall.post("/reward/obtain-reward", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  rewardCredits: async (reward) =>{
    try {
      const response = await ServerCall.post(`/community/administrative_costs/${reward}`)
      return response.data
    } catch (error) {

      throw error
    }
  }
};

export default RewardController;
