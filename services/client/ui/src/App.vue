<script>
import { publish, subscribe } from './utilities/cloudevents';

export default {
	created() {
		subscribe({
			handler: ({ payload }) => {
				console.log(payload);
			},
			type: 'modify-string.2020-07-07',
		});
	},
	methods: {
		publish,
	},
};
</script>

<template>
	<main>
		<h1>Hello world!</h1>
		<button @click='publish({
			payloads: ["1b2b3b45lk345jl34kj5"],
			type: "modify-string.2020-07-07",
		})'>
			Send string
		</button>
	</main>
</template>
