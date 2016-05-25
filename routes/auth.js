var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET home page. */
router.post('/login', function(req, res, next) {
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'root',
		database : 'testChemis',
		socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
	});
	

	if(typeof req.body.username !== 'undefined'){
		if(typeof req.body.password !== 'undefined'){
			connection.query('SELECT * FROM users WHERE username = "'+req.body.username+'" AND password = "'+req.body.password+'"', function(err, rows, fields) { if (err) throw err;
				if(rows.length == 0){
					res.send({status:false, message:"Username Or Password isn't valid"})
				}else{
					if(rows.length !== 0){
					if(rows){
						res.send({status:"success", message:"Login Success", data:rows})
					}
				}
				}
			});
		}
	}
	connection.end()
});

module.exports = router;
