class CreateCharts < ActiveRecord::Migration
  def change
    create_table :charts do |t|
      t.integer :user_id
      t.string :name
      t.string :group
      t.string :chart_type

      t.timestamps
    end
  end
end
