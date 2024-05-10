import ServerCall from "./ServerCall";
const PledgesController = {
    getAll: async () =>{
        try {
            const response = await ServerCall.get(`/pledges/list`)
            return response.data
        } catch (error) {
            throw error
        }
    },
    approvePledges: async (data) =>{
        try {
            const response = await ServerCall.post('/pledges/approveDeny',data)
            return response.data 
        } catch (error) {
            throw error
        }
    }
}
export default PledgesController