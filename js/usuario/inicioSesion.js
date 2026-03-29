const apiBaseUrl = 'http://localhost:3001';

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

            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('usuario', data.nombre);
            sessionStorage.setItem('usuarioId', data.usuarioId);

            mostrarMensaje(data.message || "Inicio de sesión exitoso", 'success', "contenedor-mensajes");

            setTimeout(() => {
                location.href = '../../index.html';
            }, 1000);

        } else {
            mostrarMensaje(data.message, 'error', "contenedor-mensajes");
        }

    } catch (error) {
        mostrarMensaje("No se pudo conectar al servidor", 'error', "contenedor-mensajes");
    }
}