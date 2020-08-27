const {
	v2: { createCloudevent, createEventStream },
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
	handler: async ({ cloudevent }) => {
		try {
			if (cloudevent.enrichment) { return }

			console.log('testing')
			const enrichedCloudevent = createCloudevent({
				...cloudevent,
				enrichment: JSON.stringify('aaaaa'),
			})
			await rapids.emit({ cloudevent: enrichedCloudevent })
		} catch (err) {
			console.err(err)
		}
	},
	types: ['ddnlanm4-modify-string.2020-07-07'],
})
