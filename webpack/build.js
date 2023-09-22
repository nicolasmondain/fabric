/* eslint-disable */

const webpack       = require('webpack');
const configuration = require('./webpack.common.js');

webpack(configuration, (error, stats) => {

	if(error){

		console.error(error);

		return error;

	}

	const jsonStats = stats.toJson();

	if(jsonStats.errorsCount){

		return jsonStats.errors.map((stat) => console.log(stat));

	}

	return 0;

});
