class ApplicationController < ActionController::Base
	protect_from_forgery with: :exception


	def isadmin?
		if session["user_id"] == nil
			false
		else
			user = User.find(session[:user_id])
			user.admin
		end
	end


end
