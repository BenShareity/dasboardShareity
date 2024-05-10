import { useSessionStore } from "@/stores/session";
import ServerCall from "./ServerCall";

const UserController = {
    getAll: async() => {
        try {
            const response = await ServerCall.get(`/dashboard/users`);
            return response.data;
        } catch (error) {
            console.log(error);
            throw error
        }
    },
    getMyProfile: async() => {
        try {
            const response = await ServerCall.get(`/auth/profile`);

            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    getSwayScore: async(id) => {
        try {
            const response = await ServerCall.get(`/user/sway-score/${id}`);
            return response.data;
        } catch (error) {}
    },
    delete: async(id) => {
        try {
            const response = await ServerCall.delete(`/user/${id}`);
            return response.data;
        } catch (error) {}
    },
    userAction: async(nickname) => {
        try {
            const response = await ServerCall.get(
                `/user/get-by-nickname/${nickname}`
            );
            // console.log(response.data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    getUserName: async(username) => {
        console.log("user", username);
        try {
            const response = await ServerCall.get(
                `/user/get-by-username/${username}`
            );
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    getCredit: async(idUser) => {
        try {
            const response = await ServerCall.get(`/user/credit/${idUser}`);
            console.log("desde el controlador", response.data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    getCreditHistory: async(idUser, items) => {
        try {
            const response = await ServerCall.post(`/user/get/history`, {
                page: 1,
                items,
                idUser: idUser,
            });
            console.log("Desde el controlador", response.data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    // hagamos como que esto nunca existio caballeros JAJAJA
    addCredits: async(idUser, token, amount) => {
        try {
            console.log("si llega?", idUser, token, amount);
            const response = await ServerCall.post(`/user/credit/execute`, {
                amount,
                id: idUser,
                type: "credit",
                transaction: token,
                method_payment: "credit",
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    blockUser: async(idUser, status) => {
        try {
            const response = await ServerCall.get(
                `/user/block/${idUser}/${status ? 1 : 0}`
            );
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    blockUserChallenge: async(id, status) => {
        try {
            const response = await ServerCall.post(`/user-challenge/set-status`, {
                id,
                status,
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    adminApprove: async() => {
        try {
            const response = await ServerCall.get(`/user/admin/approve/sc`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default UserController;