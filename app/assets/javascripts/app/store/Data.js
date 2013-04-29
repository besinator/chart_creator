// Models are typically used with a Store, which is basically a collection of Model instances.
Ext.define('CC.store.Data', {
  extend: 'Ext.data.Store',

  model: 'CC.model.Datum',
  autoLoad: false,
  autoSync: false,

	storeId: 'data',

	//for debuging
  listeners: {
    load: function(store, records, index, eOpts) {
      //console.log(arguments);
      /*
      var chart = this.first();
      console.log("Chart: " + chart.get('name'));
      console.log("ChartConfig: " + chart.getChartConfig().get('title'));
      chart.regular_serie_attributes().each(function(serie) {
      	console.log("RegularSerie: " + serie.get('name'));
      });
      */
      //console.log(records);
    },
    update: function(store, records, index, eOpts) {
      //console.log(records);
    },
    beforesync: function(store, records, index, eOpts) {
      //console.log(records);
    },
    add: function(store, records, index, eOpts) {
      //console.log(records);
    }
  },
  
    
  proxy: {
    url: '/data_sets/1/data',	//should be in this format - charts id needs to be dynamically changed
    type: 'rest',
    format: 'json',
    //appendId: false,

    reader: {
      root: 'data',
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
    
    //need to override build Url method - when creating datum, it was sending id = 0, now its ok-not sending id at all
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
