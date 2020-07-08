<script>
import { publish, subscribe } from './utilities/cloudevents';

export default {
	data() {
		return {
			items: [],
		};
	},
	created() {
		subscribe({
			handler: ({ payload }) => {
				this.items.unshift(payload);
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
			payloads: ["54323"],
			type: "modify-string.2020-07-07",
		})'>
			Send string
		</button>

		<h2>List items</h2>
		<ul>
			<li
			v-for='(item, index) in items'
			:key='item + index'
			>
				{{ item }}
			</li>
		</ul>
	</main>
</template>
