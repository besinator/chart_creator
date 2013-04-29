class CreateDataSets < ActiveRecord::Migration
  def change
    create_table :data_sets do |t|
      t.integer :chart_id
      t.string :name
      t.string :series_type
      t.string :dash_style
      t.string :color

      t.timestamps
    end
  end
end
