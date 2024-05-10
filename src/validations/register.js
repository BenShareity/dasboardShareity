import { regexEmail } from "@/utility/regex";

export const registerValidation = (form, rol) => {
  console.log("hola", form);
  let errorfirstName = null;
  let errorlastName = null;
  let errorEmail = null;
  let errorOrganization = null;
  let errorPass = null;
  let errorpassVerify = null;

  if (!form.firstName) {
    errorfirstName = "Required field";
  }
  if (!form.lastName) {
    errorlastName = "Required field";
  }
  if (!form.email) {
    errorEmail = "Required field";
  } else if (!regexEmail.test(form.email.trim())) {
    errorEmail = "Invalid email";
  }
  if (!form.organizationName) {
    errorOrganization = "Required field";
  }
  if (!form.pass) {
    errorPass = "Required field";
  } 
   if (!form.passVerify) {
    error.passVerify = "Required field";
  } else if (form.pass !== form.passVerify) {
    error.passVerify = "Passwords do not match";
  }

  //   } else if (!regexPassword.test(form.password.trim())) {
  //     error.password =
  //       "Verify that your password is 8 characters long containing only characters, numeric digits, lower case and capital letters";
  //   } else if (!form.confirmPassword) {
  //     error.confirmPassword = "Required field";
  //   } else if (form.password !== form.confirmPassword) {
  //     error.confirmPassword = "Passwords do not match";
  //   }
  return {errorfirstName,errorlastName,errorEmail,errorOrganization,errorPass,errorpassVerify};
};
