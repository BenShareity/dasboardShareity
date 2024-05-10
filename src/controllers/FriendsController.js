import ServerCall from "./ServerCall";


const FriendsController = {
    getFriends: async() => {
        try {
            const response = await ServerCall.get(`/dashboard/friends`)
            return response.data
        } catch (error) {
            throw error
        }
    }
}

export default FriendsController