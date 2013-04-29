class CreateDetails < ActiveRecord::Migration
  def change
    create_table :details do |t|
      t.integer :chart_id
      t.string :title
      t.string :subtitle
      t.string :xtitle
      t.string :ytitle
      t.boolean :inverted
      t.string :legend_layout
      t.string :legend_align
      t.string :legend_vertical_align
      t.integer :legend_border_width
      t.string :x_grid_line_color
      t.integer :x_grid_line_width
      t.string :y_grid_line_color
      t.integer :y_grid_line_width

      t.timestamps
    end
  end
end
