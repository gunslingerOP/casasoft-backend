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
  const { title, image } = body;

  var params = {
    TableName: "Ingredients",
    ExpressionAttributeValues: {
      ":u": token.username,
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

  var updateParams = {
    TableName: "Ingredients",
    Key: {
      IngredientId: Item.Items[0].IngredientId,
      UserName: token.username,
    },
    UpdateExpression: "set Title = :r, Image=:i",
    ExpressionAttributeValues: {
      ":r": body.title,
      ":i": body.image,
    },
    ReturnValues: "UPDATED_NEW",
  };

  let updatedItem = await dynamodb
    .update(updateParams, function (err, data) {
      if (err) {
        console.error(
          "Unable to update item. Error JSON:",
          JSON.stringify(err, null, 2)
        );
      } else {
        return data;
      }
    })
    .promise();

  return helpers.okRes(updatedItem);
};
