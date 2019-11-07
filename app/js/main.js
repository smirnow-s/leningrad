$(document).ready(function () {

	if (document.cookie === 'remember=true') {
		$('.js-checkbox')[0].checked = true;
		// console.log('test');
	}

	$('.js-submit').on('click', function(event) {
		var data = $(this).parents('.js-form');
		var checkbox = data.find('.js-checkbox');

		if (checkbox[0].checked) {
			document.cookie = "remember=true; max-age=3600";
		} else {
			document.cookie = "remember=true; max-age=0";
		}

	});

});
