<template>
  <q-page 
    class="flex flex-center" 
    style="background-color: #eeeeee;"
  >
    <q-card 
      class="shadow-custom"
      :style="{
        width: $q.screen.lt.sm ? '90%' : '400px', 
        borderRadius: '10px'
      }"
    >
      <q-card-section
        class="row justify-center" 
        :style="{ 
          marginLeft: '20px',
          marginRight: '20px',
          marginTop: '30px',
          marginBottom: '30px' ,
          padding: '0px'
        }"
      >
        <div class="column flex-center" style="width: 95%">
          <div class="row justify-center items-center" style="width: 100%">
            <q-img
              class="icon"
              src="/static/carrito.jpg"
            />
            <!-- <q-separator vertical style="margin-left: 10px; margin-right: 10px;"/> -->
            <div 
              class="carts-title"
              :style="{
                fontSize: '1.8rem'
              }"
            >
              Carrito {{ congregation }}
            </div>
          </div>

          <div 
            class="row justify-center text-bold gradient-text" 
            style="width: 100%; font-size: 15px; margin-top: 20px;"
          >
            CÓDIGO DE RECUPERACIÓN
          </div>
          
          <q-input
            dense 
            outlined
            bg-color="white"
            v-model="email"
            type="text"
            label="Correo electrónico"
            placeholder="usuario@email.com"
            lazy-rules
            :rules="[isEmailStr]"
            style="width: 100%; margin-top: 20px;"
          >
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>

          <div v-if="requestingError" style="margin-bottom: 15px; color: red; width: 100%;"> {{ requestingError }}</div>

          <q-btn
            outlined
            @click="sendCode()"
            class="full-width q-btns action-btn"
            :disable="isRequestingCode"
            style="margin-top: 10px; border-radius: 8px;"
          >
            SOLICITAR CÓDIGO
          </q-btn>

          <div 
            class="row justify-end items-center" 
            style="width: 100%; margin-top: 20px; color: var(--q-primary); cursor: pointer;"
            @click="returning()"
          >
            <q-icon class="gradient-icon" name="home" style="font-size: 20px; margin-top: 4px"/>
            <span class="q-ml-sm gradient-text" style="font-size: 16px;">Volver a inicio</span>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
  import { defineComponent, computed, ref } from 'vue';
  import { isEmail, checkValidation } from '../tools/validations';
  import { userAuth } from '../identity/userAuth';
  import { useQuasar } from 'quasar';
  import { useCongregationStore } from 'src/stores/congregationStore';
  import { storeToRefs } from 'pinia' 
  const { signInWithOtp } = userAuth();
  
  export default defineComponent({
    name: 'RequestPinCodePage',
    data() {
      return {
        isRequestingCode: false,
        congregation: ''
      }
    },
    setup () {
      const email: any = ref(null);
      const requestingError: any = ref(null);
      const $q = useQuasar();

      const congregationStore = useCongregationStore();
	    const { getCongregation } = storeToRefs(congregationStore);

      return {
        email,
        requestingError,
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
        getCongregation
      }
    },
    async mounted() {
      if(this.getCongregation) this.congregation = this.getCongregation;
    },
    methods: {
      async sendCode() {
        this.isRequestingCode = true;
        this.requestingError = null;
        const evaluation = checkValidation(isEmail(this.email));
        if (evaluation){
          const response = await signInWithOtp(this.email);
          if (response.success) {
            this.isRequestingCode = false;
            this.$router.replace({ path: '/change-password', query: { email: this.email } });
          } else {
            this.requestingError = response.error;
            this.errorNotify(this.requestingError);
          }
        }
        this.isRequestingCode = false;
      },
      isEmailStr (val: string) {
        return isEmail(val);
      },
      returning(){
        this.$router.replace('/');
      }
    }
  })
</script>

<style scoped lang="scss">
  .icon {
    width: 50px;
    height: 50px;
    display: inline-block;
    margin-right: 10px;
    border: 2px solid #ff5222;
    border-radius: 45px;
  }

  .carts-title {
    color: transparent;
    background: #ff5222;
    background-clip: text;
    text-shadow: 0px 2px 2px rgba(255,255,255,0.4);
    font-weight: 600;
    padding-bottom: 1;
  }

  .action-btn {
    background: linear-gradient(160deg,#e68f77, #ff5222);    
  }

  .action-btn:hover {
    background: linear-gradient(135deg, #e68f77, #ff5222);
  }

  .shadow-custom {
    box-shadow: 0 2px 20px var(--q-primary); /* sombra roja, ajusta el color aquí */
  }

  .gradient-text {
    background: linear-gradient(160deg,#e68f77, #ff5222);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .gradient-icon {
    background: linear-gradient(180deg,#e68f77, #ff5222);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>