var express = require('express');
var mysql = require('mysql');
var router = express.Router();

/* GET store all listing. */
router.get('/', function(req, res, next) {

	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'root',
		database : 'testChemis',
		socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
	});
	
	connection.connect();
	
	connection.query('SELECT chemis.id, chemis.name, SUM(transection.amount) as amount FROM chemis LEFT OUTER JOIN transection ON chemis.id=transection.che_id GROUP BY chemis.id;', function(err, rows, fields) { if (err) throw err;
		
	  // console.log('The solution is: ', rows);
	  res.send(rows);

	});
	
	connection.end();
	
});

// เพิ่มสาร
router.post('/', function(req, res, next){

});


router.put('/', function(req, res, next){

});

router.delete('/', function(req, res, next){

});

module.exports = router;
