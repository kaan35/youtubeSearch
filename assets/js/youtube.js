var $ = require("jquery");
import UIkit from 'uikit';
function notification(type, text, timeout, layout = 'topRight') {
	if (timeout === '-1') timeout = 0;
	else timeout = 5000;
	if (type === 'success') status = 'success'
	else if (type === 'error') status = 'danger'
	else status = 'primary'
	UIkit.notification({
		                   message: text,
		                   status : status,
		                   pos    : 'top-right',
		                   timeout: timeout
	                   });
}
function searchVideo() {
	var keyword       = $("#keyword").val();
	var searchResult  = $("#youtubeSearchResult");
	var spinner       = $("#youtubeSearchSpinner");
	var spinnerLayout = '<div class="uk-width-1-1 uk-child-width-1-2 uk-margin-auto uk-text-center uk-margin-medium-top">' +
	                    '<div class="uk-text-primary" uk-spinner="ratio: 3"></div>' +
	                    '</div>';
	var videoCard;
	var videoUrl      = 'https://www.youtube.com/watch?v=';
	if (keyword.trim()) {
		spinner.html(spinnerLayout);
		spinner.fadeIn();
		$.ajax({
			       url    : '/search', type: "POST", data: {keyword: keyword}, cache: false,
			       success: function (data) {
				       try {
					       spinner.hide();
					       spinner.html('');
					       var result = JSON.parse(data);
					       if (result.status === 'error') {
						       notification(result.status, result.response);
					       } else {
						       $.each(result.videos, function (index, video) {
							       videoCard = '<div class="uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s uk-margin" uk-grid>' +
							                   '    <div class="uk-card-media-left uk-cover-container">' +
							                   '        <a href="' + videoUrl + video.id + '" target="_blank">' +
							                   '            <img src="' + video.thumbnail + '" uk-cover>' +
							                   '        </a>' +
							                   '        <canvas width="600" height="400"></canvas>' +
							                   '    </div>' +
							                   '    <div>' +
							                   '        <div class="uk-card-body">\n' +
							                   '            <a href="' + videoUrl + video.id + '" target="_blank"><h3 class="uk-card-title">' + video.title + '</h3></a>' +
							                   '            <p class="uk-text-break">' + video.description + '</p>' +
							                   '        </div>' +
							                   '    </div>' +
							                   '</div>'
							       searchResult.append(videoCard);
						       });
					       }
				       } catch (e) { notification(result.status, result.response); }
			       },
			       error  : function () {
				       notification('error', "An error occurred");
			       }
		       });
	} else {
		notification('error', 'Please enter a keyword');
	}
}
$(document).ready(function () {
	$(document).on("submit", "#youtubeSearchForm", function (e) {
		e.preventDefault();
		searchVideo();
	});
	$(document).on("click", "#youtubeSearchButton", function (e) {
		e.preventDefault();
		searchVideo();
	});
});

