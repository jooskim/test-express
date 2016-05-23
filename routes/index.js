var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var sess = req.session;
  if(sess.views) {
    sess.views++;
  } else {
    sess.views = 1;
  }

  res.render('index', { title: 'Express', count: sess.views });
});

module.exports = router;
