import ServerCall from "./ServerCall";
import { useSessionStore } from "@/stores/session";

const sessionStore = useSessionStore();

const ChallengeController = {
    getAll: async() => {
        try {
            const response = await ServerCall.get("/challenge/get-all");
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getById: async(id) => {
        try {
            const response = await ServerCall.get(`/challenge/get-by-id/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getChallenges: async(id) => {
        try {
            const response = await ServerCall.get(`/challenge/get-challenge/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getChallengesStats: async(id) => {
        try {
            const response = await ServerCall.get(`/stats/challenge/${id}`);
            console.log("response-stats", response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getChallengesUpdate: async(id) => {
        try {
            const response = await ServerCall.get(
                `/user-challenge/get-by-id/dashboard/${id}`
            );
        } catch (error) {
            throw error;
        }
    },
    getUrlChallengeShared: async(id) => {
        try {
            const response = await ServerCall.post("/stats/Challenge/GetShare/", {
                challengeId: id,
                platform: ["twilio"],
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getUrlUserChallengeShared: async(id) => {
        try {
            const response = await ServerCall.post("/stats/UserChallenge/GetShare/", {
                userChallengeId: id,
                platform: ["twilio"],
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createChallenge: async(challengeData) => {
        try {
            const response = await ServerCall.post("/challenge/create", {
                idUsrCreate: challengeData.idUsrCreate,
                name: challengeData.name,
                description: challengeData.description,
                startDate: challengeData.startDate,
                endDate: challengeData.endDate,
                amount: challengeData.amount,
                inviteDonate: challengeData.inviteDonate,
                maxAmount: challengeData.maxAmount,
                lightbeatStartDate: challengeData.lightbeatStartDate,
                lightbeatEndDate: challengeData.lightbeatEndDate,
                lightbeatDesign: challengeData.lightbeatDesign,
                shareMessage: challengeData.shareMessage,
                shareMessageShort: challengeData.shareMessageShort,
                reactions: challengeData.reactions,
                color: challengeData.color,
                badge: challengeData.badge,
                url: challengeData.url,
                qrUrl: challengeData.customQr,
                instructions: challengeData.instructions,
                idOrganization: challengeData.idOrganization,
                idSponsor: challengeData.idSponsor,
                idAnimation: challengeData.idAnimation,
                idResource: challengeData.idResource,
                typeDonation: challengeData.typeDonation,
                typeDonationDescription: challengeData.typeDonationDescription,
                typeDonationIcon: challengeData.typeDonationIcon,
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateChallenge: async(id, challengeData) => {
        try {
            const response = await ServerCall.post(
                `/challenge/update/${id}`,
                challengeData
            );
            console.log("data del update", response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async(challengeData) => {
        try {
            const response = await ServerCall.post(`/challenge`, challengeData);
            console.log("Create challenge swiper", response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async(id, challengeData) => {
        try {
            const response = await ServerCall.put(`/challenge/${id}`, challengeData);
            console.log("Update challenge swiper", response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createThumbnail: async(file) => {
        try {
            const response = await ServerCall.postMedia(
                "/challenge/create-thumbnail",
                file
            ).then((resp) => {
                console.log("CORRECTO: ", resp.data);
                return resp.data;
            });
            return response;
        } catch (error) {
            throw error;
        }
    },
    changeStatus: async(id, status) => {
        try {
            const response = await ServerCall.put(`/challenge/${id}/status`, {
                status: status,
            });
            return response;
        } catch (error) {
            throw error;
        }
    },
    getUserChallenge: async(id) => {
        try {
            const response = await ServerCall.post(`/user-challenge/get`, {
                idUser: id,
                items: 100,
            });
            return response;
        } catch (error) {
            throw error;
        }
    },
    getChallengeDashboard: async(items) => {
        try {
            const response = await ServerCall.get(
                `/dashboard/challenges/paginated?items=${items.items}`
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getData: async(data) => {
        try {
            const response = await ServerCall.get(
                `/organization?search=${data.search}`
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getMyChallengesNumber: async() => {
        try {
            const response = await ServerCall.get(
                `/dashboard/challenges/without/number/assigned`
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // hola
    // hola
    generateQrCode: async(idChallenge) => {
        try {
            const response = await ServerCall.get(
                `/challenge/generate-qr/${idChallenge}`
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    challengeCredits: async(maxAmount) => {
        try {
            const response = await ServerCall.post(
                `/community/administrative_costs/challenge/${maxAmount}`
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default ChallengeController;