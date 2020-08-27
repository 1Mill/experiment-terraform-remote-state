const {
	v2: { createCloudevent, createEventStream },
} = require('@1mill/cloudevents')

const rapids = createEventStream({
	id: 'testing',
	protocal: 'kafka',
	urls: ['rapids:9092'],
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
