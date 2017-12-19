module.exports = (req) => {
  return req.session.userId ? true : false;
};