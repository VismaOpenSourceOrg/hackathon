(function () {
	fetch('/auth', {
		credentials: 'same-origin',
		headers: {
			accept: 'application/json'
		}
	}).then(function (response) { return response.json();})
	.then(function (response) {
		console.log(response);

		authPicture.src=response.pictureUrl;
		authPicture.style.display = 'block';
	})

}());