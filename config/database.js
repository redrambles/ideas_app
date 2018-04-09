if(process.env.NODE_ENV == 'production'){
  module.exports = {
    mongoURI: 'mongodb://redrambles:cookie@ds117878.mlab.com:17878/ideas-prod'
  };
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/ideas-dev'
  };
}