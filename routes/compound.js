var express = require('express');
var mysql = require('mysql');
var router = express.Router();

/* GET store all listing. */

var compound_stock_table = "compound_stock";
var compound_transection_table = "compound_transection";


router.get('/', function(req, res, next) {
	console.dir(compound_stock_table);

	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'root',
		database : 'testChemis',
		socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
	});
	
	connection.connect();
	
	connection.query('SELECT compound_stock.id, compound_stock.name, SUM(compound_transection.amount) as amount FROM compound_stock LEFT OUTER JOIN compound_transection ON compound_stock.id=compound_transection.che_id GROUP BY compound_stock.id;', function(err, rows, fields) { if (err) throw err;
		
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



router.post('/order', function(req, res, next) {
	/*
		JSON FOR THIS METHOD
		{
			"che_id": INT,
			"amount": DOUBLE,
			"user_id": INT
		}
		*/
		

		var connection = mysql.createConnection({
			host     : 'localhost',
			user     : 'root',
			password : 'root',
			database : 'testChemis',
			socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
		});
		
		connection.connect();
		
		connection.query("SELECT * FROM compound_stock WHERE id = '"+req.body.che_id+"'", function(err, rows, fields) { if (err) throw err;
		  	// console.log('The solution is: ', rows);
		  	if(rows.length == 0){
		  		//NO HAVE In TABLE

		  		connection.query("SELECT * FROM chemis WHERE id = '"+req.body.che_id+"'", function(err, rows, fields) { if (err) throw err;
		  			// res.send(rows[0].name);

		  			var set = {id:req.body.che_id, name:rows[0].name}
		  			connection.query('INSERT INTO compound_stock SET ?', set, function(err, result) {
		  				if (err) console.dir( err );

		  				var input = {che_id:req.body.che_id, amount:-req.body.amount ,user_id:req.body.user_id}
		  				connection.query('INSERT INTO transection SET ?', input, function(err, result) {
		  					if (err) console.dir( err );


		  					var input = {che_id:req.body.che_id, amount:req.body.amount ,user_id:req.body.user_id}
		  					connection.query('INSERT INTO compound_transection SET ?', input, function(err, result) {
		  						if (err) console.dir( err );
		  						
		  						res.send("END")
		  						connection.end();
		  					});

		  				});
		  			});


		  		});
		  	}else{
		  		var input = {che_id:req.body.che_id, amount:-req.body.amount ,user_id:req.body.user_id}
		  		connection.query('INSERT INTO transection SET ?', input, function(err, result) {
		  			if (err) console.dir( err );


		  			var input2 = {che_id:req.body.che_id, amount:req.body.amount ,user_id:req.body.user_id}
		  			connection.query('INSERT INTO compound_transection SET ?', input2, function(err, result) {
		  				if (err) console.dir( err );
		  				
		  				res.send("END EIEI")
		  				connection.end();
		  			});

		  		});
		  	}
	});
});


module.exports = router;
