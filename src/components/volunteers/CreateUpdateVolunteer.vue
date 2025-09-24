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
				@click="closeCreateUpdateVolunteerDialog"
				class="close-button"
			/>
		</div>
		<q-card-section>
			<div class="text-h6">{{ isNewVolunteer ? 'Crear nuevo' : (createOrUpdate ? 'Actualizar' : 'Datos') }} voluntario</div>
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
					DATOS PERSONALES
				</div>

				<q-input
					dense 
					outlined
					bg-color="white"
					v-model="email"
					ref="emailRef"
					type="text"
					label="Correo electrónico"
					placeholder="usuario@email.com"
					lazy-rules
					:rules="[isEmailStr]"
					:style="{
						width: $q.screen.lt.sm ? '100%' : '49%', 
						marginTop: '10px',
						marginBottom: '0px',
						padding: '0px'
					}"
					:disable="!isNewVolunteer || !createOrUpdate"
				>
					<template v-slot:prepend>
						<q-icon name="mail" />
					</template>
				</q-input>

				<q-input
					dense 
					outlined
					bg-color="white"
					v-model="names"
					ref="namesRef"
					type="text"
					label="Nombres"
					placeholder="Nombres"
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
					v-model="firstSurname"
					ref="firstSurnameRef"
					type="text"
					label="Apellido Paterno"
					placeholder="Apellido Paterno"
					lazy-rules
					:rules="[isRequiredStr]"
					:style="{
						width: $q.screen.lt.sm ? '100%' : '49%',  
						marginTop: '25px',
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
					v-model="secondSurname"
					ref="secondSurnameRef"
					type="text"
					label="Apellido Materno"
					placeholder="Apellido Materno"
					lazy-rules
					:rules="[isRequiredStr]"
					:style="{
						width: $q.screen.lt.sm ? '100%' : '49%',  
						marginTop: '25px',
						marginBottom: '0px',
						padding: '0px'
					}"
					:disable="!createOrUpdate"
				>
					<template v-slot:prepend>
						<q-icon name="perm_identity" />
					</template>
				</q-input>

				<div
					class="row justify-between items-center" 
					:style="{
						width: $q.screen.lt.sm ? '100%' : '49%', 
						margin: '0px',
						padding: '0px'
					}"
				>
					<div 
						class="row justify-between items-center" 
						style="
							width: 100%; 
							font-size: 15px; 
							color: var(--q-primary); 
							font-weight: bold; 
							margin-top: 30px;
							margin-bottom: 10px;
						"
					>
						DATOS TEOCRÁTICOS
					</div>

					<q-select
						dense
						outlined
						bg-color="white"
						v-model="congregation"
						type="text"
						label="Congregación"
						:style="{
							width: '100%', 
							marginTop: '10px',
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
				</div>
				
				<div
					class="row justify-between items-center" 
					:style="{
						width: $q.screen.lt.sm ? '100%' : '49%', 
						margin: '0px',
						padding: '0px'
					}"
				>
					<div 
						class="row justify-between items-center" 
						style="
							width: 100%; 
							font-size: 15px; 
							color: var(--q-primary); 
							font-weight: bold; 
							margin-top: 30px;
							margin-bottom: 10px;
						"
					>
						PERFIL
					</div>

					<q-select
						dense
						outlined
						bg-color="white"
						v-model="role"
						type="text"
						label="Rol"
						:style="{
							width: '100%', 
							marginTop: '10px',
							marginBottom: '0px',
							padding: '0px'
						}"
						use-input
						@filter="filterRole"
						:options="roleOptions"
						option-value="id"
						option-label="name"
						behavior="menu"
						:error="noRole"
						error-message="Debe seleccionar rol"
						@update:model-value="() => noRole = false"
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
				</div>
			</div>
		</q-card-section>
		<q-card-section>
			<div class="row justify-end items-center"  v-if="createOrUpdate">
				<div v-if="isNewVolunteer">
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
						@click="createUpdateVolunteer" 
					>
						CREAR
					</q-btn>
				</div>
				<div v-else>
					<q-btn 
						class="q-btn" 
						style="font-size: 15px; margin: 2px; min-width: 100px"
						@click="createUpdateVolunteer" 
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
import { isRequired, isEmail, checkValidation } from 'src/tools/validations';
import CustomDialog from 'src/components/CustomDialog.vue';
import { addUser } from 'src/api/mutations/addUser';
import { updateUser } from 'src/api/queries/updateUser';
import { useMutation } from '@vue/apollo-composable';


export default defineComponent({
	name: 'CreateUpdateVolunteerComponent',
	emits: ['close-create-update-volunteer-dialog', 'get-volunteers'],
	props: {
		volunteerDataEntry: {
			type: null,
			required: true
		},
		congregations: {
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
			isNewVolunteer: false,
			noCongregation: false,
			noRole: false,
		}
	},
	async mounted(){
		// console.log('volunteerDataEntry', this.volunteerDataEntry)
		this.init();
		this.isMounted = true;
	},
	setup(){
		const email: any = ref(null);
		const names: any = ref(null);
		const firstSurname: any = ref(null);
		const secondSurname: any = ref(null);
		const congregation: any = ref(null);
		const role: any = ref(null);
		const congregationOptions: any = ref(null);
		const roleOptions: any = ref(null);


		const emailRef: any = ref();
		const namesRef: any = ref();
		const firstSurnameRef: any = ref();
		const secondSurnameRef: any = ref();

		const { mutate: addUserFunction } = useMutation(addUser);
		const { mutate: updateUserFunction } = useMutation(updateUser);

		const dialogs: any = ref({
			createVolunteer: {
        state: false,
        payload: {
          id: 'createVolunteer',
          errorMessage: 'Error al crear el voluntario',
          successfulMessage: 'Voluntario creado de forma exitosa',
          buttonTask: 'CREAR',
          buttonClose: 'CANCELAR',
          content: '¿Está seguro que desea crear el voluntario?',
          title: {
            executing: 'Creando voluntario',
            executed: 'Voluntario creado',
            start: 'Crear voluntario',
          },
          function: async (params: any) => {
						const response: any = await addUserFunction(params);					
            const success = !!response?.data;
            return success ? { 
              result: response?.data,
              success 
            } : { success }
          },
          params: null
        }
      },
			updateVolunteer: {
        state: false,
        payload: {
          id: 'updateVolunteer',
          errorMessage: 'Error al actualizar el voluntario',
          successfulMessage: 'Voluntario actualizado de forma exitosa',
          buttonTask: 'ACTUALIZAR',
          buttonClose: 'CANCELAR',
          content: '¿Está seguro que desea actualizar el voluntario?',
          title: {
            executing: 'Actualizando voluntario',
            executed: 'Voluntario actualizado',
            start: 'Actualizar voluntario',
          },
          function: async (params: any) => {
						const response: any = await updateUserFunction(params);					
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
			email,
			names,
			firstSurname,
			secondSurname,
			congregation,
			congregationOptions,
			role,
			roleOptions,
			dialogs,
			checkValidation,
			emailRef,
			namesRef,
			firstSurnameRef,
			secondSurnameRef,
			onValidate () {
				emailRef.value.validate();
				namesRef.value.validate();
				firstSurnameRef.value.validate();
				secondSurnameRef.value.validate();
			},
			onReset() {
				emailRef.value.resetValidation();
				namesRef.value.resetValidation();
				firstSurnameRef.value.resetValidation();
				secondSurnameRef.value.resetValidation();
			}
		}
	},
	methods: {
		init(){
			// console.log(this.volunteerDataEntry);
			this.isNewVolunteer = !this.volunteerDataEntry ? true : false;

			this.congregationOptions = this.congregations.map((congregation: any) => ({
				id: parseInt(congregation.id),
				name: congregation.name,
				code: congregation.code
			}));

			this.roleOptions = this.roles.map((role: any) => ({
				id: parseInt(role.id),
				name: role.description,
				code: role.code
			}));
			
			if(!this.isNewVolunteer){
				this.email = this.volunteerDataEntry.email;
				this.names = this.volunteerDataEntry.names;
				this.firstSurname = this.volunteerDataEntry.first_surname;
				this.secondSurname = this.volunteerDataEntry.second_surname;

				this.congregation = this.congregationOptions.filter((congregation: any) => {
					return parseInt(this.volunteerDataEntry.congregation.id) == congregation.id;
				});
				this.congregation = this.congregation.length > 0 ? this.congregation[0] : null;

				this.role = this.roleOptions.filter((role: any) => {
					return parseInt(this.volunteerDataEntry.role.id) == role.id;
				});
				this.role = this.role.length > 0 ? this.role[0] : null;
			}
		},
		closeCreateUpdateVolunteerDialog(){
			this.$emit('close-create-update-volunteer-dialog', {});
		},
		isEmailStr (val: string) {
			return isEmail(val);
		},
		isRequiredStr (val: string) {
			return  isRequired(val);
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
		searchRole(partOfName: string){
			this.roleOptions = this.roles
			.filter((role: any) => {
				return role.description.toLowerCase().includes(partOfName.toLowerCase());
			})
			.map((role: any) => ({
				id: parseInt(role.id),
				name: role.description,
				code: role.code
			}));
		},
		filterRole(val: any, update: any) {
			// console.log(val)
			if (val === '') {
				update(() => {
					this.roleOptions = this.roles.map((role: any) => {
						return {
							id: parseInt(role.id),
							name: role.description,
							code: role.code
						}
					});
				})
				return
			}
			update(() => {
				this.searchRole(val);
			})
    },
		clearFields(){
			this.names = null;
			this.firstSurname = null;
			this.secondSurname = null;
			this.email = null;
			this.congregation = null;
			this.role = null;
			this.noCongregation = false;
			this.noRole = false;

			this.onReset();
		},
		validation(){
			return this.names
			&& this.firstSurname
			&& this.secondSurname
			&& this.checkValidation(isEmail(this.email))
			&& this.congregation
			&& this.role;
		},
		async createUpdateVolunteer(){
			if(this.validation()) {
				this.onReset();
				let volunteer: any = {
					names : this.names,
					first_surname: this.firstSurname,
					second_surname: this.secondSurname,
					email: this.email,
					congregation_code: this.congregation.code,
					role_code: this.role.code
				};

				if(this.isNewVolunteer){
					this.dialogs.createVolunteer.payload = {
						...this.dialogs.createVolunteer.payload,
						params: volunteer
					};

					this.dialogs.createVolunteer.state = true;
				}
				else {
					// console.log('this.volunteerDataEntry', this.volunteerDataEntry)
					volunteer.id = this.volunteerDataEntry.id;
					this.dialogs.updateVolunteer.payload = {
						...this.dialogs.updateVolunteer.payload,
						params: volunteer
					};

					this.dialogs.updateVolunteer.state = true;
				}
			}
			else {
				this.noCongregation = this.congregation ? false : true;
				this.noRole = this.role ? false : true;
				this.onValidate();
			}
		},
		closeDialog(event: any){
      this.dialogs[event.id].state = false;
    },
		getVolunteers() {
			this.$emit('get-volunteers', {});
		},
		executedDialog(event: any){
      this.closeDialog(event);
			this.getVolunteers();
			this.closeCreateUpdateVolunteerDialog();
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