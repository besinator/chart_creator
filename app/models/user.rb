class User < ActiveRecord::Base
  attr_accessible :email, :login, :password_digest
  
  has_many :charts, dependent: :destroy
end
