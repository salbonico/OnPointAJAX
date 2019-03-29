class CoursesController < ApplicationController

	def new
		redirect_to "/home" unless isadmin?
	    if params[:teacher_id] && !Teacher.exists?(params[:teacher_id])
	    	redirect_to "/home", alert: "Teacher not found."
	  	else
	    	@course = Course.new(teacher_id: params[:teacher_id])
	  	end
	end


	def edit
		redirect_to "/home" unless isadmin?
		@course = Course.find(params[:id])
	end


	def create
		redirect_to "/home" unless isadmin?
		@course = Course.new(course_params)
		if @course.save
			redirect_to "/courses/#{@course.id}"
		else
			render :new
		end
	end

	def show
		@course = Course.find(params[:id])
		@user = User.find(session["user_id"])
		@enrollment = Enrollment.new(:course_id => @course.id, :user_id => @user.id)
		respond_to do |format|
      		format.html { render :show }
      		format.json { render json: @course, status: 200 }
  		end
	end

	def index
		if params[:teacher_id]
			@teacher = Teacher.find(params[:teacher_id])
			@courses = @teacher.courses
		else
			@courses = Course.all
		end
		@user = User.find(session["user_id"])
		@enrollment = Enrollment.new(:user_id => @user.id)
		respond_to do |format|
      		format.html { render :index }
      		format.json { render json: @courses, status: 200 }
  		end
		#render :json => {:user => @user.to_json, :courses => @courses}


	end

    def available
       @user = User.find(session["user_id"])
       @courses = Course.enrollment_check(@user)
       @enrollment = Enrollment.new(:user_id => @user.id)
    end



	def update
		redirect_to "/home" unless isadmin?
	    @course = Course.find(params[:id])
	    @course.update(course_params)
	    if @course.save
	      redirect_to @course
	    else
	      render :edit
	    end
	end

	def destroy
		redirect_to "/home" unless isadmin?
		course = Course.find(params[:id])
	    course.destroy
	    redirect_to "/courses"
	end

	private
	 
	  def course_params
	    params.require(:course).permit(:name, :description, :teacher_id)
	  end
end