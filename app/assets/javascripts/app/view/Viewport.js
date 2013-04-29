Ext.define('CC.view.Viewport', {
  extend: 'Ext.container.Viewport',

  layout: 'border',

  items: [{
  	region: 'west',
    xtype: 'chart_tree',
    title: 'Chart list',
    id: 'chart_tree',
    width: 210,
    collapsible: true,
    html : 'Treeview of charts'
  },
  {
  	region: 'center',
    xtype: 'panel',
    title: 'Chart',
    html : 'Blank'
  }]
});
