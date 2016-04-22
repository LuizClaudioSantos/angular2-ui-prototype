const GlobalConfig = {
	rest: {
		//Space is capitalized because 'namespace' is a reserved string in TypeScript
		nameSpace: '/rest',
		baseURL: 'http://ui-prototype.atmire.com'
	},
	proxy: {
		nameSpace: '/',
		baseURL: 'http://oaktrust.library.tamu.edu'
	},
	ui: {
		nameSpace: '/',	
		baseURL: 'http://ui-prototype.atmire.com'
	}
};

export {GlobalConfig}