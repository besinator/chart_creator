Ext.define('CC.model.DataSet', {
  extend : 'Ext.data.Model',
  
  idProperty: 'id',
  fields: [
    { name: 'id', type: 'int' },
    { name: 'chart_id', type: 'int' },
    { name: 'name', type: 'string' },
    { name: 'series_type', type: 'string' },
    { name: 'dash_style', type: 'string' },
    { name: 'color', type: 'string' },
  ],
  
  proxy: {
    url: '/charts/1/data_sets',	//should be in this format - charts id needs to be dynamically changed
    type: 'rest',
    format: 'json',

    reader: {
      root: 'data_sets',
      //record: 'detail',
      successProperty: 'success',
      messageProperty: 'errors'
    },
    writer: {
      //redefine getRecordData method - to respond with specific format
      /*
      getRecordData: function(record) {
        var data = record.data;
    		return { chart: data };
      }
      */
    },
    buildUrl: function(request) {
    	var records = request.operation.records || [],
        record  = records[0],
        format  = this.format,
        url     = request.url || this.url;

    	if (this.appendId && record) {
    		if(record.getId() > 0)
				{
					if (!url.match(/\/$/)) {
            url += '/';
        	}
        	url += record.getId();
        }
    	}

    	if (format) {
        if (!url.match(/\.$/)) {
            url += '.';
        }

        url += format;
    	}

    	request.url = url;

    	return Ext.data.RestProxy.superclass.buildUrl.apply(this, arguments);
		}
  },
  
});
