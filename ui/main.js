
 function reg() {
  var register = document.getElementById("regbt");

			// capture the response iand store it in the variable

		var request = new XMLHttpRequest();

		request.onreadystatechange = function(){
			if(request.readyState === XMLHttpRequest.DONE){
				if(request.status===200){
					alert('successfully creeated user');
				} else if( request.status===400){
					alert('username user already exists');
				} else if ( request.status===500){
					alert('something went wrong in server');
				}
			}   
   		};


    	//make the request
    	//sumbit name 
		var username = document.getElementById('username').value;
		var names = document.getElementById('names').value;
		var department = document.getElementById('department').value;
		var year = document.getElementById('year').value;
		var email = document.getElementById('email').value;
		var mobile = document.getElementById('mobile').value;
		var password = document.getElementById('password').value
		var intrested = document.getElementById('intrested').value;
    	request.open('POST', "/create-user", true);
    	request.setRequestHeader('Content-Type', 'application/json');
		request.send(JSON.stringify({username:username,names:names,department:department,year:year,email:email,mobile:mobile,password:password,intrested:intrested}));
	};


	function log() {

		var login = document.getElementById("loginbt");

			// capture the response iand store it in the variable

		var request = new XMLHttpRequest();

		request.onreadystatechange = function(){
			if(request.readyState === XMLHttpRequest.DONE){
				if(request.status===200){
					alert('successfully logged in');
				} else if( request.status===400){
					alert('username/passsword is incrt');
				} else if ( request.status===500){
					alert('something went wrong in server');
				}
			}   
   		};

    	//make the request
    	//sumbit name 
		var username = document.getElementById('username').value;
		var password = document.getElementById('password').value;
    	request.open('POST', "/login", true);
    	request.setRequestHeader('Content-Type', 'application/json');
		request.send(JSON.stringify({username:username,password:password}));

	};

