var session
window.onload = function(){
	getSession()
	attachListeners()
	allCourses()
}

function attachListeners(){
	$("#allCourses").on('click', (event) => {
  	allCourses()
  })
}

function allCourses(){
	$("#title").text("All Courses")
	$('#courseList').empty()
	getSession()
	$.get("/courses.json", (data) => {
		data.forEach( (course) => {
			$('#courseList').append("<a href='' class = 'course_name' id='course_name"+course.id+"'>"+course.name+"</a><br><a href='' id='teacher_id"+course.id+"'><em>" + course.teacher.name + "</em></a><p class='cdesc'>"+course.description+"</p>")
			$("#course_name"+course.id).on('click', (event) => {
				event.preventDefault();
				showCourse(course.id)
			})
			$("#teacher_id"+course.id).on('click', (event) => {
				event.preventDefault();
				showTeacher(course.teacher.id)
			})
			if (!isEnrolled(course.id)){
				$('#courseList').append("<div id='coursetype"+ course.id +"'> <input type='radio' name='coursetype"+ course.id +"' value='classroom'> Classroom <input checked type='radio' name='coursetype"+ course.id +"' value='online'> Online<br><button id='Enroll"+ course.id +"'>Enroll</button><br></div>")}
			else
				{$('#courseList').append("<button id='Unenroll"+ course.id +"'>Unenroll</button><br>")
			}
			$('#courseList').append("<br>")
			$("#Unenroll"+course.id).on('click', (event) => {
				let url = "/enrollments/"+enrollmentId(course.id)+"/unenroll"
 				$.ajax({
	  				url : url,
	  				type : 'DELETE',
	  				complete : attachEnroll(course),
				});
			})
			$("#Enroll"+course.id).on('click', (event) => {
				let ctype = $(`input[name="coursetype${course.id}"]:checked`).val()
				let posting = $.post('/enrollments/new', {"course_type" : ctype, "course_id" : course.id});
		    posting.done( (data) => {
		        const welcomemessage = new Enrollment(data.course_type, course.name, data.course_id)
		        welcomemessage.welcome()
		        attachUnenroll(course)})
	    	})
    	})
		})
}

function getSession(){
	$.get("/session", (data) => {
		session = data
	})
}

function isEnrolled(courseid){
	let temp = session.enrollments.find( (enrollment) => {return enrollment.course_id === courseid})
  return (temp ? true : false)
}

function enrollmentId(courseid){
	let temp = session.enrollments.find( (enrollment) => {return enrollment.course_id === courseid})
  return (temp ? temp.id : "")
}

function attachUnenroll(course){
	$("#coursetype"+course.id).replaceWith("<button id='Unenroll"+ course.id +"'>Unenroll</button>")
	getSession()
	$("#Unenroll"+course.id).on('click', (event) => {
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
	$("#Enroll"+course.id).on('click', (event) => {
		let ctype = $(`input[name="coursetype${course.id}"]:checked`).val()
		let posting = $.post('/enrollments/new', {"course_type" : ctype, "course_id" : course.id});
		posting.done((data) => {
		   const welcomemessage = new Enrollment(data.course_type, course.name, data.course_id)
		   welcomemessage.welcome()
		   attachUnenroll(course)
		})
	})
}

function showCourse(id){
getSession()
$.get("/courses/"+id+".json", (course) => {
	$("#title").text(course.name)
	$('#courseList').empty()
	$('#courseList').append("<h4 id='course_name"+course.id+"'></h4>")
	$('#courseList').append("<h3> Teacher: <a href='' id='teach'>"+course.teacher.name+"</a></h3>")
	$('#courseList').append("<p>"+course.description+"</p>")
	$("#teach").on('click', (event) => {
		event.preventDefault();
		showTeacher(course.teacher.id)
	})
	if (!isEnrolled(course.id)){
		$('#courseList').append("<div id='coursetype"+ course.id +"'> <input type='radio' name='coursetype"+ course.id +"' value='classroom'> Classroom <input checked type='radio' name='coursetype"+ course.id +"' value='online'> Online<br><button id='Enroll"+ course.id +"'>Enroll</button><br></div>")
		$("#Enroll"+course.id).on('click', (event) =>{
				let ctype = $(`input[name="coursetype${course.id}"]:checked`).val()
				let posting = $.post('/enrollments/new', {"course_type" : ctype, "course_id" : course.id});
		    posting.done((data) => {
		       const welcomemessage = new Enrollment(data.course_type, course.name, data.course_id)
		       welcomemessage.welcome()
		       attachUnenroll(course)
				})
	   })
	}
	else{
		$('#courseList').append("<button id='Unenroll"+ course.id +"'>Unenroll</button><br>")}
		$("#Unenroll"+course.id).on('click', (event) => {
			let url = "/enrollments/"+enrollmentId(course.id)+"/unenroll"
 			$.ajax({
	  			url : url,
	  			type : 'DELETE',
	  			complete : attachEnroll(course),
			})
		})
	})
}

function showTeacher(id){
	getSession()
	$.get("/teachers/"+id+".json", (data) => {
		$("#title").text(data.name)
		$('#courseList').empty()
		$('#courseList').append("<h2>Courses:</h2>")
		data.courses.forEach((course) =>{
			$('#courseList').append("<a href='' class = 'course_name' id='course_name"+course.id+"'>"+course.name+"</a><br><p class='cdesc'>"+course.description+"</p>")
			$("#course_name"+course.id).on('click', (event) =>{
				event.preventDefault();
				showCourse(course.id)
			})
			if (!isEnrolled(course.id)){
				$('#courseList').append("<div id='coursetype"+ course.id +"'> <input type='radio' name='coursetype"+ course.id +"' value='classroom'> Classroom <input checked type='radio' name='coursetype"+ course.id +"' value='online'> Online<br><button id='Enroll"+ course.id +"'>Enroll</button><br></div>")}
			else
				{$('#courseList').append("<button id='Unenroll"+ course.id +"'>Unenroll</button><br>")
			}
			$('#courseList').append("<br>")
			$("#Unenroll"+course.id).on('click', (event) =>{
				let url = "/enrollments/"+enrollmentId(course.id)+"/unenroll"
 				$.ajax({
	  				url : url,
	  				type : 'DELETE',
	  				complete : attachEnroll(course),
				});
			})
			$("#Enroll"+course.id).on('click', (event) =>{
				let ctype = $(`input[name="coursetype${course.id}"]:checked`).val()
				let posting = $.post('/enrollments/new', {"course_type" : ctype, "course_id" : course.id});
		    posting.done((data) => {
		       const welcomemessage = new Enrollment(data.course_type, course.name, data.course_id)
		       welcomemessage.welcome()
		       attachUnenroll(course)
				})
	    })
    })
	})
}

function Enrollment(type, course, course_id) {
  this.type = type
  this.course = course
  this.course_id = course_id
}

Enrollment.prototype.welcome = function() {
	temp = `#course_name${this.course_id}`
    $(temp).append($(`<p id="norm"><em>You have enrolled in the ${this.type} version of ${this.course}!</em></p>`).hide().fadeIn(1000).delay(1000).fadeOut(1000))
};
