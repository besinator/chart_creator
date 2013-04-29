/**
 *= require_self
 
 *= require extjs4/src/ux/ColorPickerCombo
*/

//Instance of application
Ext.application({
  //global namespace - chart manager
  name: 'CC',
  appFolder: '/assets/app',
  controllers: ['Charts'],
  /*
  requires: [
		'CC.ChartsConfig'
  ],
  */
  autoCreateViewport: true
});
