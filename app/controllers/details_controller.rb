class DetailsController < ApplicationController
  respond_to :json

	#-----------------------------------------------------
	#get chart details => GET /charts/<id>/details
	#-----------------------------------------------------
  def index
    chart = Chart.find(params[:chart_id])
    details = chart.detail

    respond_with(details) do |format|
    	#response string in specified format
      format.json { render json: { success: true, details: details } }
    end
  end

	#-----------------------------------------------------
	#create chart details => POST /charts/<id>/details
	#-----------------------------------------------------
  def create
    chart = Chart.find(params[:chart_id])
    details = chart.build_detail(params[:detail])
    details.save

    respond_with(details) do |format|
      if details.valid?
        format.json { render json: { success: true, details: details } }
      else
        format.json { render json: { success: false, errors: details.errors } }
      end
    end
  end

	#-----------------------------------------------------
	#update chart details  => PUT /charts/<id>/details/<id>
	#-----------------------------------------------------
  def update
  	chart = Chart.find(params[:chart_id])
  	details = chart.detail
  	details.update_attributes(params[:detail])

    respond_with(details) do |format|
      if details.valid?
        format.json { render json: { success: true, details: details } }
      else
        format.json { render json: { success: false, errors: details.errors } }
      end
    end
  end
end
