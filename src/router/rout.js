module.exports = [
	{
		name: 'promo',
		path: '/',
	},
	{
		path: '/tournaments',
		meta: {
			sitemap: {
				priority: 1,
				changefreq: 'always',
			},
		}
	},
	{
		path: '/ratings',
		meta: {
			sitemap: {
				priority: 0.1,
				changefreq: 'always',
			},
		}
	},
	{
		path: '/season-stats',
		meta: {
			sitemap: {
				priority: 0.1,
				changefreq: 'always',
			},
		}
	},
	// {
	// 	name: 'tournament-detail',
	// 	path: '/tournaments/:tid',
	// },
	// {
	// 	path: '/profiles/:uid',
	// },
	{
		path: '/error404',
		meta: {
			sitemap: {
				priority: 0.1,
				changefreq: 'monthly',
			},
		}
	},
	{
		path: '/faq',
		meta: {
			sitemap: {
				priority: 0.5,
				changefreq: 'daily',
			},
		}
	},
	{
		path: '/privacy',
		meta: {
			sitemap: {
				priority: 0.1,
				changefreq: 'weekly',
			},
		}
	},
	{
		path: '/agreement',
		meta: {
			sitemap: {
				priority: 0.1,
				changefreq: 'weekly',
			},
		}
	},
	// {
	// 	path: '/blog/:category/:id(\\d+)/:title?',
	// 	meta: {
	// 		sitemap: {			
	// 			slugs: [
	// 				{
	// 					id: 1,
	// 					title: 'hello-world',
	// 					category: 'infos',
	// 				},
	// 				{
	// 					id: 2,
	// 					title: 'how-to-fold-socks-faster',
	// 					category: 'lifehacks',

	// 					priority: 0.9,
	// 					lastmod: 'February 02, 2020 09:24',
	// 				}
	// 			]
	// 		}
	// 	}
	// },
	// {
	// 	path: '/user/:id',
	// 	meta: {
	// 		sitemap: {
	// 			// Slugs can also be provided asynchronously
	// 			// The callback must always return an array
	// 			slugs: async () => await getActiveUsers(),
	// 		}
	// 	}
	// },
	// path: '/user/:id',
	// meta: {
	// 		sitemap: {
	// 				// Meta properties on parent will be
	// 				// inherited by their children
	// 				changefreq: 'monthly',
	// 				priority:   0.7,

	// 				slugs: getUserList(),
	// 		}
	// },
]
