<template>
	<div class="column" style="margin-top: 10px; margin-right: 20px;">
		<div class="text-bold text-subtitle1" style="color: var(--q-primary)">
			{{ name }}
		</div>
		<div class="column" v-if="isArray">
			<div v-for="(item, index) in data" :key="index">{{ `- ${item}` }}</div>
		</div>
		<div v-else>
			<div v-if="name !== 'Teléfono móvil'">{{ data }}</div>
			<div v-else
				class="row justify-between"
			>
				<a
					:href="`tel:+${data}`"
					target="_blank"
					rel="noopener"
				>
					<q-icon name="phone_iphone" size="25px" class="text-primary cursor-pointer" />
				</a>

				<a
					:href="`https://wa.me/${data.replace(/\s+/g, '')}`"
					target="_blank"
					rel="noopener"
					style="margin-left: 5px;"
				>
					<q-icon name="fa-brands fa-whatsapp" size="25px" class="text-primary cursor-pointer" />
				</a>
				<div style="margin-left: 5px;">{{ data }}</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'DetailItemComponent',
	props: {
		name: {
			type: String,
			required: true
		},
		data: {
			type: null,
			required: true,
		},
	},
	mounted() {
		this.isArray = Array.isArray(this.data);
	},
	data(){
		return {
			isArray: false,
		}
	},
})
</script>
