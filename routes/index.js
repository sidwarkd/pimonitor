var express = require('express');
var router = express.Router();
var stats = require('../pinode_stats.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/stats', function(req, res){
  stats.update(function(err, data){
    res.json(data);
  });
});

module.exports = router;
