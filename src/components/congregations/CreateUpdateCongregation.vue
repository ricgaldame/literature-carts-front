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
				@click="closeCreateUpdateCongregationDialog"
				class="close-button"
			/>
		</div>
		<q-card-section>
			<div class="text-h6">{{ isNewCongregation ? 'Crear nuevo' : (createOrUpdate ? 'Actualizar' : 'Datos') }} voluntario</div>
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
					DATOS CONGREGACIÓN
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
						<q-icon name="perm_identity" />
					</template>
				</q-input>

				<q-input
					dense 
					outlined
					bg-color="white"
					v-model="code"
					ref="codeRef"
					type="text"
					label="Número"
					placeholder="Número"
					lazy-rules
					:rules="[isCongregationCodeStr]"
					:style="{
						width: $q.screen.lt.sm ? '100%' : '49%', 
						marginTop: $q.screen.lt.sm ? '25px' : '10px',
						marginBottom: '0px',
						padding: '0px'
					}"
					:disable="!createOrUpdate"
				>
					<template v-slot:prepend>
						<q-icon name="perm_identity" />
					</template>
				</q-input>
			</div>
		</q-card-section>
		<q-card-section>
			<div class="row justify-end items-center"  v-if="createOrUpdate">
				<div v-if="isNewCongregation">
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
						@click="createUpdateCongregation" 
					>
						CREAR
					</q-btn>
				</div>
				<div v-else>
					<q-btn 
						class="q-btn" 
						style="font-size: 15px; margin: 2px; min-width: 100px"
						@click="createUpdateCongregation" 
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
import { isCongregationCode, isRequired, isEmail, checkValidation } from 'src/tools/validations';
import CustomDialog from 'src/components/CustomDialog.vue';
import { addCongregation } from 'src/api/mutations/addCongregation';
import { updateCongregation } from 'src/api/mutations/updateCongregation';
import { useMutation } from '@vue/apollo-composable';


export default defineComponent({
	name: 'CreateUpdateCongregationComponent',
	emits: ['close-create-update-congregation-dialog', 'get-congregations'],
	props: {
		congregationDataEntry: {
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
			isNewCongregation: false,
		}
	},
	async mounted(){
		// console.log('congregationDataEntry', this.congregationDataEntry)
		this.init();
		this.isMounted = true;
	},
	setup(){
		const name: any = ref(null);
		const code: any = ref(null);


		const nameRef: any = ref();
		const codeRef: any = ref();

		const { mutate: addCongregationFunction } = useMutation(addCongregation);
		const { mutate: updateCongregationFunction } = useMutation(updateCongregation);

		const dialogs: any = ref({
			createCongregation: {
        state: false,
        payload: {
          id: 'createCongregation',
          errorMessage: 'Error al crear el congregación',
          successfulMessage: 'Congregación creada de forma exitosa',
          buttonTask: 'CREAR',
          buttonClose: 'CANCELAR',
          content: '¿Está seguro que desea crear la congregación?',
          title: {
            executing: 'Creando congregación',
            executed: 'Congregación creada',
            start: 'Crear congregación',
          },
          function: async (params: any) => {
						const response: any = await addCongregationFunction(params);					
            const success = !!response?.data;
            return success ? { 
              result: response?.data,
              success 
            } : { success }
          },
          params: null
        }
      },
			updateCongregation: {
        state: false,
        payload: {
          id: 'updateCongregation',
          errorMessage: 'Error al actualizar la conhgregación',
          successfulMessage: 'Congregación actualizada de forma exitosa',
          buttonTask: 'ACTUALIZAR',
          buttonClose: 'CANCELAR',
          content: '¿Está seguro que desea actualizar la conhgregación?',
          title: {
            executing: 'Actualizando conhgregación',
            executed: 'Congregación actualizada',
            start: 'Actualizar conhgregación',
          },
          function: async (params: any) => {
						const response: any = await updateCongregationFunction(params);					
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
			name,
			code,
			dialogs,
			checkValidation,
			nameRef,
			codeRef,
			onValidate () {
				nameRef.value.validate();
				codeRef.value.validate();
			},
			onReset() {
				nameRef.value.resetValidation();
				codeRef.value.resetValidation();
			}
		}
	},
	methods: {
		init(){
			// console.log(this.congregationDataEntry);
			this.isNewCongregation = !this.congregationDataEntry ? true : false;
			
			if(!this.isNewCongregation){
				this.name = this.congregationDataEntry.name;
				this.code = this.congregationDataEntry.code;
			}
		},
		closeCreateUpdateCongregationDialog(){
			this.$emit('close-create-update-congregation-dialog', {});
		},
		isRequiredStr (val: string) {
			return  isRequired(val);
		},
		isCongregationCodeStr (val: string) {
			return  isCongregationCode(val);
		},
		clearFields(){
			this.code = null;
			this.name = null;

			this.onReset();
		},
		validation(){
			return this.code
			&& this.name;
		},
		async createUpdateCongregation(){
			if(this.validation()) {
				this.onReset();
				let congregation: any = {
					code : this.code,
					name: this.name
				};

				if(this.isNewCongregation){
					this.dialogs.createCongregation.payload = {
						...this.dialogs.createCongregation.payload,
						params: congregation
					};

					this.dialogs.createCongregation.state = true;
				}
				else {
					// console.log('this.congregationDataEntry', this.congregationDataEntry)
					congregation.id = this.congregationDataEntry.id;
					this.dialogs.updateCongregation.payload = {
						...this.dialogs.updateCongregation.payload,
						params: congregation
					};

					this.dialogs.updateCongregation.state = true;
				}
			}
			else {
				this.onValidate();
			}
		},
		closeDialog(event: any){
      this.dialogs[event.id].state = false;
    },
		getCongregations() {
			this.$emit('get-congregations', {});
		},
		executedDialog(event: any){
      this.closeDialog(event);
			this.getCongregations();
			this.closeCreateUpdateCongregationDialog();
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