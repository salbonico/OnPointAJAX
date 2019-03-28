class UsersController < ApplicationController

	def new
		if session[:user_id] != nil
		redirect_to "/home"
		else
		@user = User.new
		end
	end

	def admin
		redirect_to "/home" unless isadmin?
		@users = User.all
	end


	def create
		if session[:user_id] != nil 
			redirect_to '/home' 
		else
			@user = User.new(user_params)
				if @user.save
	     		session[:user_id] = @user.id
		 		redirect_to "/home"
	    	else
	     		render :new
			end
		end
	end


	def home
		if session[:user_id] == nil 
			redirect_to '/login' 
		else
			@user = User.find(session[:user_id])
			@online = @user.enrollments.online
			@classroom = @user.enrollments.classroom 
			
		end
	end

	def edit
		redirect_to "/home" unless isadmin?
		@user = User.find(params[:id])
	end

	def update
		redirect_to "/home" unless isadmin?
	    @user = User.find(params[:id])
	    @user.update(user_params)
	    if @user.save
	      flash[:notice] = "#{@user.name} updated."
	      redirect_to "/home"
	    else
	      render :edit
	    end 
	end

	def destroy
		redirect_to "/home" unless isadmin?
		user = User.find(params[:format])
	    user.destroy
	    flash[:notice] = "You have deleted #{user.name}."
	    redirect_to "/home"
	end

	private
	 
	  def user_params
	    params.require(:user).permit(:name, :password, :email, :teacher, :admin)
	  end



end