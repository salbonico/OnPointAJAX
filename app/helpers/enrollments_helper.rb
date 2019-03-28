module EnrollmentsHelper

	def isenrolled(course)
		user = User.find(session[:user_id])
		if user.enrollments.find_by(:course_id => course.id)
			return true
		else
			return false
		end
	end

	def unenrollmentid(course)
		user = User.find(session[:user_id])
		if user.enrollments.find_by(:course_id => course.id)
			enrollment = user.enrollments.find_by(:course_id => course.id)
			return enrollment.id
		else
			return ""
		end
	end
end