var session
window.onload = function(){
	
	attachListeners()
	getSession()

}

function attachListeners(){
	
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
				showCourse(course.id)
			})

			$("#teacher_id"+course.id).on('click', function(event){
				event.preventDefault();
				showTeacher(course.teacher.id)
			})


			if (!isEnrolled(course.id)){
				$('#courseList').append("<div id='coursetype"+ course.id +"'> <input type='radio' name='coursetype"+ course.id +"' value='classroom'> Classroom <input checked type='radio' name='coursetype"+ course.id +"' value='online'> Online<br><button id='Enroll"+ course.id +"'>Enroll</button><br></div>")}
			else {$('#courseList').append("<button id='Unenroll"+ course.id +"'>Unenroll</button><br>")}
			$('#courseList').append("<br>")	
			$("#Unenroll"+course.id).on('click', function(event){
				let url = "/enrollments/"+enrollmentId(course.id)+"/unenroll"
 				$.ajax({
	  				url : url,
	  				type : 'DELETE',
	  				complete : attachEnroll(course),
					});
			})

			$("#Enroll"+course.id).on('click', function(event){
				let ctype = $(`input[name="coursetype${course.id}"]:checked`).val()
				let posting = $.post('/enrollments/new', {"course_type" : ctype, "course_id" : course.id});
		        posting.done(function (data) {
		        	
		        	const welcomemessage = new Enrollment(course.teacher.name, data.course_type, course.name, data.course_id)
		        	welcomemessage.welcome() 
		        	attachUnenroll(course)})
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

function enrollmentId(courseid){
	let temp = session.enrollments.find(function(enrollment){return enrollment.course_id === courseid})
  if (temp){return temp.id} else {return ""}
}

function attachUnenroll(course){

	$("#coursetype"+course.id).replaceWith("<button id='Unenroll"+ course.id +"'>Unenroll</button>")
	getSession()
	$("#Unenroll"+course.id).on('click', function(event){
		let url = "/enrollments/"+enrollmentId(course.id)+"/unenroll"
 		$.ajax({
	  		url : url,
	  		type : 'DELETE',
	  		complete : attachEnroll(course),
		});
	})
}

function attachEnroll(course){
	$("#Unenroll"+course.id).replaceWith("<div id='coursetype"+ course.id +"'> <input type='radio' name='coursetype"+ course.id +"' value='classroom'> Classroom <input checked type='radio' name='coursetype"+ course.id +"' value='online'> Online<br><button id='Enroll"+ course.id +"'>Enroll</button></div>")
	$("#Enroll"+course.id).on('click', function(event){
				let ctype = $(`input[name="coursetype${course.id}"]:checked`).val()
				let posting = $.post('/enrollments/new', {"course_type" : ctype, "course_id" : course.id});
		        posting.done(attachUnenroll(course))
	    	})
}

function showCourse(id){
getSession()
$.get("/courses/"+id+".json", function(data) {
	$("#title").text(data.name)
	$('#courseList').empty()
	$('#courseList').append("<h3> Teacher: <a href='' id='teach'>"+data.teacher.name+"</a></h3>")
	$('#courseList').append("<p>"+data.description+"</p>")
	$("#teach").on('click', function(event){
				event.preventDefault();
				showTeacher(data.teacher.id)
			})

	if (!isEnrolled(data.id)){
		$('#courseList').append("<div id='coursetype"+ data.id +"'> <input type='radio' name='coursetype"+ data.id +"' value='classroom'> Classroom <input checked type='radio' name='coursetype"+ data.id +"' value='online'> Online<br><button id='Enroll"+ data.id +"'>Enroll</button><br></div>")
		$("#Enroll"+data.id).on('click', function(event){
				let ctype = $(`input[name="coursetype${data.id}"]:checked`).val()
				let posting = $.post('/enrollments/new', {"course_type" : ctype, "course_id" : data.id});
		        posting.done(attachUnenroll(data))
	    })}
	else{
		$('#courseList').append("<button id='Unenroll"+ data.id +"'>Unenroll</button><br>")}
		$("#Unenroll"+data.id).on('click', function(event){
			let url = "/enrollments/"+enrollmentId(data.id)+"/unenroll"
 			$.ajax({
	  			url : url,
	  			type : 'DELETE',
	  			complete : attachEnroll(data),
			})
	})
})}

function showTeacher(id){
	getSession()
	$.get("/teachers/"+id+".json", function(data) {
		$("#title").text(data.name)
		$('#courseList').empty()
		$('#courseList').append("<h2>Courses:</h2>")
		data.courses.forEach(function(course){
			$('#courseList').append("<a href='' class = 'course_name' id='course_name"+course.id+"'>"+course.name+"</a><br><p class='cdesc'>"+course.description+"</p>")
				
			$("#course_name"+course.id).on('click', function(event){
				event.preventDefault();
				showCourse(course.id)
			})


			if (!isEnrolled(course.id)){
				$('#courseList').append("<div id='coursetype"+ course.id +"'> <input type='radio' name='coursetype"+ course.id +"' value='classroom'> Classroom <input checked type='radio' name='coursetype"+ course.id +"' value='online'> Online<br><button id='Enroll"+ course.id +"'>Enroll</button><br></div>")}
			else {$('#courseList').append("<button id='Unenroll"+ course.id +"'>Unenroll</button><br>")}
			$('#courseList').append("<br>")	
			$("#Unenroll"+course.id).on('click', function(event){
				let url = "/enrollments/"+enrollmentId(course.id)+"/unenroll"
 				$.ajax({
	  				url : url,
	  				type : 'DELETE',
	  				complete : attachEnroll(course),
					});
			})

			$("#Enroll"+course.id).on('click', function(event){
				let ctype = $(`input[name="coursetype${course.id}"]:checked`).val()
				let posting = $.post('/enrollments/new', {"course_type" : ctype, "course_id" : course.id});
		        posting.done(attachUnenroll(course))
	    	})
    	}) 
	})
}

function Enrollment(teacher, type, course, course_id) {
  this.teacher = teacher
  this.type = type
  this.course = course
  this.course_id = course_id
}

Enrollment.prototype.welcome = function() {
	temp = `#course_name${this.course_id}`
	console.log(temp)
    $(temp).append(`<p id="norm" class="successfully-saved"><em>${this.teacher} welcomes you to the ${this.type} version of ${this.course}!</em></p>`)
};

function enrollmentSuccess(data){
	console.log(data)
}


