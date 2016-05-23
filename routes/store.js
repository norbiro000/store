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


// เพิ่มสาร
router.post('/request', function(req, res, next){
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'root',
		database : 'testChemis',
		socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
	});

	if(typeof req.body !== 'undefined'){
		if(typeof req.body.user_id !== 'undefined'){
			//User Id
			var user_id = req.body.user_id;
			if(typeof req.body.che_list !== 'undefined'){
				var che_list = req.body.che_list;
				//Insert To request Table
				connection.query('INSERT INTO request (req_time, user_id) VALUES ("'+Date()+'", "'+user_id+'");', function(err, rows, fields) { if (err) throw err;
					for(var i=0;i<che_list.length;i++){
						//Insert each chemis
						connection.query('INSERT INTO request_detail (req_id, che_id, amount) VALUES ("'+rows.insertId+'", "'+che_list[i]["che_id"]+'","'+che_list[i]["amount"]+'");', function(err, rows, fields) { if (err) throw err;
							
						});
					}

					res.json({status: "Success"});
					connection.end()
				});
			}

		}	
	}
});


// เพิ่มสาร
router.get('/request', function(req, res, next){
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'root',
		database : 'testChemis',
		socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
	});


	connection.query('SELECT * FROM request as r LEFT JOIN users as u ON r.user_id = u.id;', function(err, rows, fields) { if (err) throw err;
		res.send(rows);

	});
	connection.end()

});

// เพิ่มสาร
router.get('/request/approve/:requestID', function(req, res, next){
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'root',
		database : 'testChemis',
		socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
	});

	connection.query('SELECT * FROM request WHERE req_id = "'+req.params.requestID+'"', function(err, request, fields) { if (err) throw err;
		if(typeof req.params.requestID !== 'undefined'){
			connection.query('SELECT * FROM request_detail WHERE req_id = "'+req.params.requestID+'"', function(err, rows, fields) { if (err) throw err;
				var i;
				for(i=0; i<rows.length;i++){
					asdf(res, rows[i], request[0].user_id, req.params.requestID, function(){
						
					});
				}
				if(i == rows.length){
					res.send('')
				}
			});
		}
		connection.end()
	});

});

function asdf(res, chemis, user_id, req_id, done){

	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'root',
		database : 'testChemis',
		socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
	});


		connection.query("SELECT * FROM compound_stock WHERE id = '"+chemis.che_id+"'", function(err, rows, fields) { if (err) throw err;

		  	if(rows.length == 0){
		  		// NO HAVE In TABLE
		  		
		  		connection.query("SELECT * FROM chemis WHERE id = '"+chemis.che_id+"'", function(err, rows, fields) { if (err) throw err;
		  			// res.send(rows[0].name);

		  			var set = {id: chemis.che_id, name:rows[0].name}
		  			connection.query('INSERT INTO compound_stock SET ?', set, function(err, result) {
		  				if (err) console.dir( err );

		  				var input = {che_id:chemis.che_id, amount:-chemis.amount ,user_id: user_id, req_id:req_id}
		  				connection.query('INSERT INTO transection SET ?', input, function(err, result) {
		  					if (err) console.dir( err );


		  					var input = {che_id:chemis.che_id, amount:chemis.amount ,user_id:user_id, req_id:req_id}
		  					connection.query('INSERT INTO compound_transection SET ?', input, function(err, result) {
		  						if (err) console.dir( err );
		  						
		  						done()
		  					});

		  				});
		  			});


		  		});

		  	}else{
		  		var input = {che_id:chemis.che_id, amount:-chemis.amount ,user_id:user_id, req_id:req_id}
		  		connection.query('INSERT INTO transection SET ?', input, function(err, result) {
		  			if (err) console.dir( err );


		  			var input2 = {che_id:chemis.che_id, amount:chemis.amount ,user_id:user_id, req_id:req_id}
		  			connection.query('INSERT INTO compound_transection SET ?', input2, function(err, result) {
		  				if (err) console.dir( err );
		  				
		  				done()
		  			});

		  		});
		  	}
	});
	
}




module.exports = router;
