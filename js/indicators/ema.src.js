'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var isArray = H.isArray,
	seriesType = H.seriesType;

// Utils:
function accumulateAverage(points, xVal, yVal, i, index) {
	var xValue = xVal[i],
		yValue = index < 0 ? yVal[i] : yVal[i][index];
		
	points.push([xValue, yValue]);
}

function populateAverage(points, xVal, yVal, i, EMApercent, calEMA, index) {
	var x = xVal[i - 1],
		yValuePrev = index < 0 ? yVal[i - 2] : yVal[i - 2][index],
		yValue = index < 0 ? yVal[i - 1] : yVal[i - 1][index],
		prevPoint, y;

	prevPoint = calEMA === 0 ? yValuePrev : calEMA;
	y = ((yValue * EMApercent) + (prevPoint * (1 - EMApercent)));

	return [x, y];
}
/**
 * The EMA series type.
 *
 * @constructor seriesTypes.ema
 * @augments seriesTypes.line
 */
seriesType('ema', 'sma', 
	/**
	 * Exponential moving average indicator (EMA). This series requires `linkedTo` option to be set.
	 * 
	 * @extends {plotOptions.line}
	 * @product highstock
	 * @sample {highstock} stock/indicators/ema Exponential moving average indicator
	 * @since 6.0.0
	 * @excluding
	 * 			allAreas,colorAxis,compare,compareBase,joinBy,keys,stacking,
	 * 			showInNavigator,navigatorOptions,pointInterval,pointIntervalUnit,
	 *			pointPlacement,pointRange,pointStart
	 * @optionparent plotOptions.ema
	 */
	{
		/**
		 * The series name.
		 * 
		 * @type {String}
		 * @since 6.0.0
		 * @product highstock
		 */
		name: 'EMA (14)',
		tooltip: {
			/**
			 * Number of decimals in indicator series.
			 * 
			 * @type {Number}
			 * @since 6.0.0
			 * @product highstock
			 */
			valueDecimals: 4
		},
		/**
		 * The main series ID that indicator will be based on. Required for this indicator.
		 * 
		 * @type {String}
		 * @since 6.0.0
		 * @product highstock
		 */
		linkedTo: undefined,
		params: {
			/**
			 * The point index which indicator calculations will base.
			 * For example using OHLC data, index=2 means SMA will be calculated using Low values.
			 * 
			 * @type {Number}
			 * @since 6.0.0
			 * @product highstock
			 */
			index: 0,
			/**
			 * The base period for indicator calculations.
			 * 
			 * @type {Number}
			 * @since 6.0.0
			 * @product highstock
			 */
			period: 14
		}
	}, {
		getValues: function (series, params) {
			var period = params.period,
				xVal = series.xData,
				yVal = series.yData,
				yValLen = yVal ? yVal.length : 0,
				EMApercent = (2 / (period + 1)),
				calEMA = 0,
				range = 1,
				xValue = xVal[0],
				yValue = yVal[0],
				EMA = [],
				xData = [],
				yData = [],
				index = -1,
				i, points,
				EMAPoint;

			// Check period, if bigger than points length, skip
			if (xVal.length <= period) {
				return false;
			}

			// Switch index for OHLC / Candlestick / Arearange
			if (isArray(yVal[0])) {
				index = params.index ? params.index : 0;
				yValue = yVal[0][index];
			}

			// Starting point
			points = [[xValue, yValue]];

			// Accumulate first N-points
			while (range !== period) {
				accumulateAverage(points, xVal, yVal, range, index);
				range++;
			}

			// Calculate value one-by-one for each period in visible data
			for (i = range; i < yValLen; i++) {
				EMAPoint = populateAverage(points, xVal, yVal, i, EMApercent, calEMA, index);
				EMA.push(EMAPoint);
				xData.push(EMAPoint[0]);
				yData.push(EMAPoint[1]);
				calEMA = EMAPoint[1];

				accumulateAverage(points, xVal, yVal, i, index);
			}

			EMAPoint = populateAverage(points, xVal, yVal, i, EMApercent, calEMA, index);
			EMA.push(EMAPoint);
			xData.push(EMAPoint[0]);
			yData.push(EMAPoint[1]);

			return {
				values: EMA,
				xData: xData,
				yData: yData
			};
		}
	});

/**
 * A `EMA` series. If the [type](#series.ema.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [plotOptions.series](#plotOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * ema](#plotOptions.ema).
 * 
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.ema
 * @excluding data,dataParser,dataURL
 * @product highstock
 * @apioption series.ema
 */

/**
 * An array of data points for the series. For the `EMA` series type,
 * points are calculated dynamically.
 * 
 * @type {Array<Object|Array>}
 * @since 6.0.0
 * @extends series.line.data
 * @product highstock
 * @apioption series.ema.data
 */