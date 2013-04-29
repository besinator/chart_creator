class Datum < ActiveRecord::Base
  attr_accessible :data_index, :data_set_id, :x_field
  
  belongs_to :data_set
end
