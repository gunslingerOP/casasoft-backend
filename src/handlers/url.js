const { keyId, secret } = require("../../keys.env");
var randomstring = require("randomstring");

const AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-2",
});
const jwt_decode = require("jwt-decode");
const helpers = require("../../utility/helpers");

const bucketName = "clientimages2";
const s3 = new AWS.S3({
  accessKeyId: keyId,
  secretAccessKey: secret,
});

exports.uploadUrlHandler = async (event) => {
  let uniqueId = randomstring.generate();

  const params = {
    Bucket: bucketName,
    Key: uniqueId,
    Expires: 400,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);

  return helpers.okRes(uploadURL);
};
