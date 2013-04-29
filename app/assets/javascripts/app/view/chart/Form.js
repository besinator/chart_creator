Ext.define('CC.view.chart.Form', {
  extend: 'Ext.window.Window',
  alias : 'widget.chart_form',
	
  title : 'Add / Edit Chart',
  layout: 'anchor',
  defaults: {
		anchor: '100%'
	},
  autoShow: true,
  
  combo_chart_types: [
  	'Line',
  	'Spline',
		'Step',
		'Area',
		'Bar',
		'Column',
		'Scatter',
		'Funnel',
	],
	
	combo_dash_styles: [
		'Solid',
		'ShortDash',
		'ShortDot',
		'ShortDashDot',
		'ShortDashDotDot',
		'Dot',
		'Dash',
		'LongDash',
		'DashDot',
		'LongDashDot',
		'LongDashDotDot'
  ],
  
  //same as highcharts default colors
  default_colors: [
		'#2F7ED8', 
		'#0D233A', 
		'#8BBC21', 
		'#910000', 
		'#1AADCE', 
		'#492970',
		'#F28F43', 
		'#77A1E5', 
		'#C42525', 
		'#A6C96A'
  ],

	last_tab: 0,
	
	initComponent: function() {

    this.items = [{
    
    xtype:'tabpanel',
    plain:true,
    activeTab: 0,
    defaults: {
			bodyPadding: 10
		},
		items: [{
		
		xtype: 'panel',
  	title: 'Chart information',
  	layout: 'anchor',
		defaults: {
			anchor: '100%'
		},

		items: [{
      xtype: 'form',
      //title: 'Chart Form',
      layout: 'form',
      bodyPadding: '5 5 5 5',
      width: 500,
      
      //form fields
      items: [{
      	//Base information fieldset and fields
      	xtype:'fieldset',
				title: 'Chart information',
				layout: 'anchor',
				collapsed: false,
				collapsible: true,
				defaults: {
					anchor: '100%'
				},
      	items: [{   
					xtype: 'hidden',
					name : 'id',
					fieldLabel: 'id'
   	    }, {
					xtype: 'textfield',
					name : 'name',
					fieldLabel: 'Name',
      	}, {
					xtype: 'textfield',
					name : 'group',
					fieldLabel: 'Group'
      	}, {
      		xtype: 'combo',
        	name : 'chart_type',
        	fieldLabel: 'Type',
        	displayField: 'name',
        	store: this.combo_chart_types,
        	queryMode: 'local',
        	typeAhead: true
      	}],
      }]
     }, {
     	xtype: 'form',
      //title: 'Chart Form',
      layout: 'form',
      bodyPadding: '5 5 5 5',
      width: 500,
      
      //form fields
      items: [{
      	//More information fieldset and fields
      	xtype:'fieldset',
				title: 'Chart configuration',
				layout: 'anchor',
				collapsible: true,
				collapsed: true,
				defaults: {
					anchor: '100%'
				},
      	items: [{
        	xtype: 'textfield',
        	name : 'title',
        	fieldLabel: 'Title'
				}, {
        	xtype: 'textfield',
        	name : 'subtitle',
        	fieldLabel: 'Subtitle'
				}, {
        	xtype: 'textfield',
        	name : 'xtitle',
        	fieldLabel: 'X axis title'
				}, {
        	xtype: 'textfield',
        	name : 'ytitle',
        	fieldLabel: 'Y axis title'
      	}],
      }],
     }], 
     }, {
     	xtype: 'panel',
  		title: 'Series information',
  		layout: 'anchor',
			defaults: {
				anchor: '100%'
			},
			items: [{
				xtype: 'button',
				text: 'Add Serie',
				//handler: this.addSerieTab,
				action: 'addSerieTab',
				margin: 5,
			}, {
      //Serie configuration - tabbed panel
      xtype:'tabpanel',
      plain:true,
      activeTab: 0,
      defaults: {
				bodyPadding: 5
			},
			}]
		 }],
		 }];
    
    this.buttons = [{
      text: 'Save',
      action: 'save' //action defined in controller => CreateOrUpdate
    }, {
      text: 'Cancel',
      scope: this,
      handler: this.close
    }];
    
    this.callParent(arguments);
    this.setFieldsToDefaults();
  },
	
	//set field values to default
	setFieldsToDefaults:  function() {
	
		var form = this.down('form');
		form.getForm().findField('chart_type').setValue(this.combo_chart_types[0]);

/*
		form = this.down('tabpanel').down('form');

		form.getForm().findField('series_type').setValue(this.combo_chart_types[0]);
		form.getForm().findField('dash_style').setValue(this.combo_dash_styles[0]);
		form.getForm().findField('color').setValue(this.default_colors[0]);
		*/
	},
	
	//add tab for new serie
	addSerieTab: function(writableGridStore) {
		//console.log(this.up('chart_form').down('tabpanel'));

		var win;
		if(this.up('chart_form'))
		{
			win = this.up('chart_form');
		}
		else
		{
			win = this;
		}
		
		var tab_panel = win.down('tabpanel').down('tabpanel');
		win.last_tab++;

		//new tab layount
  	var new_serie_panel = tab_panel.add({
  		xtype: 'panel',
  		title: 'Series '+(win.last_tab),
  		layout: 'anchor',
			defaults: {
				anchor: '100%'
			},
			//help identify data to load/save to/from writable grid
			data_set_id: -1,
			tabindex: win.last_tab, //particulary important for addChart
			items:[{
				xtype: 'form',
      	//title: 'Chart Form',
      	layout: 'form',
      	bodyPadding: '5 5 5 5',
      	width: 500,
      	//form fields
      	items: [{
      	
      	xtype:'fieldset',
				title: 'Series configuration',
				layout: 'anchor',
				collapsible: true,
				collapsed: false,
				defaults: {
					anchor: '100%'
				},
				items: [{
					xtype: 'textfield',
					name : 'name',
					fieldLabel: 'Name'
				}, {
					xtype: 'combo',
					name : 'series_type',
					fieldLabel: 'Series type',
					store: win.combo_chart_types,
					queryMode: 'local',
					typeAhead: true
				}, {
					xtype: 'combo',
					name : 'dash_style',
					fieldLabel: 'Dash style',
					store: win.combo_dash_styles,
					queryMode: 'local',
					typeAhead: true
				}, {
					xtype: 'colorcbo',
					name : 'color',
					fieldLabel: 'Color'
				}],
				}],
				}, {
      	
      	xtype:'fieldset',
				title: 'Series data',
				layout: 'anchor',
				collapsible: true,
				collapsed: true,
				defaults: {
					anchor: '100%'
				},
				
        xtype: 'writable_grid',
				title: 'Data',
				flex: 1,
				width: 500,
				store: writableGridStore,
				/*
        listeners: {
					selectionchange: function(selModel, selected) {
						main.child('#form').setActiveRecord(selected[0] || null);
					}
				}
				*/
			}],
  	});
		
		//set serie default values (color should be different from last one - ciculate default_color arr)
		var form = tab_panel.down('form');
		for(var i=0; i<win.last_tab-1; i++)
		{
			form = form.up('panel').next('panel').down('form');
		}
		form.getForm().findField('series_type').setValue(win.combo_chart_types[0]);
		form.getForm().findField('dash_style').setValue(win.combo_dash_styles[0]);
		form.getForm().findField('color').setValue(win.default_colors[win.last_tab % win.default_colors.length]);
		
		//set added tab as active		
		tab_panel.setActiveTab(new_serie_panel);
		//tab_panel.doLayout();
		
		return form;
	},
	
	
/*	
	//function to dynamically add form fields for regular series - based on received data
  addRegularSerieFormFields: function(series) {
  console.log(this);
  	//vars for creating structured field names
  	var serie_property = "regular_serie";
  	var data_property = "regular_serie_datum";
  	var i = 0;	//tracking series number
 
  	//hold field name and label
  	var field_name = "";
  	var field_label = "";
  	//to store last property => for creating right type of field (textbox, hidden, ... )
  	var last_property = "";
  	
  	//instance of form field to be added
  	var temp_field;
  	//iterate through series and their properties and create fields accordingly (including series data)
  	
  	for(i = 0; i < series.length; i++)
  	{
  		for(var property in series[i]) {
  			//-------------------------------------------------------------------------
    		//regular series data
    		//-------------------------------------------------------------------------
  			if(property == "regular_serie_datum_attributes") {
  				continue;
  			}			
  			//-------------------------------------------------------------------------
    		//regular series
    		//-------------------------------------------------------------------------
  			else {
  				//dont create form fields for id and chart_id properties
  				if(property == "id" || property == "chart_id") {
  					continue;
  				}
  				//create form fields for serie properies (include series number - i)
  				field_name = serie_property+"_"+i+"."+property;
  				field_label = property;
  				last_property = property;
  				//if field_name already exists, dont create field
  				if(this.down('form').getForm().findField(field_name)) {
  					continue;
  				}
  			}	
				//create form field according to property type
  			switch(last_property)
  			{
  				//color picker
  				case "color":
  					temp_field = Ext.create('Ext.ux.ColorPickerCombo', {
							name: field_name,
 							fieldLabel: field_label
						});
						this.down('form').add(temp_field);
  					break;
  				//series type combobox
  				case "series_type":
  					temp_field = Ext.create('Ext.form.field.ComboBox', {
							name: field_name,
 							fieldLabel: field_label,
 							store: this.combo_chart_types,
        			queryMode: 'local',
        			typeAhead: true
						});
						var added_field = this.down('form').add(temp_field);	//add field to form
						added_field.setValue(this.combo_chart_types[0]);
  					break;	
  				//series dash style combobox
  				case "dash_style":
  					temp_field = Ext.create('Ext.form.field.ComboBox', {
							name: field_name,
 							fieldLabel: field_label,
 							store: this.combo_dash_styles,
        			queryMode: 'local',
        			typeAhead: true
						});
						var added_field = this.down('form').add(temp_field);	//add field to form
						added_field.setValue(this.combo_dash_styles[0]);
  					break;	
  				//default textfield
  				default:
  					temp_field = Ext.create('Ext.form.field.Text', {
							name: field_name,
 							fieldLabel: field_label
						});
						this.down('form').add(temp_field);	//add field to form
  			} 
			}
  	}
  }*/
});

