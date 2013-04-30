Ext.define ("CC.ChartsConfig", {
    singleton: true,
    config : {
        spline : {
            height : 500,
            width : 700,
            initAnimAfterLoad: false,
            chartConfig : {
                chart : {
                    marginRight : 130,
                    marginBottom : 120,
                    zoomType : 'xy',
                    showAxes: true,
                },
                title : {
                    text : '',
                    x : -20 //center
                },
                subtitle : {
                    text : '',
                    x : -20
                },
                xAxis : [{
                    title : {
                        text : '',
                        margin : 20
                    },
                    labels : {
                        rotation : 0,
                        y : 35,
                        /*
                        formatter : function () {
                            var dt = Ext.Date.parse (parseInt (this.value) / 1000, "U");
                            if (dt) {
                                return Ext.Date.format (dt, "H:i:s");
                            }
                            return this.value;
                        }
                        */
                        formatter : function () {
                        /*
                            var dt = Ext.Date.parse (parseInt (this.value) / 1000, "U");
                            if (dt) {
                                return Ext.Date.format (dt, "H:i:s");
                            }
                            */
                            return this.value;
                          }

                    }
                }],
                yAxis : {
                    title : {
                        text : ''
                    },
                    plotLines : [{
                        value : 0,
                        width : 1,
                        //color : '#808080'
                    }]
                },
                tooltip : {
                    formatter : function () {
                    /*
                        var dt = Ext.Date.parse (parseInt (this.x) / 1000, "U");
                        return 'At <b>' + this.series.name + '</b>' + Ext.Date.format (dt, "H:i:s") + ',<br/>temperature is : ' + this.y;
                        */
                        return 'x: '+this.x+', y: '+this.y;
                    }

                },
                legend : {
                    layout : 'vertical',
                    align : 'right',
                    verticalAlign : 'top',
                    x : -10,
                    y : 100,
                    borderWidth : 0
                },
                credits : {
                    text : '',
                    href : '',
                    /*
                    style : {
                        cursor : 'pointer',
                        color : '#707070',
                        fontSize : '12px'
                    }
                    */
                }
            }
        },
        
        line : {
            height : 500,
            width : 700,
            initAnimAfterLoad: false,
            chartConfig : {
                chart : {
                    marginRight : 130,
                    marginBottom : 120,
                    zoomType : 'xy',
                    showAxes: true,
                },
                title : {
                    text : '',
                    x : -20 //center
                },
                subtitle : {
                    text : '',
                    x : -20
                },
                xAxis : [{
                    title : {
                        text : '',
                        margin : 20
                    },
                    labels : {
                        rotation : 0,
                        y : 35,
                        formatter : function () {
                        /*
                            var dt = Ext.Date.parse (parseInt (this.value) / 1000, "U");
                            if (dt) {
                                return Ext.Date.format (dt, "H:i:s");
                            }
                            */
                            return this.value;
                        }

                    }
                }],
                yAxis : {
                    title : {
                        text : ''
                    },
                    plotLines : [{
                        value : 0,
                        width : 1,
                        //color : '#808080'
                    }]
                },
                tooltip : {
                    formatter : function () {
                    /*
                        var dt = Ext.Date.parse (parseInt (this.x) / 1000, "U");
                        return 'At <b>' + this.series.name + '</b>' + Ext.Date.format (dt, "H:i:s") + ',<br/>temperature is : ' + this.y;
                        */
                        return 'x: '+this.x+', y: '+this.y;
                    }

                },
                legend : {
                    layout : 'vertical',
                    align : 'right',
                    verticalAlign : 'top',
                    x : -10,
                    y : 100,
                    borderWidth : 0
                },
                credits : {
                    text : '',
                    href : '',
                    /*
                    style : {
                        cursor : 'pointer',
                        color : '#707070',
                        fontSize : '12px'
                    }
                    */
                }
            }
        },

    } // config

});

