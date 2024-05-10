import UserController from "@/controllers/UserController";
import { defineStore } from "pinia";
import { io } from "socket.io-client";
export const useSocketStore = defineStore("socketStore", {
    state: () => ({
        socket: null,
    }),
    actions: {
        async socketGet(body) {

            try {
                let response = await UserController.getMyProfile()
                if (response) {
                    let idSteve = null;
                    idSteve = response.rol == "admin" ? 1 : response.id
                    this.socket = io(`${import.meta.env.VITE_API_HOST}/messages`, {
                        auth: {
                            userId: idSteve
                        }
                    })
                    console.log(this.socket);
                    this.socket.on('connect', () => {
                        console.log('Sokect store', this.socket.connected);
                    })
                }
            } catch (error) {
                throw error
            }
        },
        destroyAlert(ms) {
            setTimeout(() => {
                this.status = false;
            }, ms);
        },
    },
});