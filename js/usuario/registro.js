const apiBaseUrl = 'http://localhost:3001';

let googleCredentialTemp = null;

function activarModoGoogle() {
    document.getElementById('modoGoogle').value = 'true';

    document.getElementById('correo').value = '';
    document.getElementById('contrasenna').value = '';

    document.getElementById('bloqueCredenciales').style.display = 'none';

    mostrarMensaje(
        'Cuenta de Google seleccionada. Ahora consulta la cédula y completa el teléfono para finalizar el registro.',
        'success',
        'contenedor-mensajes'
    );
}

async function consultarCedula() {
    const cedula = document.getElementById('cedula').value.trim();

    if (!cedula) {
        mostrarMensaje('La cédula es obligatoria', 'error', 'contenedor-mensajes');
        return;
    }

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

            
            if (response.status === 404) {
                mostrarMensaje('La cédula no se encuentra en el padrón', 'error', 'contenedor-mensajes');
            } else {
                mostrarMensaje(data.message || 'No se pudo consultar el padrón', 'error', 'contenedor-mensajes');
            }

            return;
        }

        document.getElementById('nombre').value = data.nombre || '';
        document.getElementById('primerApellido').value = data.apellidoPaterno || '';
        document.getElementById('segundoApellido').value = data.apellidoMaterno || '';

        mostrarMensaje('Cédula validada', 'success', 'contenedor-mensajes');

    } catch (error) {
        mostrarMensaje('No se pudo conectar con el padrón', 'error', 'contenedor-mensajes');
    }
}

async function registrarUsuario() {
    const modoGoogle = document.getElementById('modoGoogle').value === 'true';

    const cedula = document.getElementById('cedula').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const primerApellido = document.getElementById('primerApellido').value.trim();
    const segundoApellido = document.getElementById('segundoApellido').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const contrasenna = document.getElementById('contrasenna').value.trim();

    if (!cedula || !nombre || !primerApellido || !segundoApellido || !telefono || !correo || !contrasenna) {
        mostrarMensaje('Debes completar todos los campos', 'error', 'contenedor-mensajes');
        return;
    }

    const regexCedula = /^\d{9}$/;
    if (!regexCedula.test(cedula)) {
        mostrarMensaje('La cédula debe tener exactamente 9 dígitos', 'error', 'contenedor-mensajes');
        return;
    }

    const regexTelefono = /^[0-9]{8,}$/;
    if (!regexTelefono.test(telefono)) {
        mostrarMensaje('El teléfono debe tener al menos 8 dígitos', 'error', 'contenedor-mensajes');
        return;
    }

    if (modoGoogle) {
        if (!googleCredentialTemp) {
            mostrarMensaje('Primero debes registrarte con Google', 'error', 'contenedor-mensajes');
            return;
        }

        try {
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

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
        mostrarMensaje('El formato del correo no es válido', 'error', 'contenedor-mensajes');
        return;
    }

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

function handleGoogleRegisterResponse(response) {
    if (!response || !response.credential) {
        mostrarMensaje('No se recibió la credencial de Google', 'error', 'contenedor-mensajes');
        return;
    }

    googleCredentialTemp = response.credential;
    activarModoGoogle();
}