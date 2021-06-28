const AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-2",
});

const dynamodb = new AWS.DynamoDB.DocumentClient({
  accessKeyId: process.env.keyId,
  secretAccessKey: process.env.secret,
});
const jwt_decode = require("jwt-decode");
const helpers = require("../../utility/helpers");

exports.deleteItemHandler = async (event) => {
  let { headers, pathParameters, body } = event;
  body = JSON.parse(body);
  if (!headers.Authorization) return helpers.errRes("Please provide a token!");
  const token = jwt_decode(headers.Authorization);
  if (!body.title || !body.image)
    return helpers.errRes("Add a new title and image or keep the old ones");
  if (!token["cognito:username"])
    return helpers.errRes("Please provide an id token!");
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
  if (Item.Items.length == 0) return helpers.errRes("No such ingredient found");

  const deleteParams = {
    TableName: "Ingredients",
    Key: {
      IngredientId: id,
      UserName: token["cognito:username"],
    },
  };

  let deletedItem = await dynamodb
    .delete(deleteParams, function (err, data) {
      if (err) {
        console.error(
          "Unable to delete item. Error JSON:",
          JSON.stringify(err, null, 2)
        );
      } else {
        console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        return data;
      }
    })
    .promise();

  return helpers.okRes(deletedItem);
};
