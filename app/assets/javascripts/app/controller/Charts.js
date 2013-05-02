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
      	//itemclick: this.loadAll,
        //itemdblclick: this.editChart,
        itemdblclick: this.loadAll,
        selectionchange: this.selectionChange
      },
      'writable_grid button[action=save_data]': {
      	click: this.saveData
      },
      'chart_form tabpanel tabpanel': {			//catch action only for subpanel - series
        tabchange: this.onSeriesTabChange,
      },
      'chart_form tabpanel tabpanel panel': {				//catch action for tab
        beforeclose: this.onSeriesTabClose
      },
      'chart_form button[action=addSerieTab]': {
        click: this.addSerieTab
      },
      'chart_form button[action=generateSeriesData]': {
        click: this.generateSeriesData
      },
      'chart_form button[action=save]': {
        click: this.createOrUpdateChart
      },
      'button[action=showChart]': {
        click: this.loadAll //true == show chart
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
		*/
  },
  
  
//-------------------------------------------------------------------------------------
//onSeriesTabClose - this will be actually done just before the tab is closed
//-------------------------------------------------------------------------------------
  onSeriesTabClose: function(tab) {
  	var formWin = tab.up('chart_form');
  	var firstTab = formWin.down('tabpanel').down('tabpanel').down('panel');
    var actTab = firstTab;
    
    //mark data_set_id to delete (if data_set_id is set)
  	if(tab.data_set_id != -1) {
  		formWin.data_set_delete.push(tab.data_set_id);	//mark data_set_id to delete
  	}
  	//formWin.tabindex.splice(panel.tabindex, 1); //
  	//update tabindexes on all tabs -> lower by one each that is higher than deleted tab
  	for(var i=0; i<formWin.last_tab; i++) {
  		if(tab.tabindex < actTab.tabindex) {
  			actTab.tabindex--;
  		}
  		if(i<formWin.last_tab-1) {
				actTab = actTab.next('panel');
			}
		}
		
		//destroy data_store for this tab
  	this.data_stores[tab.tabindex].destroyStore();
		this.data_stores.splice(tab.tabindex, 1); //shift data_stores
		
  	formWin.last_tab--;	//lower last_tab counter
  	return true;	//true == close tab
  },
  
  
//-------------------------------------------------------------------------------------
//showChart - draw chart to centerer panel (checking if all stores all loaded first)
//-------------------------------------------------------------------------------------  
	showChart: function() {
		//show chart only if all stores are loaded
		var all_stores_loaded = this.isStoresLoaded();
		if(all_stores_loaded) {
			//get selected record from grid - show selected chart
			var chart_record = Ext.getCmp('chart_tree').getSelectedChart();
			
			var details_store = this.getStore('Details');
			var set_store = this.getStore('DataSets');
			var data_stores = this.data_stores;
			
			var selectedChartType = chart_record.data.chart_type;
			var prevSelected = Ext.getCmp('chart_tree').getPreviousSelectedChart;
			
			var configs = CC.ChartsConfig;
			var hcConfg = null;
			
			var initLoad = true;
			
			switch (selectedChartType) {
				case 'Line':
					hcConfig = configs.getDefaultConfig();
				break;
				case 'Step':
					hcConfig = configs.getDefaultConfig();
				break;
				case 'Spline':
					hcConfig = configs.getDefaultConfig();
				break;
				case 'Area':
					hcConfig = configs.getDefaultConfig();
				break;
				case 'Areaspline':
					hcConfig = configs.getDefaultConfig();
				break;
				case 'Column':
					hcConfig = configs.getColumnBarConfig();
				break;
				case 'Bar':
					hcConfig = configs.getColumnBarConfig();
				break;
			}
			// data inside the config
			hcConfig = Ext.clone(hcConfig);
			
			details_record = details_store.getAt(0);
			if(details_record) {
				//console.log(details_record.data);
				//console.log(hcConfig);
				hcConfig.chartConfig.title.text = details_record.data.title;
				hcConfig.chartConfig.subtitle.text = details_record.data.subtitle;
				hcConfig.chartConfig.yAxis.title.text = details_record.data.ytitle;
				hcConfig.chartConfig.xAxis[0].title.text = details_record.data.xtitle;
			}
			//hcConfig
			
			//New chart with config and id
			hcConfig.id = 'main_chart';
			mainChart = Ext.widget('highchart', hcConfig);
			
			var categories = [];
			//get data from data stores and add series to chart
			for(var i in data_stores) {
				var data = [];
				var categories = [];
				var n = 0;
				var data_set_record;
				data_stores[i].data.each(function(record, index, totalItems ) {
					if(n==0) {
						data_set_record = set_store.findRecord('id', record.data.data_set_id);
					}
					data[n] = [];
					if(selectedChartType == "Spline" 
						|| selectedChartType == "Line" 
						|| selectedChartType == "Step"
						|| selectedChartType == "Area"
						|| selectedChartType == "Areaspline") 
					{
						data[n] = [];
						data[n][0] = parseFloat(record.data.x_field);
						data[n][1] = record.data.data_index;
					}
					else {
						categories.push(record.data.x_field);
						data[n] = record.data.data_index;
					}
					n++;
				});
				//console.log(data);
				
				//if record exists - build series and add to chart
				if(data_set_record) {
					mainChart.addSeries([{
						name: data_set_record.data.name,
    				data: data,
    				type: (selectedChartType == 'Step') ? 'line' : selectedChartType.toLowerCase(),
    				color: data_set_record.data.color,
    				dashStyle: data_set_record.data.dash_style.toLowerCase(),
    				step: (selectedChartType == 'Step') ? true : false,
    				events: { click: this.createChartMenu }    				
					}], true);
				}
			}
			if(selectedChartType == "Column" || selectedChartType == "Bar") {
				$.unique(categories);	//will remove all values that are not unique
				mainChart.chartConfig.xAxis[0].categories = categories;
			}
			//mainChart.draw();
			/*
			chartStore && mainChart.bindStore(chartStore, true);
			*/
			//bind chart to center panel and draw
			Ext.getCmp('chart_panel').add(mainChart);
			Ext.getCmp('main_chart').draw();
			//console.log(Ext.getCmp('main_chart'));
		}
  },

//-------------------------------------------------------------------------------------
//createChartMenu - create menu which will open on chart click
//-------------------------------------------------------------------------------------    
  createChartMenu: function(evt) {
  	chart = Ext.getCmp('main_chart');
  	ChartCreator.menu && (ChartCreator.menu.destroy()) && (ChartCreator.menu = null);
		ChartCreator.menu = Ext.create('Ext.menu.Menu', {
			width: 200,
			title: 'Series Menu',
			margin: '0 0 10 0',
			items: [{
				text: 'Zoom type',
				menu: {
					items: [{
						text: 'XY',
						checked: false,
						group: 'zoom_type',
						showCheckbox: false,
						handler: function() {
							chart.chartConfig.chart.zoomType = "xy";
							chart.draw();
						}
					}, {
						text: 'X',
						checked: false,
						group: 'zoom_type',
						showCheckbox: false,
						handler: function() {
							chart.chartConfig.chart.zoomType = "x";
							chart.draw();
						}
					}, {
						text: 'Y',
						checked: false,
						group: 'zoom_type',
						showCheckbox: false,
						handler: function() {
							chart.chartConfig.chart.zoomType = "y";
							chart.draw();
						}
					}]
				}
			},'-',{
				text: 'Plot Average',
				scope: this,
				handler: function() {
					var average = 0;
					Ext.each(this.points, function(point) {
						average += point.y;
					});
					average = average / this.points.length;
					this.yAxis.removePlotLine('average');
					this.yAxis.addPlotLine({
						id: 'average',
						value: average,
						width: 2,
						dashStyle: 'dashdot',
						color: '#80CC99',
						label: {
							text: 'Average: ' + average
						}
					});
				}
			}, {
				text: 'Remove Average Plot',
				scope: this,
				handler: function() {
					this.yAxis.removePlotLine('average');
				}
			}, '-', {
				text: 'Cancel',
				handler: function() {
					ChartCreator.menu.close();
				}
			}]
		});
		
		//check actual zoom type in submenu
		switch(chart.chartConfig.chart.zoomType) {
			case "xy":
				ChartCreator.menu.down('menu').down('menucheckitem').checked = true;
				break;
			case "x":
				ChartCreator.menu.down('menu').down('menucheckitem').next('menucheckitem').checked = true;
				break;
			case "y":
				ChartCreator.menu.down('menu').down('menucheckitem').next('menucheckitem').next('menucheckitem').checked = true;
				break;
		}
		ChartCreator.menu.showAt(evt.point.pageX + 5, evt.point.pageY + 5);
  },


//-------------------------------------------------------------------------------------
//generateSeriesData - get data from octave - after load the data will be shown in grid - runned from 
//form button
//-------------------------------------------------------------------------------------
  generateSeriesData: function(btn) {
  	var formWin = btn.up('chart_form');
  	var tabPanel = btn.up('panel').down('tabpanel');
  	var actTab = tabPanel.getActiveTab();
  	var tabindex = actTab.tabindex;
  	var form = actTab.down('form');
  	var me = this;
  	
  	var set_values = form.getValues();
  	
  	//check if values from form are valid
  	var data_set = Ext.create('CC.model.DataSet', set_values);
    var errors = data_set.validate();
    if(!errors.isValid()) {
    	form.getForm().markInvalid(errors);
		}
		//only if are valid -> generate data
		else {
  		//create store to load octave data
  		var data_store = Ext.create('CC.store.Data');
  		data_store.getProxy().url = '/octave_data';
  		data_store.getProxy().extraParams = { 
  			series_function: set_values.series_function, 
  			x_start: set_values.x_start,
  			x_end: set_values.x_end,
  			x_step: set_values.x_step,
  		};
		//create temp store where will be all records copied to, only after that send data to grid store
		//temp store will enourmously speed up the loading, at the end destroy unneeded stores
			var temp_store = Ext.create('CC.store.Data');
			me.data_stores[tabindex].removeAll(); //first remove all records - and update db
			data_store.load(function () {
				data_store.data.each(function(record){
  				temp_store.add(record.copy());
				});
				me.data_stores[tabindex].add(temp_store.getRange());
				temp_store.destroyStore();
				data_store.destroyStore();
			});
		}
  },
  


//-------------------------------------------------------------------------------------
//addSerieTab - actual form
//-------------------------------------------------------------------------------------
  //action runned from form with btn addSerieTab or from controller (this controller must send correct btn)
  //will add tab but also create new data store for serie data
  addSerieTab: function(btn) {
  	var formWin = btn.up('chart_form');
  	var tabindex = formWin.last_tab;
  	this.data_stores[tabindex] = Ext.create('CC.store.Data');
  	var form = formWin.addSerieTab(this.data_stores[tabindex]);
  	return form;
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
//loadAll - function to load all data for selected chart - should be called after showChartButton preesed, show tells if chart is shown
//-------------------------------------------------------------------------------------
	loadAll: function() {
		this.data_stores = []; //first remove any data stores previously created
		//get selected record from grid
		var chart_record = Ext.getCmp('chart_tree').getSelectedChart();
		var chart_id = chart_record.data.id;
		var detailsForm = null;
		var addSerieBtn = null;
		var loadToForm = false;
		var showChartAfterLoad = true;
		
		this.loadDetails(chart_id, detailsForm, loadToForm, showChartAfterLoad);
		this.loadDataSets(chart_id, addSerieBtn, loadToForm, showChartAfterLoad);
	},
	
//-------------------------------------------------------------------------------------
//isStoresLoaded - check if all stores are loaded and return true/false accordingly -before show chart
//-------------------------------------------------------------------------------------
	isStoresLoaded: function() {
		//get selected record from grid - show this chart
		var chart_record = Ext.getCmp('chart_tree').getSelectedChart();
		
		var chart_store = this.getStore('Charts');
		var details_store = this.getStore('Details');
		var set_store = this.getStore('DataSets');
		var data_stores = this.data_stores;
		var all_stores_loaded = true;
		
		//check if all stores finished loading
		if(chart_store.isLoading()) {
			//console.log("chart_store is loading");
			all_stores_loaded = false;
		}
		
		if(details_store.isLoading()) {
			//console.log("details_store is loading");
			all_stores_loaded = false;
		}
		
		if(set_store.isLoading()) {
			//console.log("set_store is loading");
			all_stores_loaded = false;
		}
		
		for(var i in data_stores) {
			if(data_stores[i].isLoading()) {
				//console.log("data_store " + i + " is loading");
				all_stores_loaded = false;
			}
		}
		
		return all_stores_loaded;
	},
  
//-------------------------------------------------------------------------------------
//loadDetails - get details record, and if it exists and form exist -> put to form 
//-------------------------------------------------------------------------------------
	//chart_id - load details for it, detailsForm to load data to (if exists), loadToForm - if data should be loaded to form or not, show - if chart should be showed
	loadDetails: function(chart_id, detailsForm, loadToForm, show) {
		//details
		//set url to get details of selected chart
  	detail_store = Ext.getStore('Details');
  	detail_store.getProxy().url = '/charts/'+chart_id+'/details';
  	me = this;
  	
  	//load data to form only after they are loaded - must be done this way, because its asynchronous
  	detail_store.load(function () {
			detail_record = detail_store.getAt(0);
			if(detail_record && loadToForm && detailsForm) {
				detailsForm.loadRecord(detail_record);
			}
			if(show) {
				me.showChart(); //show chart after load, (chart is shown only after all stores are loaded
			}
		});
		return detail_store;
  },

//-------------------------------------------------------------------------------------
//loadDataSets - load data sets and data + optionaly put to form
//------------------------------------------------------------------------------------- 
//chart_id - load data set and data for it, addSerieBtn btn used to create new serie tab, loadToForm - if data should be loaded to form or not, show - if chart should be showed
  loadDataSets:  function(chart_id, addSerieBtn, loadToForm, show) {
  	//data sets + data
		//set url to get data sets of selected chart
		var set_store = this.getStore('DataSets');
		set_store.getProxy().url = '/charts/'+chart_id+'/data_sets';
		me = this;
		//load data to form only after they are loaded - must be done this way, because its asynchronous
		set_store.load(function () {
			var record_num = 0;
			//for each data set find form and write info to it
			set_store.data.each(function(record, index, totalItems ) {
			
				if(loadToForm) {
					//load data_set to tab form
					form = me.addSerieTab(addSerieBtn);
					form.getForm().loadRecord(record);
					form.up('panel').data_set_id = record.data.id;
				}
				//load data stores (writable grid would update automatically
				if(!me.data_stores[record_num]) {
					me.data_stores[record_num] = Ext.create('CC.store.Data'); //if it dont exists - create new
				}
				me.data_stores[record_num].getProxy().url = '/data_sets/'+record.data.id+'/data';
				me.data_stores[record_num].load(function() {
					if(show) {
						me.showChart(); //show chart after load, (chart is shown only after all stores are loaded)
					}
				});
				record_num++;
    	});
    	if(show) {
				me.showChart(); //show chart after load, (chart is shown only after all stores are loaded)
			}
		});
		return set_store;
	},
  
//-------------------------------------------------------------------------------------
//editChart - open form with preset record data
//-------------------------------------------------------------------------------------
  editChart: function() {
  	this.data_stores = []; //first remove any data stores previously created
  	//chart
		
		var formWin = Ext.widget('chart_form'); //create form window
		var chartForm = formWin.down('form');
		var detailsForm = formWin.down('form').next('form');
		var addSerieBtn = formWin.down('tabpanel').down('panel').next('panel').down('button');
		var me = this;
		var loadToForm = true;
		var showChartAfterLoad = false;
		
		var chart_record = Ext.getCmp('chart_tree').getSelectedChart(); //get selected record from grid
   	chartForm.loadRecord(chart_record);	//load chart record to form
   	
   	//load details to form
   	me.loadDetails(chart_record.data.id, detailsForm, loadToForm, showChartAfterLoad);
		
		//load data sets and data to form (data to grid)
		me.loadDataSets(chart_record.data.id, addSerieBtn, loadToForm, showChartAfterLoad);
  },

//-------------------------------------------------------------------------------------
//createOrUpdateChart - after save button on form - create/update store and db
//-------------------------------------------------------------------------------------
  createOrUpdateChart: function(button) {
  
  	Ext.getCmp('chart_tree').disableAllButtons(); //when data are saving, disable all buttons from tree
  	
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
    if(!errors[0].isValid()) {
			all_valid = false;
		}
    
    //get detail values from form and create model instance with these values
    var details_store = this.getStore('Details');
    var details_values = detailsForm.getValues();
    var details = Ext.create('CC.model.Detail', details_values);
    errors[1] = details.validate();
    if(!errors[1].isValid()) {
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
			if(!errors[2][i].isValid()) {
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
      //if record exists - only update record + delete records for which does not exist any tab
      for(var i=0; i<formWin.last_tab; i++) {
      	if(setRecord[i]) {
      		setRecord[i].set(set_values[i]);	//update set data
        	setRecord[i].setDirty();	//mark dirty to be sure that nested data are saved
      	//else - create record - add it to store
      	} else {
        	set_store.add(data_sets[i]);
      	}
      }

			//delete set data for which the tab was closed
			for(var i in formWin.data_set_delete) {
				delete_record = set_store.findRecord('id', formWin.data_set_delete[i]);
				set_store.remove(delete_record);
				//console.log(delete_record.data);
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
          			//after delete of stores - delete data_sets to be removed
          			formWin.data_set_delete.length = 0;	
          			
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
											//after last data store is saved - show chart
											if(i==formWin.last_tab) {
												//get created/updated record, select it and show chart
												act_record = chart_store.findRecord('id', chart_id);
												Ext.getCmp('chart_tree').getSelectionModel().select(act_record);
												me.showChart();
												//after success, enable all buttons
												Ext.getCmp('chart_tree').enableAllButtons();
											}
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
        	if(me.isStoresLoaded) {
        		Ext.getCmp('chart_tree').enableAllButtons();
        	}
        	//me.showChart();
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
      var chartRecord = chartForm.getRecord();
      if(chartRecord) {
      	Ext.getCmp('chart_tree').enableAllButtons();
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
