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
			<div class="text-h6">{{ isNewRole ? 'Crear nuevo' : (createOrUpdate ? 'Actualizar' : 'Datos') }} rol</div>
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
					DATOS ROL
				</div>
				
				<q-input
					dense 
					outlined
					bg-color="white"
					v-model="code"
					ref="codeRef"
					type="text"
					label="Código"
					placeholder="Código"
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
						<q-icon name="abc" />
					</template>
				</q-input>

				<q-input
					dense 
					outlined
					bg-color="white"
					v-model="description"
					ref="descriptionRef"
					type="text"
					label="Descripción"
					placeholder="Descripción"
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
						@click="createUpdateRole" 
					>
						CREAR
					</q-btn>
				</div>
				<div v-else>
					<q-btn 
						class="q-btn" 
						style="font-size: 15px; margin: 2px; min-width: 100px"
						@click="createUpdateRole" 
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
import { addRole } from 'src/api/mutations/addRole';
import { updateRole } from 'src/api/mutations/updateRole';
import { useMutation } from '@vue/apollo-composable';


export default defineComponent({
	name: 'CreateUpdateRoleComponent',
	emits: ['close-create-update-role-dialog', 'get-roles'],
	props: {
		roleDataEntry: {
			type: null,
			required: true
		},
		roles: {
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
		}
	},
	async mounted(){
		// console.log('roleDataEntry', this.roleDataEntry)
		this.init();
		this.isMounted = true;
	},
	setup(){
		const description: any = ref(null);
		const code: any = ref(null);

		const descriptionRef: any = ref();
		const codeRef: any = ref();

		const { mutate: addRoleFunction } = useMutation(addRole);
		const { mutate: updateRoleFunction } = useMutation(updateRole);

		const dialogs: any = ref({
			createRole: {
        state: false,
        payload: {
          id: 'createRole',
          errorMessage: 'Error al crear el rol',
          successfulMessage: 'Rol creado de forma exitosa',
          buttonTask: 'CREAR',
          buttonClose: 'CANCELAR',
          content: '¿Está seguro que desea crear el rol?',
          title: {
            executing: 'Creando rol',
            executed: 'Rol creado',
            start: 'Crear rol',
          },
          function: async (params: any) => {
						const response: any = await addRoleFunction(params);					
            const success = !!response?.data;
            return success ? { 
              result: response?.data,
              success 
            } : { success }
          },
          params: null
        }
      },
			updateRole: {
        state: false,
        payload: {
          id: 'updateRole',
          errorMessage: 'Error al actualizar el rol',
          successfulMessage: 'Rol actualizado de forma exitosa',
          buttonTask: 'ACTUALIZAR',
          buttonClose: 'CANCELAR',
          content: '¿Está seguro que desea actualizar la rol?',
          title: {
            executing: 'Actualizando rol',
            executed: 'Rol actualizado',
            start: 'Actualizar rol',
          },
          function: async (params: any) => {
						const response: any = await updateRoleFunction(params);					
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
			description,
			code,
			dialogs,
			checkValidation,
			descriptionRef,
			codeRef,
			onValidate () {
				descriptionRef.value.validate();
				codeRef.value.validate();
			},
			onReset() {
				descriptionRef.value.resetValidation();
				codeRef.value.resetValidation();
			}
		}
	},
	methods: {
		init(){
			// console.log(this.roleDataEntry);
			this.isNewRole = !this.roleDataEntry ? true : false;
			
			if(!this.isNewRole){
				this.description = this.roleDataEntry.description;
				this.code = this.roleDataEntry.code;
			}
		},
		closeCreateUpdateRoleDialog(){
			this.$emit('close-create-update-role-dialog', {});
		},
		isRequiredStr (val: string) {
			return  isRequired(val);
		},
		clearFields(){
			this.code = null;
			this.description = null;

			this.onReset();
		},
		validation(){
			return this.code
			&& this.description;
		},
		async createUpdateRole(){
			if(this.validation()) {
				this.onReset();
				let role: any = {
					code : this.code,
					description: this.description
				};

				if(this.isNewRole){
					this.dialogs.createRole.payload = {
						...this.dialogs.createRole.payload,
						params: role
					};

					this.dialogs.createRole.state = true;
				}
				else {
					// console.log('this.roleDataEntry', this.roleDataEntry)
					role.id = this.roleDataEntry.id;
					this.dialogs.updateRole.payload = {
						...this.dialogs.updateRole.payload,
						params: role
					};

					this.dialogs.updateRole.state = true;
				}
			}
			else {
				this.onValidate();
			}
		},
		closeDialog(event: any){
      this.dialogs[event.id].state = false;
    },
		getRoles() {
			this.$emit('get-roles', {});
		},
		executedDialog(event: any){
      this.closeDialog(event);
			this.getRoles();
			this.closeCreateUpdateRoleDialog();
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