class DataSetsController < ApplicationController
  respond_to :json

	#-----------------------------------------------------
	#get all data sets => GET /charts/<id>/data_sets
	#-----------------------------------------------------
  def index
  	chart = Chart.find(params[:chart_id])
    data_sets = chart.data_sets.all

    respond_with(data_sets) do |format|
    	#response string in specified format
      format.json { render json: { success: true, data_sets: data_sets } }
    end
  end

	#-----------------------------------------------------
	#create data sets => POST /charts/<id>/data_sets
	#-----------------------------------------------------
  def create
		chart = Chart.find(params[:chart_id])
    data_set = chart.data_sets.new(params[:data_set])
    data_set.save

    respond_with(data_set) do |format|
      if data_set.valid?
        format.json { render json: { success: true, data_sets: data_set } }
      else
        format.json { render json: { success: false, errors: data_set.errors } }
      end
    end
  end

	#-----------------------------------------------------
	#update data sets => PUT /charts/<id>/data_sets/<id>
	#-----------------------------------------------------
  def update
    chart = Chart.find(params[:chart_id])
    data_set = chart.data_sets.find(params[:id])
  	data_set.update_attributes(params[:data_set])

    respond_with(data_set) do |format|
      if data_set.valid?
        format.json { render json: { success: true, data_sets: data_set } }
      else
        format.json { render json: { success: false, errors: data_set.errors } }
      end
    end
  end

	#-----------------------------------------------------
	#delete data sets => DELETE /charts/<id>/data_sets/<id>
	#-----------------------------------------------------
  def destroy
  	chart = Chart.find(params[:chart_id])
  	data_set = chart.data_sets.find(params[:id])
  	data_set.destroy

    respond_with(data_set) do |format|
      format.json { render json: { success: true, data_sets: data_set } }
    end
  end
end
