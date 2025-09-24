<template>
	<q-card 
		v-if="isMounted" 
		:style="{
			margin: '10px',
		}"
	>
		<div class="row justify-end items-center" style="margin-top: 10px; margin-right: 10px;">
			<q-icon
				name="close"
				@click="closeCheckVolunteerDialog"
				class="close-button"
			/>
		</div>
		<q-card-section>
			<div class="text-h6">{{ `${name}` }}</div>
    </q-card-section>
		<q-separator />
		<q-card-section v-if="view ? view == 'calendar' : true">
			<q-tabs
        v-model="tab"
				dense
				no-caps
        inline-label
				align="left"
				style="color: var(--q-primary)"
      >
        <q-tab name="personal-data" label="DATOS PERSONALES" icon="person"/>
        <q-tab v-if="view ? view == 'calendar' : isAdmin" name="theocratic-data" label="DATOS TEOCRÁTICOS" icon="person_add" />
      </q-tabs>
		</q-card-section>
		<q-card-section>
			<div style="width: 100%;">
				<div class="row wrap">
					<DetailItem v-if="view ? view == 'calendar' : isAdmin" name="Correo electrónico" :data="volunteerData.email"/>
					<DetailItem v-if="view ? view == 'calendar' : isAdmin" name="Sexo" :data="convertGender(volunteerData.gender)"/>
					<DetailItem v-if="view ? view == 'calendar' : isAdmin" name="Estado civil" :data="convertMaritalStatus(volunteerData.maritalStatus)"/>
					<DetailItem v-if="view ? view == 'calendar' : isAdmin" name="Fecha de nacimiento" :data="volunteerData.birthDate"/>
					<DetailItem v-if="view ? view == 'calendar' : isAdmin" name="Dirección" :data="volunteerData.address.formattedAddress"/>
					<DetailItem v-if="view ? view != 'calendar' : !isAdmin" name="Congregación" :data="team"/>
					<DetailItem name="Teléfono móvil" :data="formatPhoneNumber(phone)"/>
				</div>
			</div>
		</q-card-section>
	</q-card >
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import CheckVolunteerPersonalData from 'src/components/volunteers/CheckVolunteerPersonalData.vue';
import CheckVolunteerTheocraticData from 'src/components/volunteers/CheckVolunteerTheocraticData.vue';
import { useIdentityStore } from 'src/stores/identityStore';
import { storeToRefs } from 'pinia' 
import { viewDepthKey } from 'vue-router';

export default defineComponent({
	name: 'CheckVolunteerComponent',
	emits: ['close-check-volunteer-dialog'],
	components: {
    CheckVolunteerPersonalData,
		CheckVolunteerTheocraticData
  },
	props: {
		volunteerData: {
			type: null,
			required: true
		},
		view: {
			type: String,
			required: false
		},
	},
	data() {
		return {
			tab: 'personal-data',
			isMounted: false,
			isAdmin: false
		}
	},
	setup () {
    const store = useIdentityStore();
    const { getAttributes } = storeToRefs(store);
		const name: any = ref(null);

    return {
      getAttributes,
			name
    }
  },
	mounted(){
		// console.log(this.view)
		this.name = this.volunteerData?.firstName ? `${this.volunteerData.firstName} ${this.volunteerData.lastName}` : this.volunteerData.name;
		if(this.getAttributes){
      const attributes: any = this.getAttributes;
      this.isAdmin = attributes.admin;
    }
		this.isMounted = true;
	},
	methods: {
		closeCheckVolunteerDialog(){
			this.$emit('close-check-volunteer-dialog', {});
		}
	}
})
</script>

<style scoped lang="scss">
	.close-button {
		font-size: 20px;
		cursor: pointer;
	}

	.close-button:hover {
		color: $primary;
	}
</style>