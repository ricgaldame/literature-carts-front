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
            style="width: 100%; font-size: 15px; margin-top: 20px; color: var(--q-primary);"
          >
            CAMBIO DE PASSWORD
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
            :disable="true"
          >
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>
          
          <q-input
            dense 
            outlined
            bg-color="white"
            v-model="code"
            type="text"
            label="Código"
            placeholder="123456"
            lazy-rules
            :rules="[isSupabaseStr]"
            style="width: 100%; margin-top: 20px;"
            @update:model-value="(value: any) => { cleanError(value) }"
          >
            <template v-slot:prepend>
              <q-icon name="pin" />
            </template>
          </q-input>

          <q-input
            dense
            outlined
            bg-color="white"
            v-model="passWord"
            :type="isPwd ? 'password' : 'text'"
            label="Contraseña"
            :rules="[isRequiredStr,isShortStr]"
            lazy-rules
            style="width: 100%; margin-top: 10px;"
            @update:model-value="(value: any) => { cleanError(value) }"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>

            <template v-slot:append>
              <q-icon 
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword"
              />
            </template>
          </q-input>

          <q-input
            dense
            outlined
            bg-color="white"
            v-model="repeatedPassWord"
            :type="isPwd ? 'password' : 'text'"
            label="Repetir Contraseña"
            :rules="[isRequiredStr,isShortStr, areEqualPasswordStr]"
            lazy-rules
            style="width: 100%; margin-top: 10px;"
            @update:model-value="(value: any) => { cleanError(value) }"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>

            <template v-slot:append>
              <q-icon 
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword"
              />
            </template>
          </q-input>

          <div v-if="changePasswordError" style="margin-bottom: 15px; color: red; width: 100%;"> {{ changePasswordError }}</div>

          <q-btn
            outlined
            @click="changePassword"
            class="full-width q-btns action-btn"
            :disable="isChangingPassword"
            style="margin-top: 10px; border-radius: 8px;"
          >
            CAMBIAR CONTRASEÑA
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
  import { isRequired, isShort, isEmail, isSupabaseCode, checkValidation, areEqualPassword } from '../tools/validations'; 
  import { userAuth } from '../identity/userAuth';
  import { useRoute } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { useCongregationStore } from 'src/stores/congregationStore';
  import { storeToRefs } from 'pinia' 

  const { changePassword, verifyOtpLogin, signOut } = userAuth();
  
  export default defineComponent({
    name: 'ChangePasswordPage',
    data() {
      return {
        isChangingPassword: false,
        congregation: ''
      }
    },
    setup () {
      const isPwd = ref(true);
      const email: any = ref(null);
      const passWord: any = ref(null);
      const repeatedPassWord: any = ref(null);
      const changePasswordError: any = ref(null);
      const code: any = ref(null);
      const $q = useQuasar();

      const congregationStore = useCongregationStore();
	    const { getCongregation } = storeToRefs(congregationStore);

      return {
        isPwd,
        email,
        passWord,
        repeatedPassWord,
        changePasswordError,
        code,
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
    mounted() {
      const route = useRoute();
      this.email = route.query.email as string;
      if(this.getCongregation) this.congregation = this.getCongregation;
    },
    methods: {
      async changePassword() {
        this.isChangingPassword = true;
        this.changePasswordError = null;
        const evaluation = checkValidation(isShort(this.passWord, 8)) 
        && checkValidation(isRequired(this.passWord)) 
        && checkValidation(isShort(this.repeatedPassWord, 8)) 
        && checkValidation(isRequired(this.repeatedPassWord)) 
        && checkValidation(areEqualPassword(this.passWord, this.repeatedPassWord)) 
        && checkValidation(isSupabaseCode(this.code)) 
        && checkValidation(isEmail(this.email));
        if (evaluation){
          const optLoginResponse = await verifyOtpLogin(this.email, this.code);
          if (optLoginResponse.success) {
            this.isChangingPassword = false;
            const changeResponse = await changePassword(this.passWord);
            if (changeResponse.success) {
              this.successNotify('Password cambiado satisfactoriamente')
              await signOut();
            }
            else{
              this.changePasswordError = changeResponse.error;
            }
          } else {
            this.changePasswordError = optLoginResponse.error;
          }
          if(this.changePasswordError){
            this.errorNotify(this.changePasswordError)
          }
        }
        this.isChangingPassword = false;
      },
      isRequiredStr (val: string) {
        return  isRequired(val);
      },
      isShortStr(val: string) {
        return  isShort(val, 8);
      },
      isEmailStr (val: string) {
        return isEmail(val);
      },
      isSupabaseStr (val: string) {
        return isSupabaseCode(val);
      },
      areEqualPasswordStr (val: string) {
        return areEqualPassword(this.passWord, val);
      },
      cleanError (val: any) {
        this.changePasswordError = '';
      },
      showPassword() {
        this.isPwd = !this.isPwd;
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