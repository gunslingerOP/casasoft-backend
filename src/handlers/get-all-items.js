// Create clients and set shared const values outside of the handler

// Create a DocumentClient that represents the query to get all items
const dynamodb = require("aws-sdk/clients/dynamodb");

const docClient = new dynamodb.DocumentClient();

// Get the DynamoDB table name from environment variables

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
exports.getAllItemsHandler = async (event) => {
  const { body, httpMethod, path } = event;
  if (httpMethod !== "GET") {
    throw new Error(
      `getAllItems only accept GET method, you tried: ${httpMethod}`
    );
  }
  console.log("Works");
  response = {
    statusCode: 200,
    body,
    headers: { "Content-Type": "application/json" },
  };
  return response;
};
