Ext.define('CC.model.Datum', {
  extend : 'Ext.data.Model',
  
  idProperty: 'id',
  fields : [
  	{ name: 'id', type: 'int' },
  	{ name: 'data_set_id', type: 'int' },
  	{ name: 'x_field', type: 'string' },
		{ name: 'data_index', type: 'float' }
  ],

});
