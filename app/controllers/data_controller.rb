class DataController < ApplicationController
  respond_to :json

	#-----------------------------------------------------
	#get all data => GET /data_sets/<id>/data
	#-----------------------------------------------------
  def index
  	data_set = DataSet.find(params[:data_set_id])
    data = data_set.data.all

    respond_with(data) do |format|
    	#response string in specified format
      format.json { render json: { success: true, data: data } }
    end
  end

	#-----------------------------------------------------
	#create datum => POST /data_sets/<id>/data
	#-----------------------------------------------------
  def create
		data_set = DataSet.find(params[:data_set_id])
    datum = data_set.data.new(params[:datum])
    datum.save

    respond_with(datum) do |format|
      if datum.valid?
        format.json { render json: { success: true, data: datum } }
      else
        format.json { render json: { success: false, errors: datum.errors } }
      end
    end
  end

	#-----------------------------------------------------
	#update datum => PUT /data_sets/<id>/data/<id>
	#-----------------------------------------------------
  def update
    data_set = DataSet.find(params[:data_set_id])
    datum = data_set.data.find(params[:id])
  	datum.update_attributes(params[:datum])

    respond_with(datum) do |format|
      if datum.valid?
        format.json { render json: { success: true, data: datum } }
      else
        format.json { render json: { success: false, errors: datum.errors } }
      end
    end
  end

	#-----------------------------------------------------
	#delete datum => DELETE /data_sets/<id>/data/<id>
	#-----------------------------------------------------
  def destroy
  	data_set = DataSet.find(params[:data_set_id])
  	datum = data_set.data.find(params[:id])
  	datum.destroy

    respond_with(datum) do |format|
      format.json { render json: { success: true, data: datum } }
    end
  end
end
