import UtilityController from "@/controllers/UtilityController";
import { useRouter } from "vue-router";

const UtilityMethods = {
  cleanPhone: (phone) => {
    return phone.replaceAll(/[^\d]/g, "");
  },

  formatDate: (date) => {
    let dateF = new Date(date);
    return dateF.toISOString().split("T")[0];
  },

  verifyMedia: async (media, location) => {
    console.log("media", media);
    const host = import.meta.env.VITE_IMAGE_HOST;
    console.log('host',host);
    return !(typeof media === "string")
      ? await UtilityController.upload({
          file: media,
          name: Date.now(),
          location: location,
        })
      : media.slice(host.length, media.length);
  },
};

export default UtilityMethods;
