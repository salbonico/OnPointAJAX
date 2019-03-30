Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  
  get '/session' => 'sessions#show'
  get '/ajax' => 'home#ajax', as: 'ajax_home'
  get '/admin' => 'users#admin', as: 'user_admin'
  get '/home' => 'home#ajax'
  get '/signup' => 'users#new'
  post '/users' => 'users#create'
  get '/users/:id/edit' => 'users#edit', as: 'edit_user'
  post '/users/:id' => 'users#update'
  delete 'users/delete' => 'users#destroy', as: 'delete_user'
  get '/login' => 'sessions#new'
  post '/login' => 'sessions#create'
  get '/logout' => 'sessions#destroy'
  get '/auth/facebook/callback' => 'sessions#socialcreate'
  post '/enrollments/new' => 'enrollments#create', as: 'enrollments'
  delete '/enrollments/:id/unenroll' => 'enrollments#destroy', as: 'unenroll'
  get '/available' => 'courses#available' 


  resources :courses 	
  
  resources :teachers do
  	resources :courses, only: [:show, :index, :new] 
  end
end
