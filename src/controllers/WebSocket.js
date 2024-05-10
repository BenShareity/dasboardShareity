// import { io } from "socket.io-client";
// import { watchEffect } from "vue";
// import UserController from '@/controllers/UserController';
// let profile = {}
// let idSteve = 1
// watchEffect(async() => {
//     const res = await UserController.getMyProfile()
//     profile = res
//     console.log(profile);
// })

// export const socket = io(`${import.meta.env.VITE_API_HOST}/messages`, {
//     auth: {
//         userId: idSteve
//     }
// })
// socket.on('connect', () => {
//     console.log('Sokect Conectado', socket.connected);
// })