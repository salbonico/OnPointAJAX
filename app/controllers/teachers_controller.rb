class TeachersController < ApplicationController

  def new
  	redirect_to "/home" unless isadmin?
    @teacher = Teacher.new
  end

  def create
  	redirect_to "/home" unless isadmin?
  	@teacher = Teacher.new(teacher_params)
  	if @teacher.save
        redirect_to teacher_path(@teacher)
    else
        render :new
  	end
  end

  def index
  	@teachers = Teacher.all
  end


  def show
  	@teacher = Teacher.find(params[:id])
  end

  def edit
  	redirect_to "/home" unless isadmin?
  	@teacher = Teacher.find(params[:id])
  end

  def update
  	redirect_to "/home" unless isadmin?
    @teacher = Teacher.find(params[:id])

    @teacher.update(teacher_params)

    if @teacher.save
      redirect_to @teacher
    else
      render :edit
    end  
  end

  def destroy
  	redirect_to "/home" unless isadmin?
  	teacher = Teacher.find(params[:id])
    teacher.destroy
    redirect_to "/teachers"
  end


  private
  
    def teacher_params
      params.require(:teacher).permit(:name)
    end
end