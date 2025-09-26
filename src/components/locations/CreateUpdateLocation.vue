<template>
	<q-card 
		v-if="isMounted" 
		:style="{
			margin: '10px',
			width: $q.screen.lt.sm ? '90%': '100%'
		}"
	>
		<div class="row justify-end items-center" style="margin-top: 10px; margin-right: 10px;">
			<q-icon
				name="close"
				@click="closeCreateUpdateRoleDialog"
				class="close-button"
			/>
		</div>
		<q-card-section>
			<div class="text-h6">{{ isNewRole ? 'Crear nuevo' : (createOrUpdate ? 'Actualizar' : 'Datos') }} punto</div>
    </q-card-section>
		<q-separator />
		<q-card-section>
			<div class="row justify-between items-center">
				<div 
					class="row justify-between items-center" 
					style="
						width: 100%; 
						font-size: 15px; 
						color: var(--q-primary); 
						font-weight: bold; 
						margin-top: 10px;
						margin-bottom: 10px;
					"
				>
					DATOS PUNTO
				</div>
				
				<q-input
					dense 
					outlined
					bg-color="white"
					v-model="name"
					ref="nameRef"
					type="text"
					label="Nombre"
					placeholder="Nombre"
					lazy-rules
					:rules="[isRequiredStr]"
					:style="{
						width: $q.screen.lt.sm ? '100%' : '49%', 
						marginTop: $q.screen.lt.sm ? '25px' : '10px',
						marginBottom: '0px',
						padding: '0px'
					}"
					:disable="!createOrUpdate"
				>
					<template v-slot:prepend>
						<q-icon name="edit" />
					</template>
				</q-input>

				<q-select
						dense
						outlined
						bg-color="white"
						v-model="congregation"
						type="text"
						label="Congregación"
						:style="{
							width: $q.screen.lt.sm ? '100%' : '49%', 
							marginTop: $q.screen.lt.sm ? '25px' : '10px',
							marginBottom: '0px',
							padding: '0px'
						}"
						use-input
						@filter="filterCongregation"
						:options="congregationOptions"
						option-value="id"
						option-label="name"
						behavior="menu"
						:error="noCongregation"
						error-message="Debe seleccionar congregación"
						@update:model-value="() => noCongregation = false"
						:disable="!createOrUpdate"
					>
						<template v-slot:prepend>
							<q-icon name="people_alt" />
						</template>
						<template v-slot:no-option>
							<q-item>
								<q-item-section class="text-grey">
									Sin resultados
								</q-item-section>
							</q-item>
						</template>
					</q-select>

				<q-input
					dense 
					outlined
					bg-color="white"
					v-model="reference"
					ref="referenceRef"
					type="text"
					label="Referencia"
					placeholder="Referencia"
					lazy-rules
					:rules="[isRequiredStr]"
					:style="{
						width: '100%', 
						marginTop: '20px',
						marginBottom: '0px',
						padding: '0px'
					}"
					:disable="!createOrUpdate"
				>
					<template v-slot:prepend>
						<q-icon name="location_on" />
					</template>
				</q-input>
			</div>
		</q-card-section>
		<q-card-section>
			<div class="row justify-end items-center"  v-if="createOrUpdate">
				<div v-if="isNewRole">
					<q-btn 
						class="q-btn btn-transparent" 
						style="font-size: 15px; margin: 2px; min-width: 100px"
						@click="clearFields" 
					>
						LIMPIAR
					</q-btn>
					<q-btn 
						class="q-btn" 
						style="font-size: 15px; margin: 2px; min-width: 100px"
						@click="createUpdateLocation" 
					>
						CREAR
					</q-btn>
				</div>
				<div v-else>
					<q-btn 
						class="q-btn" 
						style="font-size: 15px; margin: 2px; min-width: 100px"
						@click="createUpdateLocation" 
					>
						ACTUALIZAR
					</q-btn>
				</div>
			</div>
		</q-card-section>
	</q-card >
	<div v-for="d in Object.keys(dialogs)" :key="d">
    <q-dialog v-model="dialogs[d].state" persistent>
      <CustomDialog 
        :payload="dialogs[d].payload"
        @close-dialog="closeDialog"
        @executed-dialog="executedDialog"
				:style="{ width: $q.screen.lt.sm ? '85%' : '400px' }"
      />
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { isRequired, checkValidation } from 'src/tools/validations';
import CustomDialog from 'src/components/CustomDialog.vue';
import { addLocation } from 'src/api/mutations/addLocation';
import { updateLocation } from 'src/api/mutations/updateLocation';
import { useMutation } from '@vue/apollo-composable';


export default defineComponent({
	name: 'CreateUpdateLocationComponent',
	emits: ['close-create-update-location-dialog', 'get-locations'],
	props: {
		locationDataEntry: {
			type: null,
			required: true
		},
		locations: {
			type: null,
			required: true
		},
		congregations: {
			type: null,
			required: true
		},
		createOrUpdate: {
			type: Boolean,
			required: true
		}
	},
	components: {
		CustomDialog
  },
	data() {
		return {
			isMounted: false,
			isNewRole: false,
			noCongregation: false,
		}
	},
	async mounted(){
		// console.log('locationDataEntry', this.locationDataEntry)
		this.init();
		this.isMounted = true;
	},
	setup(){
		const reference: any = ref(null);
		const name: any = ref(null);

		const referenceRef: any = ref();
		const nameRef: any = ref();

		const { mutate: addLocationFunction } = useMutation(addLocation);
		const { mutate: updateLocationFunction } = useMutation(updateLocation);

		const congregation: any = ref(null);
		const congregationOptions: any = ref(null);

		const dialogs: any = ref({
			createLocation: {
        state: false,
        payload: {
          id: 'createLocation',
          errorMessage: 'Error al crear el punto',
          successfulMessage: 'Punto creado de forma exitosa',
          buttonTask: 'CREAR',
          buttonClose: 'CANCELAR',
          content: '¿Está seguro que desea crear el punto?',
          title: {
            executing: 'Creando punto',
            executed: 'Punto creado',
            start: 'Crear punto',
          },
          function: async (params: any) => {
						const response: any = await addLocationFunction(params);					
            const success = !!response?.data;
            return success ? { 
              result: response?.data,
              success 
            } : { success }
          },
          params: null
        }
      },
			updateLocation: {
        state: false,
        payload: {
          id: 'updateLocation',
          errorMessage: 'Error al actualizar el punto',
          successfulMessage: 'Punto actualizado de forma exitosa',
          buttonTask: 'ACTUALIZAR',
          buttonClose: 'CANCELAR',
          content: '¿Está seguro que desea actualizar la punto?',
          title: {
            executing: 'Actualizando punto',
            executed: 'Punto actualizado',
            start: 'Actualizar punto',
          },
          function: async (params: any) => {
						const response: any = await updateLocationFunction(params);					
            const success = !!response?.data;
            return success ? { 
              result: response?.data,
              success 
            } : { success }
          },
          params: null
        }
      },
			warningValidation: {
        state: false,
        payload: {
          id: 'warningValidation',
        }
      },
    });
		
		return {
			reference,
			name,
			dialogs,
			checkValidation,
			referenceRef,
			nameRef,
			congregation,
			congregationOptions,
			onValidate () {
				referenceRef.value.validate();
				nameRef.value.validate();
			},
			onReset() {
				referenceRef.value.resetValidation();
				nameRef.value.resetValidation();
			}
		}
	},
	methods: {
		init(){
			// console.log(this.locationDataEntry);
			this.isNewRole = !this.locationDataEntry ? true : false;

			this.congregationOptions = this.congregations.map((congregation: any) => ({
				id: parseInt(congregation.id),
				name: congregation.name,
				code: congregation.code
			}));
			
			if(!this.isNewRole){
				this.reference = this.locationDataEntry.reference;
				this.name = this.locationDataEntry.name;

				this.congregation = this.congregationOptions.filter((congregation: any) => {
					return parseInt(this.locationDataEntry.congregation.id) == congregation.id;
				});
				this.congregation = this.congregation.length > 0 ? this.congregation[0] : null;
			}
		},
		closeCreateUpdateRoleDialog(){
			this.$emit('close-create-update-location-dialog', {});
		},
		isRequiredStr (val: string) {
			return  isRequired(val);
		},
		clearFields(){
			this.name = null;
			this.reference = null;
			this.congregation = null;
			this.noCongregation = false;

			this.onReset();
		},
		validation(){
			return this.name
			&& this.reference
			&& this.congregation;
		},
		async createUpdateLocation(){
			if(this.validation()) {
				this.onReset();
				let location: any = {
					name : this.name,
					reference: this.reference,
					congregation_code: this.congregation.code,
				};

				if(this.isNewRole){
					this.dialogs.createLocation.payload = {
						...this.dialogs.createLocation.payload,
						params: location
					};

					this.dialogs.createLocation.state = true;
				}
				else {
					// console.log('this.locationDataEntry', this.locationDataEntry)
					location.id = this.locationDataEntry.id;
					this.dialogs.updateLocation.payload = {
						...this.dialogs.updateLocation.payload,
						params: location
					};

					this.dialogs.updateLocation.state = true;
				}
			}
			else {
				this.noCongregation = this.congregation ? false : true;
				this.onValidate();
			}
		},
		closeDialog(event: any){
      this.dialogs[event.id].state = false;
    },
		getRoles() {
			this.$emit('get-locations', {});
		},
		executedDialog(event: any){
      this.closeDialog(event);
			this.getRoles();
			this.closeCreateUpdateRoleDialog();
    },
		searchCongregation(partOfName: string){
			this.congregationOptions = this.congregations
			.filter((congregation: any) => {
				return congregation.name.toLowerCase().includes(partOfName.toLowerCase());
			})
			.map((congregation: any) => ({
				id: parseInt(congregation.id),
				name: congregation.name,
				code: congregation.code
			}));
		},
		filterCongregation(val: any, update: any) {
			// console.log(val)
			if (val === '') {
				update(() => {
					this.congregationOptions = this.congregations.map((congregation: any) => {
						return {
							id: parseInt(congregation.id),
							name: congregation.name,
							code: congregation.code
						}
					});
				})
				return
			}
			update(() => {
				this.searchCongregation(val);
			})
    },
	},
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

	.q-dialog__inner--minimized > div {
    max-width: 750px;
		// min-height: 500px;
  }
</style>