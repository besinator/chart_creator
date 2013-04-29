class Chart < ActiveRecord::Base
  attr_accessible :chart_type, :group, :name, :user_id
  
  has_one :detail, dependent: :destroy
  has_many :data_sets, dependent: :destroy
  
  belongs_to :user
end
