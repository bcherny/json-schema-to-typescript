export const input = {
	type: 'object',
	required: [
		'a',
		'b'
	],
	properties: {
		a: {
			type: 'string',
			tsReadonly: true
		},
		b: {
			type: 'string'
		},
		c: {
			type: 'string',
			tsReadonly: true
		},
		d: {
			type: 'string'
		}
	},
	tsReadonly: false
}

export const options = {
	readonlyKeyword: true
}
