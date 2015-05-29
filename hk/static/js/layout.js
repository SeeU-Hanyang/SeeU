$(document).ready(function(){
	left_block_blank();
	$(window).resize(function(){
		left_block_blank();
	});

});


function left_block_blank(){
	var window_width = $('body').width();
	var left_blank = (window_width)/2 -450;
	var left_blank_sm = window_width -1000;

	if (window_width > 1100){
		$('#whole_container').css('margin-left',left_blank);
	}
	else if (window_width < 1000){
		$('#whole_container').css('margin-left','0px');
	}
	else{
		$('#whole_container').css('margin-left',left_blank_sm);
	}
}