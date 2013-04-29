Ext.define('CC.view.chart.Tree' ,{
  extend: 'Ext.grid.Panel',
  alias : 'widget.chart_tree',

  title : 'Charts',
  store: 'Charts',

  initComponent: function() {
    this.columns = [
    	{ header: 'Id',  dataIndex: 'id',  flex: 1, hidden: false },
      { header: 'Name',  dataIndex: 'name',  flex: 1 },
      { header: 'Group',  dataIndex: 'group',  flex: 1, hidden: true },
      { header: 'Type', dataIndex: 'chart_type', flex: 1 },
      /*
      { header: 'Created', dataIndex: 'created_at', flex: 1, hidden: true },
      { header: 'Updated', dataIndex: 'updated_at', flex: 1, hidden: true }
      */
    ];

    this.addChartButton = new Ext.Button({
      text: 'Add Chart',
      action: 'addChart'
    });

    this.editChartButton = new Ext.Button({
      text: 'Edit Chart',
      action: 'editChart',
      disabled: true
    });

    this.deleteChartButton = new Ext.Button({
      text: 'Delete Chart',
      action: 'deleteChart',
      disabled: true
    });

    this.bbar = [this.addChartButton, this.editChartButton, this.deleteChartButton];

    this.callParent(arguments);
  },

  getSelectedChart: function() {
    return this.getSelectionModel().getSelection()[0];
  },

  enableRecordButtons: function() {
    this.editChartButton.enable();
    this.deleteChartButton.enable();
  },

  disableRecordButtons: function() {
    this.editChartButton.disable();
    this.deleteChartButton.disable();
  }
});
