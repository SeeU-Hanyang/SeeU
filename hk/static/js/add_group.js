var xhr;
var showloader = false;

$(document).ready(function(){

	$loader = '<a class="list-group-item disabled" href="#" style="text-align:center; background-color:#fff; width: 329px; border-top-left-radius: 0px; border-top-right-radius: 0px; margin-top: -2px;"><img src="static/res/img/loading.gif" alt="loading" style="width:60px; height:auto;"/></a>';
	
	$("#search_name_input").keydown(function(e){
		if (e.which == 13){
			e.preventDefault();
			$("#member_search_btn").trigger('click');
		}
	});

	$("#member_search_btn").click(function(){
		var search_string = $("#search_name_input").val();
		showloader = true;
		if(xhr){
			xhr.abort();
		}
		if(showloader){
			$(".found-tobe-member").html($loader);
		}
		xhr = $.ajax({
			url:'/find_member',
			type: 'POST',
			data: {"search_string": search_string},
			success: function(response){
				$(".found-tobe-member").html(response);
				 hide_all_email();
			},
	        error: function(){
	          console.log("error");
	        },
	        complete:function(){
	          console.log('complete');
	          showloader = false;
	        }
		});
	});

	$('body').on('click', '.add_member_btn', function(){
		var userid = $(this).attr('num');
		if($(".user-item[num="+userid+"]").length == 0){
			var name = $(this).parent().find('.user-name').text();
			var srcImg = $(this).parent().find('img').attr('src');
			addUserCheckbox(userid, name, srcImg);
		}
	});

	$("body").on('click', '.inline-item', function(){
		$tInner = $(this).find('div');
		var userid = $tInner.attr('num');
		$("input[value="+userid+"]").prop('checked', false);
		$(this).remove();
	});




});


function validate_add_group_form() {

	var name = $("#group_name_input").val();
	var len = $(".user-item").length;
	result = true;

	if (name == "") {
		$("#name_input_warning").show();
		result = false;
	}

	else
		$("#name_input_warning").hide();

	if (len <1) {
		$("#member_input_warning").show();
		result = false;
	}

	else
		$("#member_input_warning").hide();

	return result;

}




function addUserCheckbox(val, name, srcImg){

	var outerDiv = document.createElement('div');
	outerDiv.className = 'col-xs-4 inline-item';

	var closeIcon = document.createElement('img');
	closeIcon.className = 'inline-item-close';
	closeIcon.setAttribute('src', '/../static/res/img/close.png');
	closeIcon.setAttribute('alt', 'close-icon');
	closeIcon.setAttribute('height', '15px');
	closeIcon.setAttribute('width', '15px');

	var checkbox = document.createElement('input');
	checkbox.setAttribute('type', 'checkbox');
	checkbox.setAttribute('name', 'selected');
	checkbox.setAttribute('value', val);
	checkbox.setAttribute('class', 'add_member_checkbox');

	var innerDiv = document.createElement('div');
	innerDiv.className = 'user-item';
	innerDiv.id = 'result-'+val;
	innerDiv.setAttribute('num', val);

	var profileImg = document.createElement('img');
	profileImg.src = srcImg;
	profileImg.setAttribute('height', 40);

	var label = document.createElement('label');
	label.setAttribute('for', 'result-'+val);
	label.innerHTML = name;

	innerDiv.appendChild(profileImg);
	innerDiv.appendChild(label);
	outerDiv.appendChild(checkbox);
	outerDiv.appendChild(innerDiv);
	outerDiv.appendChild(closeIcon);
	var selectedList = document.getElementById("selected-users");
	selectedList.insertBefore(outerDiv, selectedList.childNodes[0]);

	checkbox.checked = true;

}

function hide_all_email() {
	var email = "";

	for (var i = 0; i<$(".user_email").length; i++)
	{
		email = $($(".user_email")[i]).text();
		$($(".user_email")[i]).text(hide_email(email));
	}
}

function hide_email(email) {
	var idx = email.indexOf('@');
	
	if(idx < 0)
		return email;
	
	var front = email.substr(0,idx);
	var back = email.substr(idx);

	if(front.length > 5) {
		front = front.substr(0,5) + "***";
		return front + back;
	}

	else
		return email;



}