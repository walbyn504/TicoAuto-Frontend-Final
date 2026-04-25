const apiBaseUrl = 'http://localhost:3001';

let googleCredentialTemp = null;
let googlecorreo = null;


// Función que maneja la respuesta de Google
function handleGoogleRegisterResponse(response) {
    console.log('Respuesta de Google:', response);  // Verifica que se recibe la respuesta correctamente

    if (!response || !response.credential) {
        console.log('No se recibió la credencial de Google');
        mostrarMensaje('No se recibió la credencial de Google', 'error', 'contenedor-mensajes');
        return;  // Si no se recibió la credencial, salimos de la función
    }

    // Almacena la credencia de Google para usarla en el registro
    googleCredentialTemp = response.credential;

    // Decodifica la credencial para obtener el correo
    const decodedCredential = jwt_decode(response.credential);
    googlecorreo = decodedCredential.email;

    // Llama a la función para activar el registro con Google
    activarModoGoogle();
}


// Activa el modo de registro con Google
function activarModoGoogle() {
    document.getElementById('modoGoogle').value = 'true'; // Establece el modo de Google

    // Limpia los campos de correo y contraseña, ya que se usará Google
    document.getElementById('correo').value = '';
    document.getElementById('contrasenna').value = '';

    // Oculta los campos de credenciales tradicionales (correo y contraseña)
    document.getElementById('bloqueCredenciales').style.display = 'none';

    // Obtiene el correo de Google
    const correoGoogle = googlecorreo || 'Correo no disponible';

    
    mostrarMensaje(
        `Cuenta seleccionada ${correoGoogle}. 
        Ahora consulta la cédula y completa el teléfono para finalizar el registro.`,
        'success',
        'contenedor-mensajes'
    );
}


// Función para consultar la cédula y obtener los datos asociados desde el padrón
async function consultarCedula() {
    const cedula = document.getElementById('cedula').value.trim();  // Obtiene la cédula

    // Si no se ingresa la cédula, muestra un mensaje de error
    if (!cedula) {
        mostrarMensaje('La cédula es obligatoria', 'error', 'contenedor-mensajes');
        return;
    }

    // Verifica que la cédula tenga exactamente 9 dígitos
    const regexCedula = /^\d{9}$/;
    if (!regexCedula.test(cedula)) {
        mostrarMensaje('La cédula debe tener exactamente 9 dígitos', 'error', 'contenedor-mensajes');
        return;
    }

    try {
        // Consulta al padrón
        const response = await fetch(`${apiBaseUrl}/api/padron/${cedula}`);
        const data = await response.json();

        if (!response.ok) {
            // limpiar campos
            document.getElementById('nombre').value = '';
            document.getElementById('primerApellido').value = '';
            document.getElementById('segundoApellido').value = '';

            // Muestra un mensaje según el resultado de la consulta
            if (response.status === 404) {
                mostrarMensaje('La cédula no se encuentra en el padrón', 'error', 'contenedor-mensajes');
            } else {
                mostrarMensaje(data.message || 'No se pudo consultar el padrón', 'error', 'contenedor-mensajes');
            }

            return;
        }

        // Si la cédula es válida, muestra los datos obtenidos
        document.getElementById('nombre').value = data.nombre || '';
        document.getElementById('primerApellido').value = data.apellidoPaterno || '';
        document.getElementById('segundoApellido').value = data.apellidoMaterno || '';

        mostrarMensaje('Cédula validada', 'success', 'contenedor-mensajes');

    } catch (error) {
        mostrarMensaje('No se pudo conectar con el padrón', 'error', 'contenedor-mensajes');
    }
}


// Validaciones 
function validarCampos({ cedula, telefono, correo, contrasenna, modoGoogle }) {
    // Validar campos comunes
    if (!cedula || !telefono) {
        mostrarMensaje('La cédula y el teléfono son obligatorios', 'error', 'contenedor-mensajes');
        return false;
    }

    // Validar cédula
    const regexCedula = /^\d{9}$/;
    if (!regexCedula.test(cedula)) {
        mostrarMensaje('La cédula debe tener exactamente 9 dígitos', 'error', 'contenedor-mensajes');
        return false;
    }

    // Validar teléfono
    const regexTelefono = /^[0-9]{8,}$/;
    if (!regexTelefono.test(telefono)) {
        mostrarMensaje('El teléfono debe tener al menos 8 dígitos', 'error', 'contenedor-mensajes');
        return false;
    }

    // Validaciones adicionales solo si es registro tradicional
    if (!modoGoogle) {
        if (!correo || !contrasenna) {
            mostrarMensaje('El correo y la contraseña son obligatorios', 'error', 'contenedor-mensajes');
            return false;
        }

        // Formato de correo requerido
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(correo)) {
            mostrarMensaje('El formato del correo no es válido', 'error', 'contenedor-mensajes');
            return false;
        }

        // Formato de contraseña requerido
        const tieneMin = /[a-z]/.test(contrasenna);
        const tieneMay = /[A-Z]/.test(contrasenna);
        const tieneNumero = /\d/.test(contrasenna);
        const tieneEspecial = /[@$!%*?&.#_-]/.test(contrasenna);
        const largoMinimo = contrasenna.length >= 8;

        if (!(tieneMin && tieneMay && tieneNumero && tieneEspecial && largoMinimo)) {
            mostrarMensaje(
                'La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial.',
                'error',
                'contenedor-mensajes'
            );
            return false;
        }
    }

    // Si todas las validaciones pasan, retorna true
    return true; 
}



// Registro con Google
async function registrarConGoogle(cedula, telefono) {
    if (!googleCredentialTemp) {
        mostrarMensaje('Primero debes registrarte con Google', 'error', 'contenedor-mensajes');
        return;
    }

    try {
        // Enviar la credencial de Google junto con la cédula y el teléfono al backend para el registro
        const response = await fetch(`${apiBaseUrl}/api/autenticacion/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: googleCredentialTemp, cedula, telefono })
        });

        const data = await response.json();

        // Si la respuesta no es exitosa, muestra el mensaje de error
        if (!response.ok) {
            mostrarMensaje(data.message || 'No se pudo registrar con Google', 'error', 'contenedor-mensajes');
            return;
        }

        sessionStorage.setItem(
            'mensajeRegistroExitoso',
            'Registro exitoso con Google. Revisa tu correo para activar tu cuenta.'
        );
        setTimeout(() => location.href = '/html/usuario/inicioSesion.html', 1000);

    } catch (error) {
        mostrarMensaje('No se pudo conectar al servidor', 'error', 'contenedor-mensajes');
    }
}


// Registro local
async function registrarLocal(cedula, telefono, correo, contrasenna) {
    try {
        // Enviar los datos al backend para el registro local
        const response = await fetch(`${apiBaseUrl}/api/autenticacion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cedula, telefono, correo, contrasenna })
        });

        const data = await response.json();

        // Si la respuesta no es exitosa, muestra el mensaje de error
        if (!response.ok) {
            mostrarMensaje(data.message || 'No se pudo registrar el usuario', 'error', 'contenedor-mensajes');
            return;
        }

        sessionStorage.setItem(
            'mensajeRegistroExitoso',
            'Registro exitoso. Revisa tu correo para activar tu cuenta.'
        );
        setTimeout(() => location.href = '/html/usuario/inicioSesion.html', 1000);

    } catch (error) {
        mostrarMensaje('No se pudo conectar al servidor', 'error', 'contenedor-mensajes');
    }
}

// Función principal para manejar el registro del usuario
async function registrarUsuario() {
    const modoGoogle = document.getElementById('modoGoogle').value === 'true';

    const cedula = document.getElementById('cedula').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const primerApellido = document.getElementById('primerApellido').value.trim();
    const segundoApellido = document.getElementById('segundoApellido').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const contrasenna = document.getElementById('contrasenna').value.trim();

    // Validar campos generales
    if (!cedula || !nombre || !primerApellido || !segundoApellido || !telefono) {
        mostrarMensaje('Debes completar todos los campos', 'error', 'contenedor-mensajes');
        return;
    }

    // Usar la función de validación 
    const valido = validarCampos({ cedula, telefono, correo, contrasenna, modoGoogle });
    // Si la validación es false, se detiene el proceso de registro
    if (!valido) return;

    // Decide el flujo
    if (modoGoogle) {
        await registrarConGoogle(cedula, telefono);
    } else {
        await registrarLocal(cedula, telefono, correo, contrasenna);
    }
}




