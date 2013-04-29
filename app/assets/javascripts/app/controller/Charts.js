Ext.define('CC.controller.Charts', {
  extend: 'Ext.app.Controller',

  stores: ['Charts', 'Details', 'DataSets', 'Data'],
  models: ['Chart', 'Detail', 'DataSet', 'Datum'],

  views: [
    'chart.Tree',
    'chart.Form',
    'chart.WritableGrid',
  ],
  
  //used to save data stores - need as much as active tabs = data sets
  data_stores: [],

  init: function() {
    this.control({
      'chart_tree': {
        itemdblclick: this.editChart,
        selectionchange: this.selectionChange
      },
      'writable_grid button[action=save_data]': {
      	click: this.saveData
      },
      'tabpanel': {
        tabchange : this.onSeriesTabChange,
      },
      'chart_form button[action=addSerieTab]': {
        click: this.addSerieTab
      },
      'chart_form button[action=save]': {
        click: this.createOrUpdateChart
      },
      'button[action=addChart]': {
        click: this.addChart
      },
      'button[action=editChart]': {
        click: this.editChart
      },
      'button[action=deleteChart]': {
        click: this.deleteChart
      }
    });
  },
  
//-------------------------------------------------------------------------------------
//on tab change - load new data to grid
//-------------------------------------------------------------------------------------
	onSeriesTabChange: function(panel, newTab, oldTab) {
	/*
		if(newTab.data_set_id>0) {
			console.log(newTab.data_set_id);
		}
		*/
		/*
		if(newTab.data_set_id>0) {
			if(!this.data_stores[newTab.data_set_id])
			{
				this.data_stores[newTab.data_set_id] = Ext.create('CC.store.Data');
				this.data_stores[newTab.data_set_id].getProxy().url = '/data_sets/'+newTab.data_set_id+'/data';
				this.data_stores[newTab.data_set_id].load();
			}
			console.log(this.data_stores);
			console.log(newTab.data_set_id);
  	}
  	*/
  	/*
		if(newTab.data_set_id>0) {
			data_store = Ext.getStore('Data');
			data_store.getProxy().url = '/data_sets/'+newTab.data_set_id+'/data';
			data_store.load();
		}
		*/
  },
  
  //action runned from form with btn addSerieTab or from controller (this controller must send correct btn)
  //will add tab but also create new data store for serie data
  addSerieTab: function(btn) {
  	var formWin = btn.up('chart_form');
  	var tabindex = formWin.last_tab;
  	this.data_stores[tabindex] = Ext.create('CC.store.Data');
  	var form = formWin.addSerieTab(this.data_stores[tabindex]);
  	return form;
  },
  
  saveData: function(btn) {
  	var form = btn.sender_grid.up('chart_form').down('tabpanel').down('tabpanel').getActiveTab();
  	/*
  	console.log(form.data_set_id);
  	var data_store = [];
  	data_store[form.data_set_id] = Ext.create('CC.store.Data');
  	console.log(data_store);
		if(form.data_set_id>0) {
			data_store = Ext.getStore('Data');
			data_store.getProxy().url = '/data_sets/'+form.data_set_id+'/data';
			data_store.sync({
				success: function(data_batch, data_options) {
				},
				failure: function(data_batch, data_options) {
				},
			});
		}
		*/
  },

//-------------------------------------------------------------------------------------
//addChart - open empty form
//-------------------------------------------------------------------------------------
  addChart: function() {
  	this.data_stores = []; //first remove any data stores previously created
    var formWin = Ext.widget('chart_form');
    var addSerieBtn = formWin.down('tabpanel').down('panel').next('panel').down('button');
    this.addSerieTab(addSerieBtn);
    formWin.show();
  },
  
//-------------------------------------------------------------------------------------
//editChart - open form with preset record data
//-------------------------------------------------------------------------------------
  editChart: function() {
  	this.data_stores = []; //first remove any data stores previously created
  	//chart
  	var chart_record = Ext.getCmp('chart_tree').getSelectedChart(); //get selected record from grid
		
		var formWin = Ext.widget('chart_form'); //create form window
		var chartForm = formWin.down('form');
		var detailsForm = formWin.down('form').next('form');
		var firstSetForm = formWin.down('tabpanel').down('tabpanel').down('form');
		var addSerieBtn = formWin.down('tabpanel').down('panel').next('panel').down('button');
		var me = this;
		
   	chartForm.loadRecord(chart_record);	//load chart record to form
   	
   	//details
		//set url to get details of selected chart
		detail_store = Ext.getStore('Details');
		detail_store.getProxy().url = '/charts/'+chart_record.data.id+'/details';
		//load data to form only after they are loaded - must be done this way, because its asynchronous
		detail_store.load(function () {
			detail_record = detail_store.getAt(0);
			//ak existuju nejake detaily, tak ich uloz
			if(detail_record) {
				detailsForm.loadRecord(detail_record);
			}
		});
		
		//data sets + data
		//set url to get data sets of selected chart
		set_store = this.getStore('DataSets');
		set_store.getProxy().url = '/charts/'+chart_record.data.id+'/data_sets';
		//load data to form only after they are loaded - must be done this way, because its asynchronous
		set_store.load(function () {
			var form = firstSetForm;
			//for each data set find form and write info to it
			set_store.data.each(function(record, index, totalItems ) {
				//load data_set to tab form
				form = me.addSerieTab(addSerieBtn);
				form.getForm().loadRecord(record);
				
				//load data stores (writable grid would update automatically
				form.up('panel').data_set_id = record.data.id;
				var tabindex = form.up('panel').tabindex;
				var data_set_id = form.up('panel').data_set_id;
				me.data_stores[tabindex-1].getProxy().url = '/data_sets/'+record.data.id+'/data';
				me.data_stores[tabindex-1].load();
    	});
		});
  },

//-------------------------------------------------------------------------------------
//createOrUpdateChart - after save button on form - create/update store and db
//-------------------------------------------------------------------------------------
  createOrUpdateChart: function(button) {
		var formWin = button.up('window');
		
		//these are checked in the end if the window can be closed
		var closeDetails = false;
		
    var chartForm = formWin.down('form');
    var detailsForm = formWin.down('form').next('form');
    var firstSetForm = formWin.down('tabpanel').down('tabpanel').down('form');
    var actSetForm = firstSetForm;
		var firstDataGrid = formWin.down('tabpanel').down('tabpanel').down('writable_grid');
    var actDataGrid = firstDataGrid;
    var me = this;
    
    //form fields validation errors
    var errors = [];
    var all_valid = true;

		//get chart values from form and create model instance with these values
    var chart_store = this.getStore('Charts');
    var chart_values = chartForm.getValues();
    var chart = Ext.create('CC.model.Chart', chart_values);
    var chart_id = 0; //when chart is created id, returned id is saved -for creation od nested data
    errors[0] = chart.validate();
    if(!errors[0].isValid) {
			all_valid = false;
		}
    
    //get detail values from form and create model instance with these values
    var details_store = this.getStore('Details');
    var details_values = detailsForm.getValues();
    var details = Ext.create('CC.model.Detail', details_values);
    errors[1] = details.validate();
    if(!errors[1].isValid) {
			all_valid = false;
		}
    
    //get data set values from form and create model instance with these values + get data stores[]
    var set_store = this.getStore('DataSets');
    var set_values = [];
    var data_sets = [];	//models
    var data_set_id = [];
    var data_stores = []; //data stores;
    actSetForm = firstSetForm;
    actDataGrid = firstDataGrid;
    errors[2] = [];
    for(var i=0; i<formWin.last_tab; i++) {
    	set_values[i] = actSetForm.getValues();
    	data_stores[i] = actDataGrid.store;
    	
    	if(i<formWin.last_tab-1) {
				actSetForm = actSetForm.up('panel').next('panel').down('form');
				actDataGrid = actDataGrid.up('panel').next('panel').down('writable_grid');
			}
			data_sets[i] = Ext.create('CC.model.DataSet', set_values[i]);
			errors[2][i] = data_sets[i].validate();
			if(!errors[2][i].isValid) {
				all_valid = false;
			}
		}

		//------------------------------------------------------------------
		//store records
		//------------------------------------------------------------------
		//if chart records are valid
    if(all_valid) {
    	//get record from form
      var chartRecord = chartForm.getRecord();
			var detailsRecord = detailsForm.getRecord();
			var setRecord = [];
			actSetForm = firstSetForm;
			for(var i=0; i<formWin.last_tab; i++) {
      	setRecord[i] = actSetForm.getRecord();
      	if(i<formWin.last_tab-1)
    		{
					actSetForm = actSetForm.up('panel').next('panel').down('form');
				}
      }
			
			//chart
			//if record exists - only update record
      if(chartRecord) {
        chartRecord.set(chart_values);	//update chart
        chart_id = chartRecord.data.id;
        chartRecord.setDirty();
      //else - create record - add it to store
      } else {
        chart_store.add(chart);
      }
      
      //details
      //if record exists - only update record
      if(detailsRecord) {
        detailsRecord.set(details_values);	//update details
      //else - create record - add it to store
      } else {
        details_store.add(details);
      }
      
      //set data
      //if record exists - only update record
      for(var i=0; i<formWin.last_tab; i++) {
      	if(setRecord[i]) {
        	setRecord[i].set(set_values[i]);	//update set data
        	setRecord[i].setDirty();
      	//else - create record - add it to store
      	} else {
        	set_store.add(data_sets[i]);
      	}
      }

			//------------------------------------------------------------------------
			//synchronize chart_store - update/create and close window
			//------------------------------------------------------------------------
      chart_store.sync({
      	//chart_store success
        success: function(batch, options) {
        	//console.log("success");
        	
        	//after chart_store is synced - get returned chart id
        	if(options.operations.create)
        	{
        		chart_id = options.operations.create[0].data.id;
        	}
        	if(options.operations.update)
        	{
        		chart_id = options.operations.update[0].data.id;
        	}
        	
        	//------------------------------------------------------------------------
        	//sync details store, first check if chart_id is set and change proxy url
        	//------------------------------------------------------------------------
        	if(chart_id != 0) {
        		//change details proxy so the right chart is updatet with details
        		details_store.getProxy().url = '/charts/'+chart_id+'/details';
        		
        		details_store.sync({
        			//details_store success
        			success: function() {
          			//console.log("success");
          		},    
          		//details_store failure      			
          		failure: function(batch, options) {
          			//extract server side validation errors
          			var serverSideValidationErrors = batch.exceptions[0].error;

          			var errors = new Ext.data.Errors();
          			for (var field in serverSideValidationErrors) {
          				var message = serverSideValidationErrors[field].join(", ");
          				errors.add(undefined, { field: field, message: message });
          			}
          			chartForm.getForm().markInvalid(errors);
        			}
      			});
        	}
        	else {
        		console.log("Chart ID cant be 0");
        	}
        	
        	//------------------------------------------------------------------------
        	//sync data sets store, first check if chart_id is set and change proxy url
        	//------------------------------------------------------------------------
        	if(chart_id != 0) {
        		//change details proxy so the right chart is updatet with details
        		set_store.getProxy().url = '/charts/'+chart_id+'/data_sets';
        		
        		set_store.sync({
        			//details_store success
        			success: function(set_batch, set_options) {
          			//console.log("success");
          			//after set_store is synced - get new set id
        				if(set_options.operations.create)
        				{
        					for(var i in set_options.operations.create) {
        						data_set_id.push(set_options.operations.create[i].data.id);
        					}
        				}
        				if(set_options.operations.update)
        				{
        					for(var i in set_options.operations.update) {
        						data_set_id.push(set_options.operations.update[i].data.id);
        					}
        				}
        				data_set_id.sort();
        				
        				/*
        				console.log(data_set_id);
        				console.log(data_stores.length);
        				*/
        				
        				//------------------------------------------------------------------------
        				//sync data stores, change proxy url to according to parrent set
        				//------------------------------------------------------------------------
        				//console.log(formWin.last_tab);
        				for(var i=0; i<formWin.last_tab; i++) {
        					//console.log(i);
        					data_stores[i].getProxy().url = '/data_sets/'+data_set_id[i]+'/data';
        					//console.log(data_stores[i].getProxy().url);
        					data_stores[i].sync({
										success: function(data_batch, data_options) {
										},
										failure: function(data_batch, data_options) {
										},
									});
								}
        				//console.log(data_set_id);
          		},    
          		//details_store failure      			
          		failure: function(batch, options) {
          			//extract server side validation errors
          			var serverSideValidationErrors = batch.exceptions[0].error;

          			var errors = new Ext.data.Errors();
          			for (var field in serverSideValidationErrors) {
          				var message = serverSideValidationErrors[field].join(", ");
          				errors.add(undefined, { field: field, message: message });
          			}
          			actSetForm = firstSetForm;
      					for(var i=0; i<formWin.last_tab; i++) {
      						if(!errors[2][i].isValid()) {
      							actSetForm.getForm().markInvalid(errors);
      							if(i<formWin.last_tab-1)
    								{
											actSetForm = actSetForm.up('panel').next('panel').down('form');
										}
      						}
      					}
        			}
      			});
        	}
        	else {
        		console.log("Chart ID cant be 0");
        	}
        	
        	formWin.close();
       	},
       	//chart_store failure
        failure: function(batch, options) {
          //extract server side validation errors
          var serverSideValidationErrors = batch.exceptions[0].error;

          var errors = new Ext.data.Errors();
          for (var field in serverSideValidationErrors) {
            var message = serverSideValidationErrors[field].join(", ");
            errors.add(undefined, { field: field, message: message });
          }
          chartForm.getForm().markInvalid(errors);
        }
      });
    //if chart records are not valid
    } else {
    	if(!errors[0].isValid()) {
      	chartForm.getForm().markInvalid(errors[0]);
      }    	
    	if(!errors[1].isValid()) {
      	detailsForm.getForm().markInvalid(errors[1]);
      }
      actSetForm = firstSetForm;
      for(var i=0; i<formWin.last_tab; i++) {
      	if(!errors[2][i].isValid()) {
      		actSetForm.getForm().markInvalid(errors[2][i]);
      		if(i<formWin.last_tab-1)
    			{
						actSetForm = actSetForm.up('panel').next('panel').down('form');
					}
      	}
      }
    }
  },

//-------------------------------------------------------------------------------------
//deleteChart - delete record
//-------------------------------------------------------------------------------------
  deleteChart: function() {
    var record = Ext.getCmp('chart_tree').getSelectedChart();

    if (record) {
      var store = this.getStore('Charts');
      store.remove(record);
      store.sync();
    }
  },

//-------------------------------------------------------------------------------------
//selectionChange - enable/disable buttons according to selection
//-------------------------------------------------------------------------------------
  selectionChange: function(selectionModel, selections) {
    var tree = Ext.getCmp('chart_tree');
    if (selections.length > 0) {
      tree.enableRecordButtons();
    } else {
      tree.disableRecordButtons();
    }
	},
	
});