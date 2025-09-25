export function isRequired(val: string) {
    const ev = val && val.length > 0 ? true : false;
    return  (ev || 'El campo no puede estar vacío');
}

export function isShort(val: string, length: number) {
    const ev = val && val.length >= length ? true : false;
    return  (ev || `El campo debe contener sobre ${length}  caracteres`);
}

export function isEmail (val: string) {
    const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
    const ev = emailPattern.test(val);
    return  (ev || 'El campo debe contener formato de email');
}

export function checkValidation(val: any) {
    return typeof val === 'boolean';
}

export const isMobilePhone = (value: string) => {
    const stringValue = (value as unknown) as string;
    const ev = /^(56)?(\s?)(0?9)(\s?)[987654321]\d{7}$/.test(stringValue);
    return  (ev || 'Número de teléfono móvil inválido');
};

export const isLocalPhone = (value: string) => {
    const stringValue = (value as unknown) as string;
    const ev = /^(?:56\s?)?(?:0?(\d{1,2}))\s?(\d{4})\s?(\d{4})$/.test(stringValue);
    return  (ev || 'Número de teléfono fijo inválido');
};

export const isDate = (value: string) => {
    const stringValue = (value as unknown) as string;
    const ev = /^(19|20)\d{2}\-(0[1-9]|1[0-2])\-(0[1-9]|1[0-9]|(2[0-9])|3[0-1])$/.test(stringValue)
    return  (ev || 'Fecha inválida');
};

export const isCode = (value: string) => {
    const stringValue = (value as unknown) as string;
    const ev = /^[0-9A-Z]{8}$/.test(stringValue);
    return  (ev || 'Código inválido');
};

export const isCongregationCode = (value: string) => {
    const stringValue = String(value);
    const ev = /^[0-9]{1,10}$/.test(stringValue);
    return ev || 'Código congregación inválido';
  };

export const isSupabaseCode = (value: string) => {
    const stringValue = (value as unknown) as string;
    const ev = /^[0-9]{6}$/.test(stringValue);
    return  (ev || 'Código inválido');
};

export const areEqualPassword = (password1: string, password2: string) => {
    const ev = password1 === password2 || (password1.length == 0 || password2.length == 0);
    return  (ev || 'Contraseñas diferentes');
}

export const isFromToDate = (value: string, birthdate: string) => {
    const ev = value <= birthdate;
    return (ev || 'No es mayor de edad');
};
