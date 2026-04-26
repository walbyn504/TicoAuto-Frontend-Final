const apiBaseUrl = 'http://localhost:3001';


// Al cargar la página, muestra un mensaje de registro exitoso si existe en sessionStorage
window.onload = () => {
    const mensaje = sessionStorage.getItem('mensajeRegistroExitoso');

    const mensajeSesion = sessionStorage.getItem('mensajeSesion');

    if (mensajeSesion) {
        mostrarMensaje(mensajeSesion, 'error', 'contenedor-mensajes');
        sessionStorage.removeItem('mensajeSesion');
    }

    // Si el mensaje existe, lo muestra y luego lo elimina
    if (mensaje) {
        mostrarMensaje(mensaje, 'success', 'contenedor-mensajes');

        // borrar para que no se repita
        sessionStorage.removeItem('mensajeRegistroExitoso');
    }
};

// Función para iniciar sesión con correo y contraseña
async function iniciarSesion() {
    const correo = document.getElementById('correo').value.trim();
    const contrasenna = document.getElementById('contrasenna').value.trim();

    // Verifica si ambos campos están completos
    if (!correo || !contrasenna) {
        mostrarMensaje('Complete todos los campos correctamente', 'error', "contenedor-mensajes");
        return;
    }

    // Verifica que el formato del correo sea válido
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

        const data = await response.json(); // Obtiene la respuesta de la API

        // Si la respuesta es exitosa, verifica si requiere 2FA
        if (response.ok) {
            if (data.requiere2FA) {
                const uid = encodeURIComponent(data.usuarioId); // Codifica el ID del usuario
                const exp = encodeURIComponent(data.codigo2FAExpira); // Codifica la expiración del código 2FA

                // Redirige al usuario a la página de verificación 2FA
                location.href = `verificar2FA.html?uid=${uid}&exp=${exp}`;
                return;
            }

            // Si no requiere 2FA, guarda el token en sessionStorage y redirige al inicio
            sessionStorage.setItem('token', data.token);
            location.href = '../../index.html';
        } else {
            mostrarMensaje(data.message || "No se pudo iniciar sesión", 'error', "contenedor-mensajes");
        }

    } catch (error) {
        mostrarMensaje("No se pudo conectar al servidor", 'error', "contenedor-mensajes");
    }
}

// Función para manejar el inicio de sesión con Google
async function handleGoogleLoginResponse(response) {

    try {
        // Envía la credencial de Google a la API para autenticación
        const respuesta = await fetch(`${apiBaseUrl}/api/autenticacion/google/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                credential: response.credential  // Envía la credencial de Google
            })
        });

        const data = await respuesta.json(); // Obtiene la respuesta de la API


        // Si la respuesta es exitosa, guarda el token en sessionStorage y redirige al inicio
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


function mostrarOcultarContrasenna() {
  const i = document.getElementById("contrasenna");
  const icon = document.getElementById("icono");
  i.type = i.type === "password" ? "text" : "password";
  icon.classList.toggle("bi-eye");
  icon.classList.toggle("bi-eye-slash");
}