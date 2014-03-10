/**
 *= require_self
*/

Ext.require('Chart.ux.Highcharts');
Ext.require('Chart.ux.Highcharts.Serie');
Ext.require('Chart.ux.Highcharts.AreaRangeSerie');
Ext.require('Chart.ux.Highcharts.AreaSerie');
Ext.require('Chart.ux.Highcharts.AreaSplineRangeSerie');
Ext.require('Chart.ux.Highcharts.AreaSplineSerie');
Ext.require('Chart.ux.Highcharts.BarSerie');
Ext.require('Chart.ux.Highcharts.BoxPlotSerie');
Ext.require('Chart.ux.Highcharts.BubbleSerie');
Ext.require('Chart.ux.Highcharts.ColumnRangeSerie');
Ext.require('Chart.ux.Highcharts.ColumnSerie');
Ext.require('Chart.ux.Highcharts.ErrorBarSerie');
Ext.require('Chart.ux.Highcharts.FunnelSerie');
Ext.require('Chart.ux.Highcharts.GaugeSerie');
Ext.require('Chart.ux.Highcharts.LineSerie');
Ext.require('Chart.ux.Highcharts.PieSerie');
Ext.require('Chart.ux.Highcharts.RangeSerie');
Ext.require('Chart.ux.Highcharts.ScatterSerie');
Ext.require('Chart.ux.Highcharts.SplineSerie');
Ext.require('Chart.ux.Highcharts.WaterfallSerie');

Ext.ns("ChartCreator");

//Instance of application
Ext.application({
  //global namespace - chart creator
  name: 'CC',
  appFolder: '/assets/app',
  controllers: ['Charts'],
  requires: [
		'CC.ChartsConfig',
		'CC.Variables',
  ],
  autoCreateViewport: true
});
