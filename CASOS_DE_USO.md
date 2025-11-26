# Casos de Uso de los Endpoints

Este documento describe cuándo y cómo usar cada endpoint de la API.

También contamos con una documentación completa en Postman donde todos los endpoints están listos para probarlos directamente:

https://documenter.getpostman.com/view/23260231/2sB3WyJwDY

---

## Autenticación

### `POST /api/auth/login`
Cuándo usarlo: 
- Al iniciar sesión en el panel administrativo
- Para obtener un token JWT que permita acceder a endpoints protegidos

---

### `POST /api/auth/logout`
Cuándo usarlo:
- Al cerrar sesión del panel administrativo
- Para invalidar el token actual y forzar un nuevo login

---

## Citas Médicas (Públicos - Sin autenticación)

### `GET /api/appointments/available/dates`
Cuándo usarlo:
- Al cargar la página de reserva de citas para mostrar las próximas 2 semanas disponibles
- Para que el paciente vea qué fechas puede seleccionar

---

### `GET /api/appointments/available/times?date=YYYY-MM-DD`
Cuándo usarlo:
- Cuando el paciente selecciona una fecha específica
- Para mostrar solo los horarios disponibles en esa fecha

---

### `POST /api/appointments`
Cuándo usarlo:
- Cuando un paciente completa el formulario de reserva de cita
- Para crear una nueva cita médica en el sistema

---

## Citas Médicas (Administrador - Requiere autenticación)

### `GET /api/appointments`
Cuándo usarlo:
- Al cargar el panel de gestión de citas
- Para ver todas las citas con filtros opcionales

Los filtros opcionales se pasan como query parameters (params en la URL):
- `status`: Filtrar por estado (pending, confirmed, cancelled)
- `date`: Filtrar por fecha específica
- `startDate`: Fecha de inicio para rango de fechas
- `endDate`: Fecha de fin para rango de fechas
- `page`: Número de página para paginación (por defecto: 1)
- `limit`: Cantidad de resultados por página (por defecto: 50)

Ejemplo: `/api/appointments?status=pending&page=1&limit=20`

---

### `GET /api/appointments/stats`
Cuándo usarlo:
- Al cargar el dashboard administrativo
- Para mostrar estadísticas (total, pendientes, confirmadas, canceladas)

---

### `GET /api/appointments/:id`
Cuándo usarlo:
- Para ver los detalles completos de una cita específica

---

### `PUT /api/appointments/:id/status`
Cuándo usarlo:
- Para confirmar una cita pendiente
- Para cancelar una cita confirmada o pendiente
- Para cambiar el estado de una cita

---

## Obras Sociales

### `GET /api/insurance` (Público)
Cuándo usarlo:
- Al cargar el formulario de reserva de citas
- Para mostrar al paciente la lista de obras sociales disponibles

---

### `GET /api/insurance/stats` (Admin)
Cuándo usarlo:
- En el dashboard administrativo
- Para ver cuántas obras sociales están registradas en el sistema

---

### `GET /api/insurance/:id` (Admin)
Cuándo usarlo:
- Para ver los detalles de una obra social específica antes de editarla
- Para verificar información de una obra social

---

### `POST /api/insurance` (Admin)
Cuándo usarlo:
- Cuando se necesita agregar una nueva obra social al sistema
- Cuando comienza a trabajar con una nueva obra social

---

### `PUT /api/insurance/:id` (Admin)
Cuándo usarlo:
- Para corregir el nombre o código de una obra social
- Para actualizar información de una obra social existente

---

### `DELETE /api/insurance/:id` (Admin)
Cuándo usarlo:
- Cuando una obra social ya no se utiliza
- Para eliminar obras sociales que fueron agregadas por error

---

## Health Check

### `GET /health`
Cuándo usarlo:
- Para verificar que el servidor backend esté funcionando
- En monitoreo de salud del sistema
- Para debugging cuando algo no funciona


