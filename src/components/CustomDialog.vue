<template>
  <q-card v-if="isMounted">
		<q-bar class="q-bar-style">
			<div v-if="executing" class="row justify-center" style="width: 100%;">
				<div style="font-size: 18px; color: white">
          {{ payload.title.executing }}
        </div>
			</div>
			<div v-else class="row justify-center" style="width: 100%;">
        <div v-if="executed" style="font-size: 18px; color: white">
          {{ payload.title.executed }}
        </div>
        <div v-else style="font-size: 18px; color: white">
          <div v-if="error">
            Error
          </div>
					<div v-else-if="warning">
            Advertencia
          </div>
					<div v-else-if="success">
            Existoso
          </div>
          <div v-else>
            {{ payload.title.start }}
          </div>
        </div>
			</div>
		</q-bar>
    <div v-if="error">
			<q-card-section class="row justify-center">
        <div class="row justify-center items-center">
					<img src="/static/dialog/error.webp" style="width: 10%;"/>
					<div class="text-center" style="width: 80%">{{ error }}</div>
				</div>
        <div class="row justify-center" style="width: 100%; margin-top: 20px">
					<q-btn 
						class="q-btn btn-transparent" 
						style="font-size: 15px; margin: 2px; min-width: 100px" 
						@click="closeDialog" 
						:disable="executing"
					>
						CERRAR
					</q-btn>
				</div>
      </q-card-section>
    </div>
		<div v-else-if="warning">
			<q-card-section class="row justify-center">
        <div class="row justify-center items-center">
					<img src="/static/dialog/warning.webp" style="width: 10%;"/>
					<div class="text-center" style="width: 80%">{{ warning }}</div>
				</div>
        <div class="row justify-center" style="width: 100%; margin-top: 20px">
					<q-btn 
						class="q-btn btn-transparent" 
						style="font-size: 15px; margin: 2px; min-width: 100px" 
						@click="closeDialog" 
						:disable="executing"
					>
						CERRAR
					</q-btn>
				</div>
      </q-card-section>
    </div>
		<div v-else-if="success">
			<q-card-section class="row justify-center">
				<div class="row justify-center items-center">
					<img src="/static/dialog/success.webp" style="width: 10%;"/>
					<div class="text-center" style="width: 80%">{{ success }}</div>
				</div>
        <div class="row justify-center" style="width: 100%; margin-top: 20px">
					<q-btn 
						class="q-btn btn-transparent" 
						style="font-size: 15px; margin: 2px; min-width: 100px" 
						@click="closeDialog" 
						:disable="executing"
					>
						CERRAR
					</q-btn>
				</div>
      </q-card-section>
    </div>
    <div v-else class="text-center">
      <q-card-section class="row justify-center">
				{{ executing ? `${payload.title.executing} ...`: payload.content }}
			</q-card-section>
			<q-card-section class="row justify-center">
				<div class="row justify-center" style="width: 100%;">
					<q-btn 
						class="q-btn btn-transparent" 
						style="font-size: 15px; margin: 2px; min-width: 100px" 
						@click="closeDialog" 
						:disable="executing"
					>
					{{ payload.buttonClose }}
					</q-btn>
					
					<q-btn 
						class="q-btn" 
						v-if="payload?.function"
						style="font-size: 15px; margin: 2px; min-width: 100px" 
						:disable="executing"
						@click="execute"
					>
						<div v-if="executing">
							<q-spinner-tail color="white" size="20px"/>
						</div>
						<div v-else>
							{{ payload.buttonTask }}
						</div>
					</q-btn>
				</div>
			</q-card-section>
    </div>
    
  </q-card>
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'CustomDialogComponent',
  emits: ['close-dialog', 'executed-dialog'],
  props: {
    payload: {
      type: Object || null,
      default: null,
			required: true
    }
  },
  data() {
		return {
			executed: false,
			executing: false,
			isMounted: false
		}
	},
  setup() {
    const $q = useQuasar();
    const error: any = ref(null);
		const warning: any = ref(null);
		const success: any = ref(null);

    return {
      error,
			warning,
			success,
      errorNotify (message: any) {
        $q.notify({
          message: message,
          color: 'negative',
					icon: 'report_problem'
        })
      },
			successNotify (message: any) {
        $q.notify({
          message: message,
          color: 'green',
					icon: 'thumb_up_alt'
        })
      },
			warningNotify (message: any) {
        $q.notify({
          message: message,
          color: 'warning',
					icon: 'warning'
        })
      },
    }
  },
	mounted(){
		this.error = this.payload?.forceError ? this.payload?.errorMessage : null;
		if(this.error) this.errorNotify(this.error);
		this.warning = this.payload?.forceWarning ? this.payload?.warningMessage : null;
		if(this.warning) this.warningNotify(this.warning);
		this.success = this.payload?.forceSuccess ? this.payload?.successMessage : null;
		if(this.success) this.successNotify(this.success);
		this.isMounted = true;
	},
  methods: {
		closeDialog() {
			this.$emit('close-dialog', { id: this.payload.id });
		},
		async execute(){
			this.executed = false;
			this.executing = true;

			try {
				const response = await this.payload.function(this.payload.params);

				if(response.success){
					// console.log('response.result', response.result)
					this.successNotify(this.payload.successfulMessage);
					this.$emit('executed-dialog', { id: this.payload.id });
				}

				this.executed = true;
				this.executing = false;
			}
			catch(error: any){
				this.executed = false;
				this.executing = false;
				this.error =  `${this.payload.errorMessage}: ${error.message}`;
				this.errorNotify(this.error);
			}
		}
	},
});
</script>

<style scoped lang="scss">
  .q-bar-style {
		background-color: $primary;
	}
</style>