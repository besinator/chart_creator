class ChartsController < ApplicationController
  respond_to :json

	#-----------------------------------------------------
	#get all charts => GET /charts
	#-----------------------------------------------------
  def index
  	current_user = User.first
    charts = current_user.charts.all

    respond_with(charts) do |format|
    	#response string in specified format
      format.json { render json: { success: true, charts: charts } }
    end
  end

	#-----------------------------------------------------
	#create chart => POST /charts
	#-----------------------------------------------------
  def create
    current_user = User.first
    chart = current_user.charts.new(params[:chart])
    chart.save

    respond_with(chart) do |format|
      if chart.valid?
        format.json { render json: { success: true, charts: chart } }
      else
        format.json { render json: { success: false, errors: user.errors } }
      end
    end
  end

	#-----------------------------------------------------
	#update chart => PUT /charts/<id>
	#-----------------------------------------------------
  def update
  	current_user = User.first
  	chart =  current_user.charts.find(params[:id])
    chart.update_attributes(params[:chart])

    respond_with(chart) do |format|
      if chart.valid?
        format.json { render json: { success: true, charts: chart } }
      else
        format.json { render json: { success: false, errors: user.errors } }
      end
    end
  end

	#-----------------------------------------------------
	#delete chart => DELETE /charts/<id>
	#-----------------------------------------------------
  def destroy
  	current_user = User.first
  	chart =  current_user.charts.find(params[:id])
    chart.destroy

    respond_with(chart) do |format|
      format.json { render json: { success: chart.destroyed? } }
    end
  end
end
