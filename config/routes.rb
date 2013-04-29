ChartCreator::Application.routes.draw do
  devise_for :admins
  
  mount RailsAdmin::Engine => '/admin', :as => 'rails_admin'

	resources :charts do
		resources :details
	end
	
	resources :charts do
		resources :data_sets
	end
	
	resources :data_sets do
		resources :data
	end
	
  root to: 'index#index'
  

  # This redirect is a work around for the use of Extjs4 with Rails assets pipeline:
  # for "test" and "production" mode images are now retrived this way
  match "/resources/themes/*all" => redirect {|env, req|
    URI.unescape "/assets/extjs4/resources/themes/#{req.params[:all]}"
  }, all: /.*/ unless Rails.env == 'development'
end
