const validateUserData = async (data) => {
  let response = "";

  if (!data.name || data.name.trim() == "") {
    response = "Invalid name!";
    return response;
  }

  if (!data.username || data.username.trim() == "") {
    response = "Invalid username!";
    return response;
  }

  if (!data.email || data.email.trim() == "" || !data.email.includes("@")) {
    response = "Invalid email!";
    return response;
  }

  if (
    !data.password ||
    data.password.trim() == "" ||
    data.password.length < 8
  ) {
    response = "Invalid password!";
    return response;
  }

  if (!data.confirmpassword || data.confirmpassword.trim() == "") {
    response = "Invalid password confirmation!";
    return response;
  }

  if (data.password != data.confirmpassword) {
    response = "Passwords don't match!";
    return response;
  }

  return "OK";
};

module.exports = validateUserData;
