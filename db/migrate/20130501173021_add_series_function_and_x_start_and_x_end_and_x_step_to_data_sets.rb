class AddSeriesFunctionAndXStartAndXEndAndXStepToDataSets < ActiveRecord::Migration
  def change
    add_column :data_sets, :series_function, :string
    add_column :data_sets, :x_start, :float
    add_column :data_sets, :x_end, :float
    add_column :data_sets, :x_step, :float
  end
end
