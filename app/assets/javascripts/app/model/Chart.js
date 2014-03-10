Ext.define('CC.model.Chart', {
  extend: 'Ext.data.Model',
  
  idProperty: 'id',
  fields: [
    { name: 'id', type: 'int' },
    { name: 'name', type: 'string' },
    { name: 'group', type: 'string' },
    { name: 'chart_type', type: 'string' },
  ],
  
  validations: [
    { type: 'presence', field: 'name' },
    { type: 'presence', field: 'chart_type' },
    { type: 'inclusion', field: 'chart_type', list: CC.Variables.chart_types },
  ],

  proxy: {
    url: '/charts',
    type: 'rest',
    format: 'json',
    /*
    extraParams: {
      authenticity_token: Ext.select("meta[name='csrf-token']").elements[0].content,
    },
    */
    headers: {
      'X-CSRF-Token': Ext.select("meta[name='csrf-token']").elements[0].content,
    },
    reader: {
      root: 'charts',
      //record: 'chart',
      successProperty: 'success',
      messageProperty: 'errors'
    },
    /*
    writer: {
      //include csrf authetication token in requests
      getRecordData: function(record) {
        var data = record.data;
        data.authenticity_token = Ext.select("meta[name='csrf-token']").elements[0].content;
        return data;
      }
    },
    */
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
