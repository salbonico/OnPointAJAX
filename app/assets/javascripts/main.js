var session
window.onload = function(){
	
	attachListeners()
	getSession()

}

function attachListeners(){
	$("img").on('click', function(event) {
  	alert("yes!")
  })
	$("#allCourses").on('click', function(event) {
  	allCourses()
  })
}

function allCourses(){
	$("#title").text("All Courses")
	$('#courseList').empty()
	getSession()
	$.get("/courses.json", function(data) {
		
		data.forEach(function(course){
		$('#courseList').append("<a href='/home' class='course_name'>"+course.name+"</a><p><em>" + course.teacher.name + "</em></p><p class='cdesc'>"+course.description+"</p>")
	
		if (!isEnrolled(course.id)){
			$('#courseList').append("<input type='radio' name='coursetype"+ course.id +"' value='classroom'> Classroom<input checked type='radio' name='coursetype"+ course.id +"' value='online'> Online<br><button id='Enroll"+ course.id +"'>Enroll</button><br><br>")
		} else {$('#courseList').append("<button id='Unenroll"+ course.id +"'>Unenroll</button><br><br>")}
		
		$("#Unenroll"+course.id).on('click', function(event){
		alert(course.id)})

		$("#Enroll"+course.id).on('click', function(event){
		let ctype = $(`input[name="coursetype${course.id}"]:checked`).val()
		$.post('/enrollments/new', {"course_type" : ctype, "course_id" : course.id});
        allCourses()
      
		})

		}) 
		
		
		
		$(".course_name").on('click', function(event){
		event.preventDefault();
		alert("yes!")})
	})



}

function getSession(){
	$.get("/session", function(data) {
		session = data	
	})
}

function isEnrolled(courseid){
	let temp = session.enrollments.find(function(enrollment){return enrollment.course_id === courseid})
  if (temp){return true} else {return false}
}