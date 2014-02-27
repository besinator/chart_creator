//taken from http://www.learnsomethings.com/2012/03/20/extjs4-color-picker-in-a-drop-down-control-for-use-on-forms-and-in-editable-grids/
//but needed some improvements
Ext.define('CC.view.chart.ColorPickerCombo', {
	extend: 'Ext.form.field.Trigger',
	alias: 'widget.colorcbo',
	triggerTip: 'Please select a color.',
	picker: null,
 	onTriggerClick: function() {
 		var me = this;
 		if(!me.picker) {
			me.picker = Ext.create('Ext.picker.Color', {     
				pickerField: this,     
				ownerCt: this,    
				renderTo: document.body,     
				floating: true,    
				hidden: false,    
				focusOnShow: true,
				style: {
 					backgroundColor: "#fff"
				} ,
				listeners: {
					scope:this,
					select: function(field, value, opts){
						me.setValue('#' + value);
						me.inputEl.setStyle({backgroundColor:value});
						me.picker.hide();
					},
					show: function(field,opts){
						field.getEl().monitorMouseLeave(500, field.hide, field);
					},
				}
			});
			me.picker.alignTo(me.inputEl, 'tl-bl?');
			me.picker.show(me.inputEl);
		}
		else {
			if(me.picker.hidden) {
				me.picker.show();
			} 
			else {
				me.picker.hide();
			}
		}
	},
});

