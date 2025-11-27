# 🏥 Sistema de Gestión de Citas Médicas

Sistema completo de gestión de citas médicas para consultorios de dermatología, desarrollado con React (frontend) y Node (backend).

## 📋 Descripción del Proyecto

Este sistema permite a los pacientes reservar citas médicas de forma online, mientras que el administrador puede gestionar las citas, obras sociales y ver estadísticas del consultorio.

### Características principales:

- **Frontend (React)**
  - Interfaz moderna y responsive con Material-UI
  - Reserva de citas online para pacientes
  - Panel administrativo para gestión de citas y obras sociales
  - Autenticación con JWT
  - Visualización de estadísticas y horarios disponibles

- **Backend (Node.js)**
  - API RESTful completa
  - Autenticación JWT con tokens 
  - Gestión de citas médicas (crear, confirmar, cancelar)
  - Gestión de obras sociales (CRUD completo)
  - Validaciones y seguridad robusta
  - Notificaciones por email

- **Base de Datos**
  - MongoDB en la nube (MongoDB Atlas)
  - Modelos: Usuarios, Citas, Obras Sociales

## Levantar proyecto

1. **Instalar dependencias del backend:**
   ```bash
   cd backend
   npm install
   ```

2. **Instalar dependencias del frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuración

#### Backend

1. Si no esta el archivo `.env` crearlo en la carpeta `backend/`:
   ```env
   # Configuración del servidor
   PORT=5000
   NODE_ENV=development

   # Base de datos MongoDB (en la nube - MongoDB Atlas)
    MONGODB_URI=mongodb+srv://myUser:eNF6o5kjOQ7Fzxw8@medicocluster.sfigkpi.mongodb.net/medicoDB?retryWrites=true&w=majority&appName=medicoCluster

   # JWT Secret
    JWT_SECRET=3308a91db701d09d79f730e0fb2fe742

   # Configuración de Email
   RESEND_API_KEY=re_D9JDRN5N_49hy21NwQWfNvpc6qx5H8G4T

   ```

## Ejecutar el Proyecto

El proyecto requiere dos terminales ejecutándose simultáneamente: una para el backend y otra para el frontend.

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

El servidor backend estará disponible en: `http://localhost:5000`

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## Credenciales de Administrador

Para acceder al panel administrativo usar las siguientes credenciales:

- Usuario: `admin`
- Contraseña: `dermato1234`

## 📁 Estructura del Proyecto

```
api-medico-tpo/
├── backend/                 # Servidor Node.js/Express
│   ├── controllers/        # Controladores de la API
│   ├── middleware/         # Middlewares (auth, validación, seguridad)
│   ├── models/            # Modelos de MongoDB/Mongoose
│   ├── routes/            # Rutas de la API
│   ├── services/          # Lógica de negocio
│   ├── server.js          # Punto de entrada del servidor
│   └── package.json
│
├── frontend/              # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── services/      # Servicios de API
│   │   ├── utils/         # Utilidades
│   │   └── main.jsx       # Punto de entrada
│   └── package.json
│
└── README.md            
```

## 🗄️ Base de Datos

Este proyecto utiliza MongoDB en la nube (MongoDB Atlas). 
- **users**: Usuarios del sistema (administradores)
- **appointments**: Citas médicas
- **insuranceproviders**: Obras sociales

## 📚 Documentación de la API

Para ver todos los endpoints disponibles y probarlos con Postman, consulta la documentación completa en:

**https://documenter.getpostman.com/view/23260231/2sB3WyJwDY**

Para ver los casos de uso de cada endpoint, consulta el archivo [CASOS_DE_USO.md](./CASOS_DE_USO.md)

## 🔒 Seguridad

- Autenticación JWT con tokens de 7 días de duración
- Contraseñas encriptadas con bcrypt
- Rate limiting en endpoints sensibles
- Validación de datos en todas las requests
- CORS configurado

