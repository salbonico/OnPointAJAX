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
			$('#courseList').append("<a href='' class = 'course_name' id='course_name"+course.id+"'>"+course.name+"</a><br><a href='' id='teacher_id"+course.id+"'><em>" + course.teacher.name + "</em></a><p class='cdesc'>"+course.description+"</p>")
				
			$("#course_name"+course.id).on('click', function(event){
				event.preventDefault();
				console.log(course.id)
			})

			$("#teacher_id"+course.id).on('click', function(event){
			event.preventDefault();
			console.log(course.teacher.id)
			})


			if (!isEnrolled(course.id)){
				$('#courseList').append("<div id='coursetype"+ course.id +"'> <input type='radio' name='coursetype"+ course.id +"' value='classroom'> Classroom <input checked type='radio' name='coursetype"+ course.id +"' value='online'> Online<br><button id='Enroll"+ course.id +"'>Enroll</button><br><br></div>")}
			else {$('#courseList').append("<button id='Unenroll"+ course.id +"'>Unenroll</button><br><br>")}
				
			$("#Unenroll"+course.id).on('click', function(event){
				alert(course.id)})

			$("#Enroll"+course.id).on('click', function(event){
				let ctype = $(`input[name="coursetype${course.id}"]:checked`).val()
				let posting = $.post('/enrollments/new', {"course_type" : ctype, "course_id" : course.id});
		        posting.done(function (data){
		        	$("#coursetype"+course.id).replaceWith("<button id='Unenroll"+ course.id +"'>Unenroll</button><br><br>")
		      	})
	    	})
    	}) 
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