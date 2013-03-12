var numDays = 365,
    stockSym = '';

$('#btn-getData').click(function (e) {
    numDays = $('#days').val();
    stockSym = $('#stockSym').val();
    $("#chart_container").find('div').empty();
    StockGraph.getData();
});

var StockGraph = {
    getData: function () {
        $.ajax({
            beforeSend: function () {
                $("#chart").text("Loading chart...");
            },
            data: {
                symbol: stockSym,
                duration: numDays
            },
            url: "http://dev.markitondemand.com/Api/Timeseries/jsonp",
            dataType: "jsonp",
            context: this,
            success: function (data) {

                $("#chart").empty();
                $('#hd-coName').text(data.Data.Name + ' (' + data.Data.Symbol + ')');
                var seriesData = [];
                //Catch errors
                if (!data.Data || data.Message) {
                    console.error("Error: ", data.Message);
                    return;
                }

                var cnt = 0;
                for (var key in data.Data.Series) {
                    seriesData.push([]);
                    for (var i = 0; i < data.Data.Series[key].values.length; i++) {
                        yVal = data.Data.Series[key].values[i];

                        xVal = (Date.parse(data.Data.SeriesDates[i])) / 1000;
                        seriesData[cnt].push({
                            x: xVal,
                            y: yVal
                        });
                    }
                    cnt++;
                }



                var graph = new Rickshaw.Graph({
                    element: document.getElementById("chart"),
                    renderer: 'area',
                    height: 300,
                    width: 800,
                    series: [{
                        data: seriesData[0],
                        name: 'Open',
                        color: "#c05020"
                    }, {
                        data: seriesData[1],
                        name: 'High',
                        color: "#000"
                    }, {
                        data: seriesData[2],
                        name: 'Low',
                        color: "#CCC"
                    }, {
                        data: seriesData[3],
                        name: 'Close',
                        color: "green"
                    }]
                });



                var format = function (n) {

                    var dates = data.Data.SeriesDates,
                        datesLen = data.Data.SeriesDates.length,
                        x = {};

                    for (var i = 0; i < datesLen; i++) {
                        x[i] = dates[i];
                    }

                    return x[n];
                }



                var x_axis = new Rickshaw.Graph.Axis.Time({
                    graph: graph
                });


                var y_ticks = new Rickshaw.Graph.Axis.Y({
                    graph: graph,
                    orientation: 'left',
                    tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
                    element: document.getElementById('y_axis'),
                });

                var offsetForm = document.getElementById('renderer_form');
                offsetForm.addEventListener('change', function (e) {
                    var offsetMode = e.target.value;

                    switch (offsetMode) {
                        case 'line':
                            {
                                graph.setRenderer('line');
                                break;
                            }
                        case 'bar':
                            {
                                graph.setRenderer('bar');
                                break;
                            }
                        case 'scatter':
                            {
                                graph.setRenderer('scatterplot');
                                break;
                            }
                        case 'area':
                            {
                                graph.setRenderer('area');
                                break;
                            }
                    }


                    graph.render();

                }, false);

                graph.render();





                var legend = document.querySelector('#legend');

                var Hover = Rickshaw.Class.create(Rickshaw.Graph.HoverDetail, {
                    initialize: function (args) {

                        var graph = this.graph = args.graph;

                        this.xFormatter = args.xFormatter || function (x) {

                            var date = new Date(x * 1000);

                            return date.toLocaleString();
                        };

                        this.yFormatter = args.yFormatter || function (y) {
                            return y === null ? y : y.toFixed(2);
                        };

                        var element = this.element = document.createElement('div');
                        element.className = 'detail';

                        this.visible = true;
                        graph.element.appendChild(element);

                        this.lastEvent = null;
                        this._addListeners();

                        this.onShow = args.onShow;
                        this.onHide = args.onHide;
                        this.onRender = args.onRender;

                        this.formatter = args.formatter || this.formatter;
                    },
                    render: function (args) {

                        legend.innerHTML = args.formattedXValue;

                        args.detail.sort(function (a, b) {
                            return a.order - b.order
                        }).forEach(function (d) {

                            var line = document.createElement('div');
                            line.className = 'line';

                            var swatch = document.createElement('div');
                            swatch.className = 'swatch';
                            swatch.style.backgroundColor = d.series.color;

                            var label = document.createElement('div');
                            label.className = 'label';
                            label.innerHTML = d.name + ": " + d.formattedYValue;

                            line.appendChild(swatch);
                            line.appendChild(label);

                            legend.appendChild(line);

                            var dot = document.createElement('div');
                            dot.className = 'dot';
                            dot.style.top = graph.y(d.value.y0 + d.value.y) + 'px';
                            dot.style.borderColor = d.series.color;

                            this.element.appendChild(dot);

                            dot.className = 'dot active';

                            this.show();

                        }, this);
                    }
                });

                var hover = new Hover({
                    graph: graph
                });

            }
        });
    }
} // end StockGraph.init();

$("#stockSym").typeahead({
    source: function (query, process) {
        return $.ajax({
            beforeSend: function () {
                $("span.help-inline").show();
                $("span.label-info").empty().hide();
            },
            url: "http://dev.markitondemand.com/api/Lookup/jsonp",
            dataType: "jsonp",
            data: {
                input: query
            },
            success: function (data) {
                coNames = [];
                map = {};


                $.each(data, function (i, company) {
                    map[company.Name + ' (' + company.Symbol + ')'] = company.Symbol;
                    coNames.push(company.Name + ' (' + company.Symbol + ')');
                });

                process(coNames);
            }
        });
    },
    updater: function (item) {
        companyName = item;
        return map[item];
    },
    items: 3
});