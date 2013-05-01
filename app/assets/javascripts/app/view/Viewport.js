Ext.define('CC.view.Viewport', {
  extend: 'Ext.container.Viewport',

  layout: 'border',
  items: [{
  	region: 'west',
    xtype: 'chart_tree',
    title: 'Chart list',
    id: 'chart_tree',
    width: 230,
    collapsible: true,
    html : 'Treeview of charts'
  },
  {
		region: 'center',
    xtype: 'panel',
    title: 'Chart',
    layout: 'fit',
    margins: '0 0 0 0',
    id: 'chart_panel',
    //html : 'Blank',
    bbar: [{
    	xtype: 'tbfill',
    	height: 22,
    },/*{
    	text: 'Add Series',
			id: 'addSeries',
			action: 'addSeries',
			disabled: true,
    }*/]
  }]
});
