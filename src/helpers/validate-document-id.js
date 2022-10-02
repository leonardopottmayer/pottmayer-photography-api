const { isValidObjectId } = require("mongoose");

const validateDocumentId = async (documentId) => {
  let response = "";

  if (!documentId || documentId == "" || !isValidObjectId(documentId)) {
    response = "Invalid id!";
    return response;
  }

  return "OK";
};

module.exports = validateDocumentId;
