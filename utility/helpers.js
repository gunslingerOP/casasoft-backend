exports.errRes = (err, statusCode = 400) => {
  err = JSON.stringify(err);
  let response = {
    isBase64Encoded: false,
    headers: {
      "Content-Type": "application/json",
    },
    body: err,
    statusCode,
  };
  return response;
};

exports.okRes = (data, statusCode = 200) => {
  data = JSON.stringify(data);
  let response = {
    isBase64Encoded: false,
    headers: {
      "Content-Type": "application/json",
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
