class CreateData < ActiveRecord::Migration
  def change
    create_table :data do |t|
      t.integer :data_set_id
      t.string :x_field
      t.float :data_index

      t.timestamps
    end
  end
end
