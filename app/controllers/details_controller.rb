class DetailsController < ApplicationController
  before_filter :authenticate_user!
  respond_to :json

	#-----------------------------------------------------
	#get chart details => GET /charts/<id>/details
	#-----------------------------------------------------
  def index
    #chart = Chart.find(params[:chart_id])
    chart = Chart.where("id = ? AND user_id = ?", params[:chart_id], current_user.id).limit(1)[0]
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
    #chart = Chart.find(params[:chart_id])
    chart = Chart.where("id = ? AND user_id = ?", params[:chart_id], current_user.id).limit(1)[0]
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
  	#chart = Chart.find(params[:chart_id])
        chart = Chart.where("id = ? AND user_id = ?", params[:chart_id], current_user.id).limit(1)[0]
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
