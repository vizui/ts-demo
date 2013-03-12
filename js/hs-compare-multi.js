var apiURL = 'http://dev.markitondemand.com/Api/Timeseries/jsonp';

var numDays = 365,
    stockSym = '',
    companyName = '';

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
            url: apiURL,
            dataType: "jsonp",
            context: this,
            success: function (d) {
                //Catch errors
                if (!d.Data || d.Message) {
                    console.error("Error: ", d.Message);
                    return;
                } else {
                    StockGraph.renderChart(d);
                }


            }
        });
    }, // end StockGraph.getData()	
    renderChart: function (data) {
        var seriesData = [],
            tmpArr = [];

        for (var key in data.Data.Series) {
            tmpArr = [];
            for (var i = 0; i < data.Data.Series[key].values.length; i++) {
                yVal = data.Data.Series[key].values[i];
                xVal = (Date.parse(data.Data.SeriesDates[i]));
                tmpArr.push([xVal, yVal]);
                //seriesData[cnt].push( { x: i, y: yVal } );
            }

            seriesData.push({
                'name': key,
                'data': tmpArr
            });
        }

        window.chart = new Highcharts.StockChart({
            chart: {
                renderTo: 'chart'
            },

            rangeSelector: {
                selected: 4
            },
            legend: {
                align: 'right',
                enabled: true,
                layout: 'vertical',
                verticalAlign: 'top',
                y: 100
            },
            yAxis: {
                labels: {
                    formatter: function () {
                        return (this.value > 0 ? '+' : '') + this.value + '%';
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                }]
            },
            title: {
                text: companyName + ' Stock Price'
            },
            plotOptions: {
                series: {
                    compare: 'percent'
                }
            },
            tooltip: {
                valueDecimals: 2
            },
            series: seriesData
        });

    }
} // end StockGraph

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
    items: 10
});