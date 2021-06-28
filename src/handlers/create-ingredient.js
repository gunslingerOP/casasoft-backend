const { keyId, secret } = require("../../keys.env");
var randomstring = require("randomstring");

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

exports.createItemHandler = async (event) => {
  const token = jwt_decode(headers.Authorization);
  if (!token["cognito:username"])
    return helpers.errRes("Please provide an id token!");

  let uniqueId = randomstring.generate();

  let { body, headers } = event;
  body = JSON.parse(body);

  if (!body.title || !body.image)
    return helpers.errRes("Please provide a title and image ");

  var params = {
    TableName: "Ingredients",
    Item: {
      IngredientId: uniqueId,
      Title: body.title,
      Image: body.image,
      UserName: token["cognito:username"],
    },
  };

  let createdItem = await dynamodb
    .put(params, function (err, data) {
      if (err) {
        console.error(
          "Unable to add item. Error JSON:",
          JSON.stringify(err, null, 2)
        );
      } else {
        return data;
      }
    })
    .promise();
  return helpers.okRes(createdItem);
};
