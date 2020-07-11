<script>
import { publish, subscribe } from './utilities/cloudevents';

export default {
	data() {
		return {
			input: this.generateRandomString(),
			items: [],
		};
	},
	created() {
		subscribe({
			handler: ({ payload }) => {
				this.items.unshift(payload);
			},
			type: 'ddnlanm4-modify-string.2020-07-07',
		});
	},
	methods: {
		generateRandomString() {
			return Math.random().toString(36).substring(2, 15)
				+ Math.random().toString(36).substring(2, 15);
		},
		submit() {
			publish({
				payloads: [this.input],
				type: 'ddnlanm4-modify-string.2020-07-07',
			});
			this.input = this.generateRandomString();
		},
	},
};
</script>

<template>
	<main>
		<h1>Hello world!</h1>
		<form @submit.prevent='submit'>
			<label for='input'>
				Payload
			</label>
			<input
			id='input'
			name='input'
			type='text'
			v-model='input'
			/>
			<button type='submit'>Submit</button>
		</form>

		<h2>Numbers from input</h2>
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
