// Lógica para manejar la verificación de 2FA (autenticación de dos factores).
// Permite al usuario ingresar un código de verificación y controlar el tiempo de expiración del código.

const apiBaseUrl = 'http://localhost:3001';

let intervalo = null;
let fechaExpiracionReal = null;

// Al cargar la página, verifica si el usuario tiene un ID válido y una fecha de expiración
window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    const usuarioId = params.get('uid'); // Obtiene el ID del usuario desde la URL
    const exp = params.get('exp'); // Obtiene la fecha de expiración del código desde la URL

    // Si no hay un ID de usuario o la fecha de expiración es inválida, redirige al inicio de sesión
    if (!usuarioId || !exp) {
        location.href = 'inicioSesion.html';
        return;
    }

    fechaExpiracionReal = new Date(exp); // Convierte la fecha de expiración a un objeto Date

    // Si la fecha de expiración es inválida, redirige al inicio de sesión
    if (isNaN(fechaExpiracionReal.getTime())) {
        location.href = 'inicioSesion.html';
        return;
    }

    iniciarContador(); // Inicia el contador para la expiración del código
};

// Función que inicia el contador que muestra el tiempo restante para la expiración del código
function iniciarContador() {
    if (intervalo) {
        clearInterval(intervalo); // Si ya existe un intervalo, lo limpia
    }

    // Actualiza el contador al cargar la página
    actualizarContador();

    // Actualiza el contador cada segundo
    intervalo = setInterval(() => {
        actualizarContador();
    }, 1000);
}

// Actualiza el contador que muestra el tiempo restante
function actualizarContador() {
    const contador = document.getElementById('contadorTiempo');
    const boton = document.getElementById('btnVerificar');

    // Calcula los milisegundos restantes hasta la expiración
    const milisegundosRestantes = fechaExpiracionReal.getTime() - Date.now();

    // Si el código ha expirado, muestra el estado expirado
    if (milisegundosRestantes <= 0) {
        mostrarEstadoExpirado();
        return;
    }

    const totalSegundos = Math.floor(milisegundosRestantes / 1000);
    const minutos = Math.floor(totalSegundos / 60); // Calcula los minutos restantes
    const segundos = totalSegundos % 60;  // Calcula los segundos restantes

    // Muestra el tiempo restante en el formato "minutos:segundos"
    contador.textContent = `El código expira en: ${minutos}:${segundos.toString().padStart(2, '0')}`;
    contador.classList.remove('text-secondary');
    contador.classList.add('text-danger'); // Muestra el contador en rojo
    boton.disabled = false; // Habilita el botón de verificación
}

// Verifica el código ingresado por el usuario
async function verificarCodigo() {
    const codigo = document.getElementById('codigo').value.trim(); // Obtiene el código ingresado
    const params = new URLSearchParams(window.location.search);
    const usuarioId = params.get('uid'); // Obtiene el ID del usuario desde la URL

    // Verifica que el código esté ingresado y que el usuario ID sea válido
    if (!codigo) {
        mostrarMensaje("Ingrese el código", "error", "contenedor-mensajes");
        return;
    }

    if (!usuarioId) {
        mostrarMensaje("Usuario inválido", "error", "contenedor-mensajes");
        return;
    }

    // Si el código ha expirado, muestra un mensaje de error
    if (fechaExpiracionReal.getTime() <= Date.now()) {
        mostrarMensaje("El código ya expiró. Inicie sesión nuevamente.", "error", "contenedor-mensajes");
        return;
    }

    try {
        // Realiza una solicitud a la API para verificar el código de 2FA
        const response = await fetch(`${apiBaseUrl}/api/autenticacion/codigo2FA`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuarioId, codigo })
        });

        const data = await response.json();

        // Si la respuesta no es exitosa, muestra un mensaje de error
        if (!response.ok) {
            mostrarMensaje(data.message || "Código incorrecto", "error", "contenedor-mensajes");
            return;
        }

        // Si el código es correcto, guarda el token y redirige al usuario
        sessionStorage.setItem('token', data.token);

        // Limpia el intervalo del contador
        if (intervalo) {
            clearInterval(intervalo);
        }

        location.href = '../../index.html';

    } catch (error) {
        mostrarMensaje("Error al verificar código", "error", "contenedor-mensajes");
    }
}

function cerrar2FA() {
    location.href = 'inicioSesion.html';
}

// Muestra el estado de expiración del código cuando el tiempo ha pasado
function mostrarEstadoExpirado() {
    const contador = document.getElementById('contadorTiempo');
    const boton = document.getElementById('btnVerificar');
    const inputCodigo = document.getElementById('codigo');
    const accionesExpirado = document.getElementById('accionesExpirado');

    // Limpia el intervalo del contador
    if (intervalo) {
        clearInterval(intervalo);
        intervalo = null;
    }

    // Muestra que el código ha expirado
    contador.textContent = 'El código expiró. Debes iniciar sesión nuevamente.';
    contador.classList.remove('text-danger');
    contador.classList.add('text-secondary'); // Muestra el contador en gris

    // Deshabilita el botón de verificación y oculta el campo de entrada de código
    boton.disabled = true;
    boton.classList.add('d-none');

    inputCodigo.disabled = true;
    inputCodigo.classList.add('bg-light');  // Cambia el fondo del input a gris

    // Muestra el botón para volver a iniciar sesión
    accionesExpirado.classList.remove('d-none');
}