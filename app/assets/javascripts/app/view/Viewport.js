Ext.define('CC.view.Viewport', {
  extend: 'Ext.container.Viewport',

  layout: 'border',
  items: [{
  	region: 'west',
    xtype: 'chart_tree',
    title: 'Chart list',
    id: 'chart_tree',
    width: 260,
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
    tools: [{
        xtype: 'button',
        text: 'Profile settings',
        action: 'userChangePassword'
    },
    {
        xtype: 'form',
        defaultMargins: '0 0 0 0',
        standardSubmit: true,
        url:'/users/sign_out',
        items: [{
          xtype: 'hidden',
          name: '_method',
          value: 'delete',
        },
        {
          xtype: 'hidden',
          name: 'authenticity_token',
          value: Ext.select("meta[name='csrf-token']").elements[0].content,
        }]
    },
    {
        xtype: 'button',
        text: 'Logout',
        action: 'userLogout' 
    }],
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
