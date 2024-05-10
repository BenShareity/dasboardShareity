import ServerCall from "./ServerCall";

const ProfileController = {
  updateDataUser: async (data) => {
    try {
      const response = await ServerCall.post("/user/update/", {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        bio: data.bio,
        email: data.email,
        gender: data.gender,
      });
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  updatePassUser: async (data) => {
    try {
      const response = await ServerCall.put("/auth/password/", {
        password: data.newPassword,
      });
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  userAvatar: async (data) => {
    let fileData = new FormData();
    fileData.append("file", data.file);
    fileData.append("id", data.id);
    try {
      const response = await ServerCall.post("/user/update-photo", fileData);
      console.log("response", response.data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default ProfileController;
