const path         = require('path'); 									// eslint-disable-line
const TerserPlugin = require('terser-webpack-plugin'); 	// eslint-disable-line
const CopyPlugin   = require('copy-webpack-plugin');    // eslint-disable-line

const configuration = {

	entry: [

		path.resolve(__dirname, '../node_modules/regenerator-runtime/runtime.js'),
		path.resolve(__dirname, '../src/index.ts')

	],
	mode  : process.env.NODE_ENV === 'development' ? 'development' : 'production',
	target: 'web',
	output: {

		path          : path.resolve(__dirname, '../dist'),
		filename      : '[name].js',
		libraryTarget : 'umd',
		umdNamedDefine: true,
		globalObject  : 'this',
		library       : 'extendedfabric'

	},
	module: {

		rules: [

			{

				test   : /\.ts$/u,
				exclude: /node_modules/u,
				include: path.resolve(__dirname, '../src'),
				use    : ['babel-loader', 'ts-loader']

			}

		]

	},
	resolve: {

		fallback: {

			fs  : false,
			path: require.resolve('path-browserify')

		},
    extensions: ['.tsx', '.ts', '.js', '.wasm']

  },
	plugins: [

		new CopyPlugin({

      patterns: [

        {

					from: path.resolve(__dirname, '../src/filters/img'),
					to  : path.resolve(__dirname, '../dist/filters/img')

				}

      ]

    }),

		new CopyPlugin({

      patterns: [

        {

					from       : 'src/**/*.wasm',
          globOptions: {

            dot      : true,
            gitignore: true,
            ignore   : ['emsdk/**']

          },
					to: '[name][ext]'

				}

      ]

    })

	],
	performance: {

    maxAssetSize     : 500000,
		maxEntrypointSize: 500000

  },
	optimization: {

		minimizer: [new TerserPlugin({

      extractComments: false

    })]

  }

};

module.exports = configuration;
