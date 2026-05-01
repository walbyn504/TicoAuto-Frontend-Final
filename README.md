# TicoAuto - Frontend

## Descripción

**TicoAuto Frontend** es la interfaz web del sistema **TicoAuto**, una plataforma para la **publicación, búsqueda, compra y venta de vehículos**. Los usuarios pueden interactuar con el backend para registrarse, iniciar sesión, gestionar vehículos, realizar preguntas sobre vehículos, responder preguntas y consultar detalles de los vehículos. Además, el sistema cuenta con un **chat de preguntas y respuestas** entre compradores y vendedores.

El frontend está construido utilizando **HTML**, **CSS**, **JavaScript**, y **Bootstrap**. Se comunica con el backend mediante **API RESTful** y **GraphQL** para realizar operaciones como el registro de usuarios, la gestión de vehículos, la gestión de preguntas y respuestas, entre otros.

---

## Tecnologías utilizadas

- **HTML5**: Estructura básica de la página web.
- **CSS3**: Estilos para dar diseño a la interfaz de usuario.
- **JavaScript**: Lógica para manejar las interacciones y la comunicación con la API.
- **Bootstrap 5**: Framework CSS para diseño responsivo y componentes predefinidos.
- **GraphQL**: API para realizar consultas de vehículos, preguntas y respuestas.
- **REST**: API para la comunicación con el backend para operaciones principales (crear, editar y eliminar).
- **Google OAuth2**: Para la autenticación de usuarios mediante sus cuentas de Google.


---

## Funcionalidades principales

### 1. **Autenticación de Usuario**

- **Registro de usuario**:
  - Los usuarios pueden registrarse proporcionando **correo electrónico**, **nombre**, **cédula** (validada a través de un servicio de padrón), **teléfono** y **contraseña**.
  - Los usuarios también pueden registrarse mediante **Google OAuth2** a traves de sus cuentas registradas en Google.
  - Una vez registrado, recibirá un correo para activar la cuenta y poder ingresar por primera vez.

- **Inicio de sesión**:
  - Los usuarios pueden iniciar sesión utilizando **correo y contraseña**, o utilizando **Google OAuth2**.
  - Si el inicio de sesión es con **correo y contraseña**, se enviará un **código de verificación por SMS** para completar el inicio de sesión.
  - Si el inicio de sesión es con **Google OAuth2**, no se requiere código de verificación.

### 2. **Gestión de Vehículos**

- **Publicar vehículo**: Los usuarios pueden publicar vehículos proporcionando detalles como **marca**, **modelo**, **año**, **precio**, **estado**, **combustible**, **color**, **transmisión**, **condición** y **imagen**.
- **Consultar vehículos**: Los usuarios pueden consultar vehículos disponibles, con filtros para **marca**, **modelo**, **año**, **precio**, **estado** y más.
- **Detalles de vehículo**: Los usuarios pueden ver los detalles de un vehículo específico, incluidos los datos del vendedor.
- **Editar vehículo**: Los usuarios pueden editar la información de los vehículos que hayan publicado.
- **Eliminar vehículo**: Los usuarios pueden eliminar vehículos publicados.
- **Marcar vehículo como vendido**: Los usuarios pueden marcar un vehículo como **vendido** una vez completada la transacción.

### 3. **Sistema de Preguntas y Respuestas**

- Los usuarios pueden **hacer preguntas** sobre los vehículos y los propietarios pueden **responder** a esas preguntas.
- El sistema de **chat** permite a los usuarios interactuar directamente con los propietarios de los vehículos, haciendo preguntas y recibiendo respuestas. 
- **Visualización de preguntas y respuestas**: Las preguntas y respuestas se muestran asociadas a cada vehículo.

### 4. **Filtros de Búsqueda y Paginación**

- **Filtros de búsqueda**:
  - Los usuarios pueden buscar vehículos utilizando filtros como:
    - **Marca**
    - **Modelo**
    - **Año mínimo y máximo**
    - **Precio mínimo y máximo**
    - **Estado** (Disponible o Vendido)

- **Paginación**:
  - Los resultados de la búsqueda están **paginados**. Se muestra una cantidad limitada de vehículos por página, y los usuarios pueden navegar entre las páginas de resultados.


---

## Flujo de Usuario

1. Registrarse en la plataforma (Google o correo y constraseña).
2. Activar cuenta mediante link enviado al correo (cuando ingresa por primera vez).
3. Iniciar sesión con google o correo y contraseña (este último aplica 2FA - mensajes de texto con un código).
4. Ingresa a la pantalla principal donde muestra los vehículos publicados con las opciones de ver detalle, copiar enlace y enviar mensaje.

- **Ver detalle:** muestra las características del vehículo y datos del dueño.
- **Copiar enlace:** permite enviar información de un vehículo a otro usuario.
- **Enviar mensaje:** inicia o continua la conversación relacionada al vehículo.

5. En la opción de gestión vehículo puede crear, editar, eliminar o marcar como vendido.
6. En la opción de chat puede observar las conversaciones con otros usuarios, tanto preguntas como respuestas.
7. Finalmente, puede salirse, dando clic en cerrar sesión.


***Los usuarios no logueados, solo podrán ver los vehículos publicados con información básica y copiar enlace para compartir.***

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/walbyn504/TicoAuto-Frontend-Final