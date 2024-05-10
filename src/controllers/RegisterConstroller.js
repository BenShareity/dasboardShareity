import ServerCall from "./ServerCall";
import json from "/assets/data/country-codes.json";
import axios from "axios";
import { useCookies } from "vue3-cookies";

const RegisterController = {
  getCountries: () => json.countries,
  sendCode: async (input) => {
    try {
      let ph = input.replace(/[^\d]/g, "");
      const response = await ServerCall.post("/user/send-message", {
        phoneNumber: input,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  register: async (input) => {
    try {
      let bodyData = {
        firstName: input.firstName,
        lastName: input.lastName,
        rol: input.rol == "admin" ? "admin" : input.rol.label.split(" ")[0],
        phone: input.phoneRegister,
        email: input.email,
        code: input.code,
        password: input.pass,
        promotional: input.promotional,
      };
      if (input.rol.id == 1) {
        bodyData.organization = input.organization;
        bodyData.organization.logo = input.logo;
      } else if (input.rol.id == 2) {
        bodyData.sponsor = input.sponsor;
        bodyData.sponsor.logo = input.logo;
      }
      const response = await ServerCall.post("/user/register", bodyData);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error.response.data;
    }
  },
  registerOrganization: async (input) => {
    console.log('registerOrganization :>> ', input);
    try {
      let bodyData = {
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phoneRegister,
        email: input.email,
        code: input.code,
        password: input.pass,
        promotional: input.promotional,
        logo : input.logo
      };
      const response = await ServerCall.post("/user/register/organization", bodyData);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error.response.data;
    }
  },
  registerSponsor: async (input) => {
    console.log('registerSponsor :>> ', input);
    try {
      let bodyData = {
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phoneRegister,
        email: input.email,
        code: input.code,
        password: input.pass,
        promotional: input.promotional,
        logo : input.logo
      };
      const response = await ServerCall.post("/user/register/sponsor", bodyData);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error.response.data;
    }
  },
  verifyEmail: async (input) => {
    console.log("input :>> ", input.email);
    try {
      const response = await ServerCall.get(`/user/email/${input.email}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error.response.data;
    }
  },
  verifyPhone: async (phone) => {
    try {
      const response = await ServerCall.get(`/user/number/phone/${phone}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error.response.data;
    }
  },
  sendEmail: async (input) => {
    console.log("sendEmail :>> ", input);
    try {
      const response = await ServerCall.post(`/auth/send-email-validation`, {
        email: input.email,
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error.response.data;
    }
  },
  authProfile: async () => {
    const { cookies } = useCookies();
    const config = {
      headers: {},
    };
    config.headers["Authorization"] = `Bearer ${cookies.get("accessToken")}`;
    return new Promise((resolve, reject) => {
      axios
        .get(import.meta.env.VITE_API_HOST + "/auth/validate", config)
        .then((response) => {
          console.log("response :>> ", response);
          resolve(response);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },
};

export default RegisterController;
