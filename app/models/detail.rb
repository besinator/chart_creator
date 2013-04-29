class Detail < ActiveRecord::Base
  attr_accessible :chart_id, :inverted, :legend_align, :legend_border_width, :legend_layout, :legend_vertical_align, :subtitle, :title, :x_grid_line_color, :x_grid_line_width, :xtitle, :y_grid_line_color, :y_grid_line_width, :ytitle

	belongs_to :chart
end
