var express = require('express');
var router = express.Router();

router.get('/',(req,res,next)=>{
	res.send('List App Api');
});
module.exports = router;

// TODO
// - make list router
