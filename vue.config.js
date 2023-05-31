require = require('esm')(module);
const rout  = require('./src/router/rout.js');

module.exports = {
	pluginOptions: {
		i18n: {
			locale: 'ru',
			fallbackLocale: 'en',
			localeDir: 'locales',
			enableInSFC: true
		},
		sitemap: {
			baseURL: 'https://ff15.ru',
			routes: rout
		}
	},
	devServer: {
		port: 8080
	},
	configureWebpack: () => {
		if (process.env.NODE_ENV !== 'production') {
			devtool: 'source-map'
		}
	},
	productionSourceMap: false
}