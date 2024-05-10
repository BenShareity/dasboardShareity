import ServerCall from "./ServerCall";

const UtilityController = {
  upload: async (input) => {
    let fileData = new FormData();
    fileData.append("file", input.file);
    fileData.append("name", input.name);
    fileData.append("location", input.location);
    try {
      const response = await ServerCall.post("/uploader/create", fileData);
      console.log("response-upload", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  downloadMedia: async (url) => {
    try {
      const response = await ServerCall.getData(url);
      return _imageEncode(response.data, url.split(".").pop().toLowerCase());
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

function _imageEncode(arrayBuffer, type) {
  let u8 = new Uint8Array(arrayBuffer);
  let b64encoded = btoa(
    [].reduce.call(
      new Uint8Array(arrayBuffer),
      function (p, c) {
        return p + String.fromCharCode(c);
      },
      ""
    )
  );
  let mimetype = "image/" + type;
  return "data:" + mimetype + ";base64," + b64encoded;
}

export default UtilityController;
