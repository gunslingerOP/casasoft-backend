exports.errRes = (err, statusCode = 400) => {
  err = JSON.stringify({ status: "Failed", err });
  let response = {
    isBase64Encoded: false,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET, PUT",
    },
    body: err,
    statusCode,
  };
  return response;
};

exports.okRes = (data, statusCode = 200) => {
  data = JSON.stringify({ status: "Success", data });
  let response = {
    isBase64Encoded: false,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET, PUT",
    },
    body: data,
    statusCode,
  };
  return response;
};

exports.paginate = (p = 1, s = 10) => {
  let take = Number(s);
  let skip = s * (p - 1);
  return { take, skip };
};
