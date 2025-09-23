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

          <!-- <div 
            class="row justify-center text-bold" 
            style="width: 100%; font-size: 25px; margin-top: 20px; color: var(--q-primary);"
          >
            Login
          </div> -->
          
          <q-input
            dense 
            outlined
            bg-color="white"
            v-model="userName"
            type="text"
            label="Correo electrónico"
            placeholder="usuario@email.com"
            lazy-rules
            :rules="[isEmailStr]"
            style="width: 100%; margin-top: 40px;"
            @update:model-value="(value: any) => { cleanError(value) }"
          >
            <template v-slot:prepend>
              <q-icon name="mail" />
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

          <div v-if="loginError.length > 0" style="margin-bottom: 15px; color: red; width: 100%;"> {{ loginError }}</div>

          <q-btn
            outlined
            @click="enter"
            class="full-width q-btns action-btn"
            :disable="isLogin"
            style="margin-top: 10px; border-radius: 8px;"
          >
            <q-icon name="login" />
            <span class="q-ml-sm">ENTRAR</span>
          </q-btn>
          
          <!-- <q-btn
            class="google-btn"
            unelevated
            no-caps
            @click="loginWithGoogle"
          >
            <q-img src="/static/Google__G__logo.svg" width="20px" height="20px" class="google-icon" />
            <span class="google-text">Iniciar sesión con Google</span>
          </q-btn> -->
          
          <div 
            class="row justify-end gradient-text" 
            style="width: 100%; font-size: 16px; margin-top: 20px; color: var(--q-primary); cursor: pointer;"
            @click="signUp"
          >
            ¿Aún no te registras?
          </div>

          <div 
            class="row justify-end gradient-text" 
            style="width: 100%; font-size: 16px; margin-top: 20px; color: var(--q-primary); cursor: pointer;"
            @click="forgotPassword"
          >
            Olvidé mi contraseña
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
  import { defineComponent, computed, ref } from 'vue';
  import { isRequired, isShort, isEmail, checkValidation } from '../tools/validations';
  import { useIdentityStore } from 'src/stores/identityStore';
  import { useCongregationStore } from 'src/stores/congregationStore';
  import { storeToRefs } from 'pinia';  
  import { userAuth } from '../identity/userAuth';
  const { signIn, signInWithGoogle, currentSession } = userAuth();
  import { useRoute } from 'vue-router';
  
  export default defineComponent({
    name: 'LoginPage',
    data() {
      return {
        userName: '',
        passWord: '',
        isLogin: false,
        loginError: '',
        congregation: ''
      }
    },
    setup () {
      const route = useRoute();
      const store = useIdentityStore();
      const { getToken, getAttributes } = storeToRefs(store);
      const isPwd = ref(true);
      const errorQuery = computed(() => route.query.error);

      const congregationStore = useCongregationStore();
	    const { getCongregation } = storeToRefs(congregationStore);

      return {
        getToken,
        getAttributes,
        isPwd,
        signInWithGoogle,
        errorQuery,
        getCongregation
      }
    },
    async mounted() {
      const errorMessage = this.$route.query.error as string;
      if (errorMessage) {
        this.loginError = errorMessage;
      }
      else {
        // await currentSession();
        if(this.getCongregation) this.congregation = this.getCongregation;
        if(this.getAttributes){
          // console.log('token', this.getToken);
          // console.log('getAttributes', this.getAttributes);
          this.$router.replace('/assignments');
        }
      }      
    },
    methods: {
      async enter() {
        this.isLogin = true;
        this.loginError = '';
        const evaluation = checkValidation(isShort(this.passWord, 8)) && checkValidation(isRequired(this.passWord)) && checkValidation(isEmail(this.userName));
        if (evaluation){
          const response = await signIn(this.userName, this.passWord);
          if (response.success) {
            this.isLogin = false;
            // console.log('token', this.getToken);
            // console.log('getAttributes', this.getAttributes);
            this.$router.replace('/assignments');
          } else {
            this.loginError = response.error;
          }
        }
        this.isLogin = false;
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
      cleanError (val: any) {
        this.loginError = '';
      },
      showPassword() {
        this.isPwd = !this.isPwd;
      },
      forgotPassword(){
        this.$router.replace('/request-pin-code');
      },
      signUp(){
        this.$router.replace('/signup');
      },
      async loginWithGoogle(){
        await signInWithGoogle();
      }
    },
    watch:{
      errorQuery(newVal, oldVal){
        this.loginError = newVal;
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

  .google-btn {
    background: white;
    color: #403f3f;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    padding: 0px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 25px;
  }

  .google-icon {
    margin-right: 8px;
  }

  .google-btn:hover {
    background: #f5f5f5;
  }

  .google-text {
    flex: 1;
    text-align: center;
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
</style>