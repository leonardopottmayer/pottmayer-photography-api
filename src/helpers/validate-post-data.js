const validatePostData = async (data) => {
  let response = "";

  if (!data.title || data.title.trim() == "") {
    response = "Invalid title!";
    return response;
  }

  if (!data.description || data.description.trim() == "") {
    response = "Invalid description!";
    return response;
  }

  if (!data.local || data.local.trim() == "") {
    response = "Invalid local!";
    return response;
  }

  if (!data.date) {
    response = "Invalid date!";
    return response;
  }

  if (!data.tags || data.tags.trim() == "") {
    response = "Invalid tags!";
    return response;
  }

  return "OK";
};

module.exports = validatePostData;
