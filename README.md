<div align="center">

```
██████╗  █████╗ ██████╗ ██╗  ██╗███████╗███╗   ███╗ █████╗ ██████╗ ████████╗
██╔══██╗██╔══██╗██╔══██╗██║ ██╔╝██╔════╝████╗ ████║██╔══██╗██╔══██╗╚══██╔══╝
██████╔╝███████║██████╔╝█████╔╝ ███████╗██╔████╔██║███████║██████╔╝   ██║   
██╔═══╝ ██╔══██║██╔══██╗██╔═██╗ ╚════██║██║╚██╔╝██║██╔══██║██╔══██╗   ██║   
██║     ██║  ██║██║  ██║██║  ██╗███████║██║ ╚═╝ ██║██║  ██║██║  ██║   ██║   
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
```

### **ParkSmart — Smart Parking Booking Platform** 🚗

*Find the nearest parking, book your spot, and rate your experience — all in one place.*

<br/>

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![REST API](https://img.shields.io/badge/REST_API-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![GeoJSON](https://img.shields.io/badge/GeoJSON-4B9E44?style=for-the-badge&logoColor=white)

</div>

---

## 📁 Project Structure

```
ParkSmart/
├── backend/
│   ├── api/
│   │   ├── config/          → db.config.js, env.config.js
│   │   ├── controller/      → Request handlers (thin layer)
│   │   ├── middlewares/     → auth.middleware.js, errorHandler.js
│   │   ├── models/          → Mongoose Schemas
│   │   ├── routes/          → Endpoint definitions
│   │   ├── services/        → Business Logic (TODO for each team member)
│   │   └── index.js         → Server entry point
│   ├── .env
│   └── package.json
└── frontend/                → Angular App
```

---

## 👥 Team Assignment

| Member | Module | Backend Files | Frontend Files |
|:---:|---|---|---|
| 1️⃣ | **Auth & Users** | `services/auth.service.js` · `controller/auth.controller.js` | `modules/auth` |
| 2️⃣ | **Parkings** | `services/parkings.service.js` · `controller/parkings.controller.js` | `modules/parkings` |
| 3️⃣ | **Spots & Search** | `services/spots.service.js` · `controller/spots.controller.js` | `modules/search` |
| 4️⃣ | **Bookings** | `services/bookings.service.js` · `controller/bookings.controller.js` | `modules/bookings` |
| 5️⃣ | **Reviews + Notifications + Integration** | `services/reviews.service.js` · `services/notification.service.js` · `index.js` | `modules/reviews` · `pages/` |

---

## 🚀 Getting Started (Backend)

```bash
# 1. Navigate to backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env
```

Fill in your `.env` file:
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/parksmart_db
PORT=5000
JWT_SECRET=any_strong_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

```bash
# 4. Run development server
npm run dev
```

Expected output:
```
✅ DB Connected
🚀 Server running on http://localhost:5000
```

---

## 🧩 API Endpoints

### 🔐 Auth
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login & get JWT token | ❌ |

### 🅿️ Parkings
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/parkings` | Get all parkings | ❌ |
| `GET` | `/api/parkings/nearby?lat=..&lng=..&maxDistance=5000` | Get nearby parkings | ❌ |
| `POST` | `/api/parkings` | Create a new parking | ✅ owner |

### 🔲 Spots
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/spots/parking/:parkingId` | Get all spots in a parking | ❌ |
| `POST` | `/api/spots` | Add a new spot | ✅ owner |
| `PUT` | `/api/spots/:id/status` | Manually change spot status | ✅ owner |

### 📅 Bookings
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/bookings` | Create a booking | ✅ |
| `GET` | `/api/bookings/my` | Get my bookings | ✅ |
| `PATCH` | `/api/bookings/:id/status` | Update booking status | ✅ |

### ⭐ Reviews
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/reviews/parking/:parkingId` | Get reviews for a parking | ❌ |
| `POST` | `/api/reviews` | Add a review | ✅ |

### 🔔 Notifications
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/notifications` | Get my notifications | ✅ |
| `PATCH` | `/api/notifications/read-all` | Mark all as read | ✅ |
| `PATCH` | `/api/notifications/:id/read` | Mark one as read | ✅ |

> 💡 **For any protected endpoint**, send the token in the request header:
> ```
> Authorization: Bearer <your_token>
> ```

---

## 🗄️ Database Schema

```
users          → _id, name, email, password (hashed), role, phone
parkings       → _id, name, address, ownerId, pricePerHour, location (GeoJSON Point), rating
spots          → _id, parkingId, spotNumber, status
bookings       → _id, userId, spotId, parkingId, startTime, durationHours, totalPrice, status, statusHistory[]
reviews        → _id, userId, parkingId, rating, comment
notifications  → _id, userId, bookingId, title, message, type, isRead
```

---

## ⚠️ Team Rules

1. 🗂️ **Each member only works inside their own service & controller files**
2. 📐 **Consistent API response format for everyone:**
   ```json
   { "success": true,  "data": { ... } }
   { "success": false, "message": "..." }
   ```
3. 🌿 **Use Git Branches** — one branch per feature, open a Pull Request when done:
   ```bash
   git checkout -b feature/auth
   git checkout -b feature/bookings
   ```
4. 🔔 **Notifications are created automatically** inside `notification.service.js` — never call them directly from a controller
5. 🚫 **Do NOT modify `index.js`** unless you are Member 5 (Integration lead) or have coordinated with the team
