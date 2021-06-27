const { keyId, secret } = require("../../keys.env");
const AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-2",
});

const dynamodb = new AWS.DynamoDB.DocumentClient({
  accessKeyId: keyId,
  secretAccessKey: secret,
});
const jwt_decode = require("jwt-decode");
const helpers = require("../../utility/helpers");

// Get the DynamoDB table name from environment variables

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
exports.getAllIngredientsHandler = async (event) => {
  const { headers } = event;
  if (!headers.Authorization) return helpers.errRes("Please provide a token!");
  const token = jwt_decode(headers.Authorization);
  var params = {
    TableName: "Ingredients",
    IndexName: "indexByUser",
    ProjectionExpression: "Title, IngredientId, Image,UserName",

    ExpressionAttributeValues: {
      ":u": token.username,
    },
    KeyConditionExpression: "UserName = :u ",
  };

  let items = await dynamodb
    .query(params, function (err, data) {
      if (err) {
        console.error(err);
      } else {
        console.log(data);
        return data;
      }
    })
    .promise();

  return helpers.okRes(items);
};
