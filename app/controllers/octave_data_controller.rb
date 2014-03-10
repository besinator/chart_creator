class OctaveDataController < ApplicationController
  before_filter :authenticate_user!
  respond_to :json

	#-----------------------------------------------------
	#generate data from octave => GET /octave_data
	#-----------------------------------------------------
	def index
    series_function = params[:series_function];
    x_start = params[:x_start];
    x_end = params[:x_end];
    x_step = params[:x_step];
    
    #send x and y to octave and get calculated data 
    #printf format is json - [{"x":1.0,"y":1.5},{"x":2.0,"y":1.3},...}]
    #check if y is not nan - dont send NaN, Inf, NA values
    
    octave_data = `octave -q --eval "
    
    			x=[#{x_start}:#{x_step}:#{x_end}];
 					y=#{series_function};
 					
					printf('{\\"success\\":true,\\"data\\":[');
					
          for i=1:((#{x_end}-(#{x_start}))./#{x_step})+1,
          	if(length(y)>=i),
          		if(isnan(y(i)) == 0 && isinf(y(i)) == 0 && isna(y(i)) == 0),
          			printf('{\\"x_field\\":%f,\\"data_index\\":%f},',x(i),y(i));
          		endif;
          	endif;
          endfor;
          
          printf(']}');
    "`
    
    respond_with(octave_data)
  end
end
