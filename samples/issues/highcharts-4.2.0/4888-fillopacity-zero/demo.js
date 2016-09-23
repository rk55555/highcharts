
$(function () {
    QUnit.test('Fill opacity zero', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            plotOptions: {
                series: {
                    fillOpacity: 0
                }
            },
            series: [{
                data: [1, 3, 2, 4]
            }]
        });

        assert.strictEqual(
            chart.series[0].area.element.getAttribute('fill'),
            'rgba(124,181,236,0)',
            'Fill opacity is set'
        );
    });
});