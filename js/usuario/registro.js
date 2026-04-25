const apiBaseUrl = 'http://localhost:3001';

let googleCredentialTemp = null;

// Activa el modo de registro con Google
function activarModoGoogle() {
    document.getElementById('modoGoogle').value = 'true'; // Establece el modo de Google

    // Limpia los campos de correo y contraseña, ya que se usará Google
    document.getElementById('correo').value = '';
    document.getElementById('contrasenna').value = '';

     // Oculta el bloque de credenciales tradicionales (correo y contraseña)
    document.getElementById('bloqueCredenciales').style.display = 'none';

    // Muestra un mensaje informando que se ha seleccionado Google
    mostrarMensaje(
        'Cuenta de Google seleccionada. Ahora consulta la cédula y completa el teléfono para finalizar el registro.',
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

// Función para registrar un usuario
async function registrarUsuario() {
    const modoGoogle = document.getElementById('modoGoogle').value === 'true'; // Verifica si se usa Google para el registro

    // Obtiene los valores del formulario
    const cedula = document.getElementById('cedula').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const primerApellido = document.getElementById('primerApellido').value.trim();
    const segundoApellido = document.getElementById('segundoApellido').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const contrasenna = document.getElementById('contrasenna').value.trim();

    // Verifica que todos los campos estén completos
    if (!cedula || !nombre || !primerApellido || !segundoApellido || !telefono) {
        mostrarMensaje('Debes completar todos los campos', 'error', 'contenedor-mensajes');
        return;
    }

     // Verifica que la cédula tenga exactamente 9 dígitos
    const regexCedula = /^\d{9}$/;
    if (!regexCedula.test(cedula)) {
        mostrarMensaje('La cédula debe tener exactamente 9 dígitos', 'error', 'contenedor-mensajes');
        return;
    }

    // Verifica que el teléfono tenga al menos 8 dígitos
    const regexTelefono = /^[0-9]{8,}$/;
    if (!regexTelefono.test(telefono)) {
        mostrarMensaje('El teléfono debe tener al menos 8 dígitos', 'error', 'contenedor-mensajes');
        return;
    }

    // Si se usa Google, valida que la credencial de Google esté disponible
    if (modoGoogle) {
        if (!googleCredentialTemp) {
            mostrarMensaje('Primero debes registrarte con Google', 'error', 'contenedor-mensajes');
            return;
        }

        try {
            // Realiza una solicitud para registrar el usuario con Google
            const response = await fetch(`${apiBaseUrl}/api/autenticacion/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    credential: googleCredentialTemp,
                    cedula,
                    telefono
                })
            });

            const data = await response.json();

            if (!response.ok) {
                mostrarMensaje(data.message || 'No se pudo registrar con Google', 'error', 'contenedor-mensajes');
                return;
            }

            // Muestra mensaje de éxito y redirige a la página de inicio de sesión
            sessionStorage.setItem(
                'mensajeRegistroExitoso',
                'Registro exitoso con Google. Revisa tu correo para activar tu cuenta.'
            );
            setTimeout(() => {
                location.href = '/html/usuario/inicioSesion.html';
            }, 1000);

        } catch (error) {
            mostrarMensaje('No se pudo conectar al servidor', 'error', 'contenedor-mensajes');
        }

        return;
    }

    // Si no se usa Google, valida los campos de correo y contraseña
    if (!correo || !contrasenna) {
        mostrarMensaje('Todos los campos son obligatorios', 'error', 'contenedor-mensajes');
        return;
    }

    // Valida el formato del correo
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
        mostrarMensaje('El formato del correo no es válido', 'error', 'contenedor-mensajes');
        return;
    }

    // Valida la fortaleza de la contraseña
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
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/api/autenticacion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cedula,
                telefono,
                correo,
                contrasenna
            })
        });

        const data = await response.json();

        if (!response.ok) {
            mostrarMensaje(data.message || 'No se pudo registrar el usuario', 'error', 'contenedor-mensajes');
            return;
        }

       // Muestra mensaje de éxito y redirige a la página de inicio de sesión
        sessionStorage.setItem(
            'mensajeRegistroExitoso',
            'Registro exitoso. Revisa tu correo para activar tu cuenta.'
        );

        setTimeout(() => {
            location.href = '/html/usuario/inicioSesion.html';
        }, 1000);

    } catch (error) {
        mostrarMensaje('No se pudo conectar al servidor', 'error', 'contenedor-mensajes');
    }
}

// Función para manejar la respuesta del registro con Google
function handleGoogleRegisterResponse(response) {
    if (!response || !response.credential) {
        mostrarMensaje('No se recibió la credencial de Google', 'error', 'contenedor-mensajes');
        return;
    }

    // Almacena la credencial de Google temporalmente y activa el modo de Google
    googleCredentialTemp = response.credential;
    activarModoGoogle();
}