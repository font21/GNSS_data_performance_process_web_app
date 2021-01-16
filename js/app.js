// Message if JavaScript is connected and running
    console.log('JavaScript connected.');

// The Document Ready Event
$(document).ready(function(){

	// Message if jQuery is connected and running
	console.log('jQuery connected.');
});

$(document).ready(function(){
    $('input[type="radio"]').click(function(){
        var inputValue = $(this).attr("value");
        var targetBox = $("." + inputValue);
        $(".box").not(targetBox).hide();
        $(targetBox).show();
    });
});

