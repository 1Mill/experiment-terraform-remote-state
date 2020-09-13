const {
	v2: { createEventStream, enrich }
} = require('@1mill/cloudevents')

const ID = 'services.modify-string'
const rapids = createEventStream({
	id: ID,
	mechanism: process.env.RAPIDS_MECHANISM,
	password: process.env.RAPIDS_PASSWORD,
	protocal: process.env.RAPIDS_PROTOCAL,
	urls: (process.env.RAPIDS_URLS || '').split(','),
	username: process.env.RAPIDS_USERNAME,
})
const river = createEventStream({
	id: ID,
	mechanism: process.env.RAPIDS_MECHANISM,
	password: process.env.RAPIDS_PASSWORD,
	protocal: process.env.RAPIDS_PROTOCAL,
	urls: (process.env.RAPIDS_URLS || '').split(','),
	username: process.env.RAPIDS_USERNAME,
})

river.listen({
	handler: async ({ cloudevent, data, isEnriched }) => {
		try {
			// If already enriched, do nothing
			if (isEnriched) { return }

			// Perform buisness logic
			const string = data || ''
			const numbers = string.match(/[0-9 , \.]+/g) || []
			const enrichment = numbers.join('')

			// Emit enriched cloudevent back to rapids
			await rapids.emit({
				cloudevent: enrich({ cloudevent, enrichment })
			})
		} catch (err) {
			console.err(err)
		}
	},
	types: ['ddnlanm4-modify-string.2020-07-07'],
})
