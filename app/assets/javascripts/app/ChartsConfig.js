Ext.define ("CC.ChartsConfig", {
    singleton: true,
    config : {
        spline : {
            series : [{
                type : 'spline',
                dataIndex : 'dataIndex',
                name : 'Serie1'
            }],
            height : 500,
            width : 700,
            xField : 'xField',
            chartConfig : {
                chart : {
                    marginRight : 130,
                    marginBottom : 120,
                    zoomType : 'xy'
                },
                title : {
                    text : 'Title',
                    x : -20 //center
                },
                subtitle : {
                    text : 'Subtitle',
                    x : -20
                },
                xAxis : [{
                    title : {
                        text : 'Xtext',
                        margin : 20
                    },
                    labels : {
                        rotation : 270,
                        y : 35,
                        formatter : function () {
                            var dt = Ext.Date.parse (parseInt (this.value) / 1000, "U");
                            if (dt) {
                                return Ext.Date.format (dt, "H:i:s");
                            }
                            return this.value;
                        }

                    }
                }],
                yAxis : {
                    title : {
                        text : 'Ytext'
                    },
                    plotLines : [{
                        value : 0,
                        width : 1,
                        color : '#808080'
                    }]
                },
                tooltip : {
                    formatter : function () {
                        var dt = Ext.Date.parse (parseInt (this.x) / 1000, "U");
                        return 'At <b>' + this.series.name + '</b>' + Ext.Date.format (dt, "H:i:s") + ',<br/>temperature is : ' + this.y;
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
            }
        },

    } // config

});

