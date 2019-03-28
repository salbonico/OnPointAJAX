window.onload = function(){
	attachListeners()

}

function attachListeners(){
	$("img").on('click', function(event) {
  	alert("yes!")
  })
}