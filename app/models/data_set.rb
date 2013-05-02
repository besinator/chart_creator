class DataSet < ActiveRecord::Base
  attr_accessible :chart_id, :color, :dash_style, :name, :series_type, :series_function, :x_start, :x_end, :x_step
  
  has_many :data, dependent: :destroy
  
  belongs_to :chart
end
