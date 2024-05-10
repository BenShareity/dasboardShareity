import ServerCall from "./ServerCall";

const ChallengeDownloadController = {
     downloandChallenge:  async (id, user)=>{
        try {
            const response = await ServerCall.post(`/challenge/download/${id}`, user)
            
            return response.data
        } catch (error) {
            
            throw error
        }
    },
    downloadUserChallenge: async (BUCKECT_URL)=>{
        console.log("y esto que",BUCKECT_URL);
        try {
            const response = await ServerCall.get(`/media/${BUCKECT_URL}`)
            return response.data
        } catch (error) {
            throw error
        }
    }
    
}
export default ChallengeDownloadController;