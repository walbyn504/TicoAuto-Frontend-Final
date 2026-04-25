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
- **Font Awesome**: Conjunto de iconos para mejorar la UI.
- **GraphQL**: API para realizar consultas de vehículos, preguntas y respuestas.
- **SendGrid API**: Para el envío de correos electrónicos de verificación de cuenta.
- **Twilio API**: Para el envío de mensajes SMS para la autenticación de dos factores (2FA).
- **Google OAuth2**: Para la autenticación de usuarios mediante sus cuentas de Google.
- **Socket.IO**: Para la implementación del **chat en tiempo real** entre los usuarios.

Estas tecnologías permiten desarrollar una interfaz web dinámica y responsiva que se comunica con el backend mediante solicitudes HTTP y **GraphQL** para obtener y manipular los datos de vehículos, preguntas, respuestas y más.

---

## Características principales

### 1. **Autenticación de Usuario**

- **Registro de usuario**:
  - Los usuarios pueden registrarse proporcionando **correo electrónico**, **nombre**, **cédula** (validada a través de un servicio de padrón), **teléfono** y **contraseña**.
  - Los usuarios que se registran con **correo y contraseña** deben pasar por una **autenticación de dos factores (2FA)**. Se enviará un **código SMS** al número de teléfono para completar el registro o inicio de sesión.
  - Los usuarios también pueden registrarse mediante **Google OAuth2**. En este caso, **2FA** no es necesario, pero siempre está habilitada en el backend.

- **Inicio de sesión**:
  - Los usuarios pueden iniciar sesión utilizando **correo y contraseña**, o utilizando **Google OAuth2**.
  - Si el inicio de sesión es con **correo y contraseña**, se enviará un **código de verificación por SMS** para completar el inicio de sesión.
  - Si el inicio de sesión es con **Google OAuth2**, no se requiere 2FA.

### 2. **Gestión de Vehículos**

- **Publicar vehículo**: Los usuarios pueden publicar vehículos proporcionando detalles como **marca**, **modelo**, **año**, **precio**, **estado**, **combustible**, **color**, **transmisión**, **condición** y **imagen**.
- **Consultar vehículos**: Los usuarios pueden consultar vehículos disponibles, con filtros para **marca**, **modelo**, **año**, **precio**, **estado** y más.
- **Detalles de vehículo**: Los usuarios pueden ver los detalles de un vehículo específico, incluidos los datos del vendedor.
- **Editar vehículo**: Los usuarios pueden editar la información de los vehículos que hayan publicado.
- **Eliminar vehículo**: Los usuarios pueden eliminar vehículos publicados.
- **Marcar vehículo como vendido**: Los usuarios pueden marcar un vehículo como **vendido** una vez completada la transacción.

### 3. **Sistema de Preguntas y Respuestas**

- Los usuarios pueden **hacer preguntas** sobre los vehículos y los propietarios pueden **responder** a esas preguntas.
- El sistema de **chat** permite a los usuarios interactuar directamente con los propietarios de los vehículos, haciendo preguntas y recibiendo respuestas. Esta funcionalidad fomenta la **comunicación directa** entre compradores y vendedores.
- **Visualización de preguntas y respuestas**: Las preguntas y respuestas se muestran asociadas a cada vehículo y son visibles para otros usuarios interesados.

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

### 5. **Autenticación de dos factores (2FA)**

- **Usuarios con correo y contraseña**: Al iniciar sesión, se enviará un código de verificación por SMS al número de teléfono proporcionado por el usuario. Este código debe ser ingresado para completar el proceso de autenticación.
- **Usuarios con Google OAuth2**: La 2FA no se aplica, pero siempre está habilitada en el sistema.

---

## Flujo de Usuario

### **1. Registro de Usuario**
- El usuario proporciona su **correo**, **nombre**, **cédula**, **teléfono** y **contraseña**.
- Si se registran con **correo y contraseña**, el sistema valida la **edad** del usuario utilizando la **cédula** y envía un **código de verificación por SMS** (2FA).
- Los usuarios también pueden registrarse a través de **Google OAuth2**, en cuyo caso la **2FA** no es necesaria.

### **2. Inicio de sesión**
- Los usuarios pueden iniciar sesión con **correo y contraseña** o con **Google OAuth2**.
- Si el inicio de sesión es con **correo y contraseña**, el sistema verifica la **credencial** y envía un **código de verificación por SMS** para completar el inicio de sesión.

### **3. Gestión de Vehículos**
- Los usuarios pueden **publicar vehículos** proporcionando los detalles necesarios.
- Pueden **consultar vehículos**, **editar** o **eliminar** los que hayan publicado y **marcar como vendidos** aquellos que ya no están disponibles para la compra.

### **4. Sistema de Preguntas y Respuestas**
- Los usuarios pueden **hacer preguntas** sobre los vehículos, y los **propietarios** pueden **responder**.
- El chat está disponible en la página de cada vehículo para una comunicación fácil entre los compradores y vendedores.

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/walbyn504/TicoAuto-Frontend-Final