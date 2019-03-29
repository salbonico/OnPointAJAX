class EnrollmentsController < ApplicationController

	def create
		user = User.find(session[:user_id])
		@enrollment = Enrollment.new(:course_id => params[:course_id], :user_id => user.id, :course_type => params[:course_type])
		@enrollment.save
		render json: @enrollment.to_json, status: 201
		
		
	end

	def destroy
		enrollment = Enrollment.find(params[:id])

		if session[:user_id] != enrollment.user_id
			flash[:notice] = "You are not enrolled in #{course.name}!"
			redirect_to "/courses"
		else
			course= Course.find(enrollment.course_id)
			enrollment.destroy
			flash[:notice] = "You have unenrolled from #{course.name}!"
			redirect_to "/home"
		end
	end
end