$(document).ready(function(){

	var not_sending = true;

	$("#signup_btn").click(function(){
		var name = $("#signup_name_input").val();
		var email = $("#signup_email_input").val();
		var pw = $("#signup_pw_input").val();
		var pw_check = $("#signup_pw_input_check").val();
		

		if(valid_check(name, email, pw, pw_check) && not_sending) {
			not_sending = false;
			$.ajax({
		        url: '/signup',
		        type:'POST',
		        data: {"email" : email,
		               "password" : pw,
		           	   "name" : name},
		        success:function(response){
		        	if(response == 'error') {
		        		alert("alert what?????");
		        		not_sending = true;
		        	}
		        	else {

		        		$("#signup_modal").modal('hide');
		        		alert("Alert what number 2");
		        		not_sending = true;
		        	}
		          	console.log("success");
		        },
		        error: function(){
		          console.log("error");
		          not_sending = true;
		        },
		        complete:function(){
		          console.log('complete');
		          // window.location.reload();
		        }

		    });
		}
	   
	});



});

function valid_check(name, email, pw, pw_check){
	var result = true;

	if(name=="") {
		$("#user_name_input_warning").show();
		result = false;
	}
	else
		$("#user_name_input_warning").hide();

	if(email=="" || email.indexOf('@') < 0 || email.indexOf('.') < 0) {
		$("#email_input_warning").show();
		result = false;
	}
	else
		$("#email_input_warning").hide();


	if(pw.length <4 || pw.length >16) {
		$("#pw_input_warning").show();
		result = false;
	}
	else
		$("#pw_input_warning").hide();

	if(pw!=pw_check) {
		$("#pw_check_input_warning").show();
		result = false;
	}
	else
		$("#pw_check_input_warning").hide();

	return result;

}