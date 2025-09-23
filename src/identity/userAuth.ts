import { LocalStorage, SessionStorage, Cookies } from 'quasar';
import { useIdentityStore } from 'src/stores/identityStore';
import { supabase } from 'src/supabase.config';
import { storeToRefs } from 'pinia'; 
import { sleep } from 'src/tools/usefuls';
import { getUser } from 'src/api/queries/getUser';
import { apolloClient } from 'src/apollo/client';


export type SigninResponse = {
	success: boolean;
	error: string;
};

const responseSuccess = {
	success: true,
	error: '',
};

const responseError = (error: string): SigninResponse => {
	return {
		success: false,
		error,
	};
};

export type SignUpParams = {
	email: string;
	password: string;
};

export const userAuth = () => {
  const store = useIdentityStore();
	const { setAttributes, setToken, setRefreshToken, signOutListener } = store;

	const checkProfile = async (session: any) => {
		try {
			if(!session) throw new Error('(checkProfile) No existe usuario logeado.');

			const email = session.user?.email;

			const { data: getUserData,  error: getUserError } = await apolloClient.query({
				query: getUser,
				variables: { email, congregation_code: process.env.CONGREGATION_CODE || '' },
			});

			// console.log(getUserData)

			if(getUserError) throw new Error(getUserError.message);

			const { id: userId, names, first_surname: firstSurname, second_surname: secondSurname, enabled, role: userRole, congregation: userCongregation } = getUserData.getUser;
			
			const profile: any = { userId, names, firstSurname, secondSurname, role: userRole.code, congregation: userCongregation.name };

			if(!enabled) throw new Error('Usuario no activo. Por favor contactarse con el administrador.');

			return profile

		} catch (error: any) {
			throw new Error(error); 
		}
	}

	const updateStorage = async (session: any) => {
		const profile = await checkProfile(session);
	
		const user: any = { ...session.user, ...profile, admin: profile.role == 'admin' };
		
		if (user?.email_confirmed_at) {
			setAttributes(user);
			setToken(session.access_token);
			setRefreshToken(session.refresh_token);
			console.log('(updateStorage) 👉', 'Usuario autenticado correctamente');
		} else {
			await supabase.auth.signOut();
			const errorMessage = 'Usuario no verificado. Por favor, verifica tu correo electrónico antes de iniciar sesión.'
			console.log('(error updateStorage) 👉', errorMessage);
			throw new Error(errorMessage);
		}
	}

  const signIn = async (email: string, password: string) => {
		try {
			signOutListener();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
			// console.log('(signIn data) 👉', data);

			if (error) {
				throw new Error(error.message);
			}
			
			const session = data.session;

			await updateStorage(session);

			return responseSuccess;

		} catch (error: any) {
			setAttributes(null);
			setToken('');
      console.log('(error signIn) 👉', error.message);            
			return responseError(error.message);
		}
	};

	const signInWithGoogle = async () => {
		const redirectUrl = `${process.env.APP_URL}/assignments`;

		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: redirectUrl,
				},
			});

			if (error) {
				throw new Error(error.message);
			}

			return responseSuccess;

		} catch (error: any) {
			setAttributes(null);
			setToken('');
      console.log('(error signInWithGoogle) 👉', error.message);            
			return responseError(error.message);
		}
	};

	const verifyOtpLogin = async (email: string, otp: string) => {
		try {
			signOutListener();
			const { data, error } = await supabase.auth.verifyOtp({
				email,
				token: otp, // Código recibido en el email
				type: 'email'
			});
	
			if (error) {
				throw new Error(error.message);
			}
			
			const session = data.session;

			await updateStorage(session);

			return responseSuccess;

		} catch (error: any) {
			setAttributes(null);
			setToken('');
      console.log('(error signIn) 👉', error.message);            
			return responseError(error.message);
		}
	};

  const signOut = async () => {
		try {
			await supabase.auth.refreshSession();
			const { error } = await supabase.auth.signOut();
			if (error) {
				throw new Error(error.message);
			}
		} catch (error: any) {
      console.info('(error signOut) 👉', error.message);
		}

		setAttributes(null);
		setToken('');
		window.location.replace('/');
	};

	const currentSession = async () => {
		try {
			signOutListener();
			const { data, error } = await supabase.auth.getSession();
			// console.log('(currentSession data) 👉', data);
			if (error) {
        throw new Error(error.message);
      }
			
			const session: any = data.session;
		
			await updateStorage(session);
		
			return responseSuccess;

		} catch (error: any) {
			setAttributes(null);
			setToken('');
			console.log('(error currentSession) 👉', error.message);
			return responseError(error.message);
		}
	};

	const refreshSession = async () => {
		const store = useIdentityStore();
		const { getRefreshToken } = storeToRefs(store);
		const refreshToken = getRefreshToken.value;
		// console.log(refreshToken);
		
		try {
			if(refreshToken.length > 0) {
				await supabase.auth.refreshSession({ refresh_token: refreshToken });
				await currentSession();
			}
		} catch (error: any) {
			console.log('(error refreshSession) 👉', error.message);
		}
	};

	const signInWithOtp = async (email: any) => {
		try {
			const redirectUrl = process.env.APP_URL;
	
			const { data, error } = await supabase.auth.signInWithOtp({
				email,
				options: {
					emailRedirectTo: `${redirectUrl}/reset-password`
				}
			});
	
			if (error) {
				throw new Error(error.message);
			}

			return responseSuccess;
		} catch (error: any) {
			console.info('(error signInWithOtp) 👉', error.message);
			return responseError(error.message);
		}
	}

	const changePassword = async (newPassword: string) => {
		try {
			const { data, error } = await supabase.auth.updateUser({
				password: newPassword
			});
	
			if (error) {
				throw new Error(error.message);
			}
	
			return responseSuccess;
		} catch (error: any) {
			console.error('(error changePassword) 👉', error.message);
			return responseError(error.message);
		}
	};

	const signUp = async (email: string, password: string, metaData: any) => {
		const store = useIdentityStore();
		const { setAttributes, setToken, setRefreshToken } = store;
	
		try {
			// Crear usuario en Supabase Auth
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: metaData
				}
			});
	
			if (error) {
				throw new Error(error.message);
			}
	
			// Si el usuario ya está registrado pero no confirmado, data.user estará definido
			const session = data.session;
	
			if (session) {
				// Actualiza el storage igual que en signIn
				await updateStorage(session);
	
				console.log('(signUp) 👉 Usuario creado y autenticado correctamente');
			} else {
				console.log('(signUp) 👉 Usuario creado, pendiente de verificación por email');
			}
	
			return responseSuccess;
	
		} catch (error: any) {
			setAttributes(null);
			setToken('');
			setRefreshToken('');
			console.log('(error signUp) 👉', error.message);
			return responseError(error.message);
		}
	};

  return {
		signIn,
		signUp,
		signOut,
		refreshSession,
		currentSession,
		signInWithOtp,
		changePassword,
		verifyOtpLogin,
		signInWithGoogle
	}
}