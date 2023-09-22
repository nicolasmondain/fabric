module.exports = {

  root   : true,
  parser : '@typescript-eslint/parser',
  plugins: [

    '@typescript-eslint',

	],
  extends: [

    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
		'@sharingbox/eslint-config'

  ],
	parserOptions: {

		ecmaVersion: 2021,
		ecmaFeatures: {
			jsx: true
		},
		sourceType: 'module'

	},

	env: {

		es2021: true,
		browser: true,
		node: true,
		mocha: true

	},

	globals: {

    document: 'readonly',
    navigator: 'readonly',
    window: 'readonly'

},

rules: {

    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'no-useless-constructor': 'off',
    'no-magic-numbers': 'off',
		'new-cap': 'off'

	}

};
