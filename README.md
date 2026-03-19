# 🎫 Sistema de Gestión de Tickets con Orden

**Angular 21 + CodeIgniter 4 + MySQL**

![WhatsApp Image 2026-03-12 at 3 21 51 PM(1)](https://github.com/user-attachments/assets/6715ceb1-9c2c-4625-9132-acbe3a361db3)


Sistema web para la **gestión de colas mediante tickets**, ideal para negocios, instituciones o centros de atención que necesitan organizar turnos de manera eficiente.

---

## 🚀 Tecnologías utilizadas

### 🔹 Frontend

* Angular 21 (Standalone Components)
* TypeScript
* Bootstrap 5 (CSS puro, sin SASS)
* Guards para control de acceso
* Servicios HTTP

### 🔹 Backend

* CodeIgniter 4.6 (API REST)
* Autenticación con JWT
* Arquitectura MVC
* Migraciones y Seeders

### 🔹 Base de datos

* MySQL
* Script SQL inicial (`schema.sql`)

---

## 🎯 Funcionalidades principales

* 🎟️ Generación de tickets automáticos
* 📊 Gestión de colas por orden
* 👨‍💼 Panel administrativo
* 🔐 Autenticación con JWT (login seguro)
* 🚦 Control de acceso por roles
* 📢 Llamado de tickets en flujo de atención
* 📈 Historial de atención
* ⚡ Interfaz rápida y responsiva

---

## 📁 Estructura del proyecto

```
📦 proyecto-ticketera
├── backend/         # API REST (CodeIgniter 4)
├── frontend/        # Aplicación Angular 21
├── docs/
│   └── sql/
│       └── schema.sql   # Script de base de datos
```

---

## ⚙️ Instalación y configuración

### 1️⃣ Base de datos

Ejecuta el script:

```
docs/sql/schema.sql
```

O usa las migraciones del backend.

---

### 2️⃣ Backend (CodeIgniter 4)

```
cd backend
composer install
cp env .env
php spark serve
```

Configura:

* Base de datos en `.env`
* Clave JWT

---

### 3️⃣ Frontend (Angular 21)

```
cd frontend
npm install
ng serve
```

La app estará en:

```
http://localhost:4200
```

---

## 🔐 Autenticación

El sistema usa **JWT (JSON Web Tokens)** para:

* Login seguro
* Protección de rutas (Guards en Angular)
* Control de sesiones

---

## 📸 Capturas (opcional)

Puedes agregar aquí imágenes del sistema:

```
/docs/images/
```

Ejemplo:

```
![Dashboard](docs/images/dashboard.png)
```

---

## 🧠 Casos de uso

* Bancos 🏦
* Clínicas 🏥
* Municipalidades 🏛️
* Centros de atención al cliente 📞
* Negocios con alta demanda 🏪

---

## 📌 Estado del proyecto

🟢 En desarrollo / Mejoras continuas

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas.
Puedes hacer un **fork** y enviar un **pull request**.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

## 👨‍💻 Autor

**Cristian De la Cruz**
Desarrollador Full Stack (Laravel | Angular | Android)

![WhatsApp Image 2026-03-12 at 3 21 51 PM](https://github.com/user-attachments/assets/c6e7deec-49a0-4348-8794-2040cef6d979)
![WhatsApp Image 2026-03-12 at 3 22 20 PM](https://github.com/user-attachments/assets/0d00848f-5106-4f76-8742-4af9da819c92)
![WhatsApp Image 2026-03-12 at 3 22 02 PM](https://github.com/user-attachments/assets/28cc0804-2f07-45bd-b1a6-23a41d33d85f)
![WhatsApp Image 2026-03-12 at 3 21 51 PM(1)](https://github.com/user-attachments/assets/de3137ff-9808-4e99-bb4b-a9aa6f42bd7e)
![WhatsApp Image 2026-03-12 at 3 22 56 PM](https://github.com/user-attachments/assets/0dd21fc1-c897-4229-b980-9b5b12d45297)



