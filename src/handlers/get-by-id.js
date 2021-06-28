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

exports.modifyIngredientHandler = async (event) => {
  let { headers, pathParameters, body } = event;
  body = JSON.parse(body);
  if (!headers.Authorization) return helpers.errRes("Please provide a token!");
  const token = jwt_decode(headers.Authorization);
  if (!body.title || !body.image)
    return helpers.errRes("Add a new title and image or keep the old ones");

  // Get id from pathParameters from APIGateway because of `/{id}` at template.yml
  const { id } = pathParameters;

  var params = {
    TableName: "Ingredients",
    ExpressionAttributeValues: {
      ":u": token["cognito:username"],
      ":i": id,
    },
    KeyConditionExpression: "UserName = :u and IngredientId = :i ",
  };
  const Item = await dynamodb
    .query(params, function (err, data) {
      if (err) console.log(err);
      else {
        return data;
      }
    })
    .promise();

  return helpers.okRes(Item);
};
