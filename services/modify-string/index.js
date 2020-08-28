const {
	v2: { createEventStream, enrich }
} = require('@1mill/cloudevents')

const rapids = createEventStream({
	id: 'services.modify-string',
	mechanism: process.env.RAPIDS_MECHANISM,
	password: process.env.RAPIDS_PASSWORD,
	protocal: process.env.RAPIDS_PROTOCAL,
	urls: (process.env.RAPIDS_URLS || '').split(','),
	username: process.env.RAPIDS_USERNAME,
})

rapids.listen({
	handler: async ({ cloudevent, data, isEnriched }) => {
		try {
			if (isEnriched) { return }

			const string = data || ''
			const numbers = string.match(/[0-9 , \.]+/g) || []
			const enrichment = numbers.join('')

			await rapids.emit({
				cloudevent: enrich({ cloudevent, enrichment })
			})
		} catch (err) {
			console.err(err)
		}
	},
	types: ['ddnlanm4-modify-string.2020-07-07'],
})
