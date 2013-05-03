class DataController < ApplicationController
  respond_to :json

	#-----------------------------------------------------
	#get all data => GET /data_sets/<id>/data
	#-----------------------------------------------------
  def index
  	data_set = DataSet.find(params[:data_set_id])
    data = data_set.data.all
		data.sort_by! { |a| (a.x_field.to_f) }
		
    respond_with(data) do |format|
    	#response string in specified format
      format.json { render json: { success: true, data: data } }
    end
  end

	#-----------------------------------------------------
	#create datum => POST /data_sets/<id>/data -data are send from extjs in batch (in array _json) or 
	#datum alone - need to check
	#-----------------------------------------------------
  def create
		data_set = DataSet.find(params[:data_set_id])
		
		#if data are send in batch
		if params[:_json].kind_of?(Array)
			data_arr = params[:_json]
			data = Array.new
			all_valid = true
			
			#save all data in one transaction
			Datum.transaction do
				data_arr.each do |item|
					data.push(data_set.data.new(item))
					data.last.save
					if !data.last.valid?
						all_valid = false
					end
				end
			end
			
			respond_with(data) do |format|
      	if all_valid
        	format.json { render json: { success: true, data: data } }
      	else
        	format.json { render json: { success: false, errors: 'Data werent created' } }
      	end
    	end
    	
		#if there is only one datum
		else
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
  end

	#-----------------------------------------------------
	#update datum => PUT /data_sets/<id>/data/<id>
	#-----------------------------------------------------
  def update
    data_set = DataSet.find(params[:data_set_id])
		
		#if data are send in batch
		if params[:_json].kind_of?(Array)
			data_arr = params[:_json]
			data = Array.new
			all_valid = true
		
			#update all data in one transaction
			Datum.transaction do
				data_arr.each do |item|
					data.push(data_set.data.find(item[:id]))
					data.last.update_attributes(item)
					if !data.last.valid?
						all_valid = false
					end
				end
			end
			
			respond_with(data) do |format|
      	if all_valid
        	format.json { render json: { success: true, data: data } }
      	else
        	format.json { render json: { success: false, errors: 'Date werent updated' } }
      	end
    	end
    	
		#if there is only one datum
		else
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
  end

	#-----------------------------------------------------
	#delete datum => DELETE /data_sets/<id>/data/<id>
	#-----------------------------------------------------
  def destroy
    data_set = DataSet.find(params[:data_set_id])
		
		#if data are send in batch
		if params[:_json].kind_of?(Array)
			data_arr = params[:_json]
			data = Array.new
			all_destroyed = true
			
			#delete all data in one transaction
			Datum.transaction do
				data_arr.each do |item|
					datum = data_set.data.find(item[:id])
					datum.destroy
					all_destroyed = datum.destroyed?
				end
			end
			
			respond_with(data) do |format|
        	format.json { render json: { success: all_destroyed } }
    	end
    	
		#if there is only one datum
		else
			datum = data_set.data.find(params[:id])
  		datum.destroy

    	respond_with(datum) do |format|
      	format.json { render json: { success: datum.destroyed? } }
    	end
		end
  end
end
