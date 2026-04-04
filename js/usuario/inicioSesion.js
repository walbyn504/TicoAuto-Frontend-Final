const apiBaseUrl = 'http://localhost:3001';


window.onload = () => {
    const mensaje = sessionStorage.getItem('mensajeRegistroExitoso');

    if (mensaje) {
        mostrarMensaje(mensaje, 'success', 'contenedor-mensajes');

        // borrar para que no se repita
        sessionStorage.removeItem('mensajeRegistroExitoso');
    }
};

async function iniciarSesion() {
    const correo = document.getElementById('correo').value.trim();
    const contrasenna = document.getElementById('contrasenna').value.trim();

    if (!correo || !contrasenna) {
        mostrarMensaje('Complete todos los campos correctamente', 'error', "contenedor-mensajes");
        return;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexCorreo.test(correo)) {
        mostrarMensaje("El formato del correo no es válido", 'error', "contenedor-mensajes");
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/api/autenticacion/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correo, contrasenna })
        });

        const data = await response.json();

        if (response.ok) {
            if (data.requiere2FA) {
                const uid = encodeURIComponent(data.usuarioId);
                const exp = encodeURIComponent(data.codigo2FAExpira);

                location.href = `verificar2FA.html?uid=${uid}&exp=${exp}`;
                return;
            }

            sessionStorage.setItem('token', data.token);
            location.href = '../../index.html';
        } else {
            mostrarMensaje(data.message || "No se pudo iniciar sesión", 'error', "contenedor-mensajes");
        }

    } catch (error) {
        mostrarMensaje("No se pudo conectar al servidor", 'error', "contenedor-mensajes");
    }
}

async function handleGoogleLoginResponse(response) {
    console.log("Respuesta de Google:", response);

    try {
        const respuesta = await fetch(`${apiBaseUrl}/api/autenticacion/google/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                credential: response.credential
            })
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            sessionStorage.setItem('token', data.token);
            location.href = '../../index.html';
        } else {
            mostrarMensaje(data.message || 'No se pudo iniciar sesión con Google', 'error', "contenedor-mensajes");
        }

    } catch (error) {
        mostrarMensaje("No se pudo conectar al servidor", 'error', "contenedor-mensajes");
    }
}