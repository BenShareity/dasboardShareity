//Validar que solo acepte texto
export const regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
//Validar que solo acepte email
export const regexEmail = /^[a-zA-Z0-9.!#$%&’+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
//Validar que solo acepte nuemros
export const regexNumber = /^[1-9]\d*(\.\d+)?$/;
export const regexPassword = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;