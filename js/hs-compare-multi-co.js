var apiURL = 'http://dev.markitondemand.com/Api/Timeseries/jsonp';

var numDays = 365,
    stockSym = '',
    companyName = '',
    seriesData = [];

$('#btn-getData').click(function (e) {
    numDays = $('#days').val();
    stockSym = $('#stockSym').val();
    seriesData = [];
    $("#chart_container").find('div').empty();
    StockGraph.getData();
});


var StockGraph = {
    getData: function () {

        $('.stockSym').each(function (index) {
            var stockSym = $(this).val();

            if (stockSym.length == 0) {
                return;
            } else {

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
                        if (!d.Data || d.Message) {
                            console.error("Error: ", d.Message);
                            return;
                        } else {
                            var tmpArr = [],
                                coName = d.Data.Name,
                                closeVals = d.Data.Series.close.values,
                                closeValsLen = closeVals.length;

                            for (var i = 0; i < closeValsLen; i++) {
                                yVal = closeVals[i];
                                xVal = (Date.parse(d.Data.SeriesDates[i]));
                                tmpArr.push([xVal, yVal]);
                            }

                            seriesData.push({
                                'name': coName,
                                'data': tmpArr
                            });

                            if (seriesData.length == 3) {
                                StockGraph.renderChart(seriesData);
                            };
                        }
                    }
                });
            }
        });

    }, // end StockGraph.getData()	
    renderChart: function (data) {

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
                text: 'Closing Stock Price Comparison'
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



$(".stockSym").typeahead({
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
                //console.log(coNames);
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