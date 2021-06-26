// Create clients and set shared const values outside of the handler

// Create a DocumentClient that represents the query to get all items
const dynamodb = require("aws-sdk/clients/dynamodb");

const jwt_decode = require("jwt-decode");

const helpers = require("../../utility/helpers");
const docClient = new dynamodb.DocumentClient({
  region: "us-east-2",
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.KEY_SECRET,
  convertEmptyValues: true,
});

// Get the DynamoDB table name from environment variables

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
exports.getAllIngredientsHandler = async (event) => {
  const { body, httpMethod, headers, path } = event;
  const token = jwt_decode(headers.Authorization);
  return helpers.okRes(token[`cognito:username`]);
};
