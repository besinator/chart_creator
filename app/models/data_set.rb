class DataSet < ActiveRecord::Base
  attr_accessible :chart_id, :color, :dash_style, :name, :series_type
  
  has_many :data, dependent: :destroy
  
  belongs_to :chart
end
