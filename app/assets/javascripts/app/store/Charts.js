// Models are typically used with a Store, which is basically a collection of Model instances.
Ext.define('CC.store.Charts', {
  extend: 'Ext.data.Store',

  model: 'CC.model.Chart',
  autoLoad: true,
  autoSync: false,

	groupField: 'group', //used with grid to group by

	//storeId: 'charts',
	
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
  }
  
});
