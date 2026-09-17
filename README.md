<div align="center">


![ParkSmart — Find • Book • Park](./docs/banner.png)

### **Smart Parking Booking Platform** 🚗

_Find the nearest parking, book your spot, and rate your experience — all in one place._

<br/>

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
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
│   │   ├── config/          → db.config.js, env.config.js, passport.js (Google/Facebook OAuth)
│   │   ├── controller/      → Thin request handlers (one per module)
│   │   ├── middlewares/     → auth.middleware.js, errorHandler.js, upload.middleware.js (multer)
│   │   ├── models/          → Mongoose schemas (user, parking, spot, booking, review, notification)
│   │   ├── routes/          → Endpoint definitions (auth, users, parkings, spots, bookings, reviews, notifications)
│   │   └── index.js         → Server entry point (static /uploads + /api/* + error handler)
│   ├── uploads/             → Local image uploads (gitignored, served via express.static)
│   ├── seed.js              → Demo seed data (run with `node seed.js`)
│   ├── .env / .env.example
│   └── package.json
├── frontend/                → Angular 21 + Tailwind CSS 4 standalone-components app
│   └── src/app/
│       ├── core/            → guards, interceptors, models, services, utils
│       ├── features/        → auth, parkings (list/detail), bookings, notifications
│       ├── pages/           → driver/*, owner/*, admin/*, landing, about, contact
│       └── shared/          → components (navbar, sidebar, footer, parking-card,
│                              parking-spot, image-upload, chart-widget, review-summary, …)
└── README.md
```

---

## 👥 Team Assignment

| Member | Module                                    | Backend Files                                                                   | Frontend Files               |
| :----: | ----------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------- |
|   1️⃣   | **Auth & Users**                          | `services/auth.service.js` · `controller/auth.controller.js`                    | `features/auth`              |
|   2️⃣   | **Parkings**                              | `services/parkings.service.js` · `controller/parkings.controller.js`            | `features/parkings`          |
|   3️⃣   | **Spots & Search**                        | `services/spots.service.js` · `controller/spots.controller.js`                  | `features/parkings` (search) |
|   4️⃣   | **Bookings**                              | `services/bookings.service.js` · `controller/bookings.controller.js`            | `features/bookings`          |
|   5️⃣   | **Reviews + Notifications + Integration** | `services/reviews.service.js` · `services/notification.service.js` · `index.js` | `features/notifications` · `pages/` |

---

## 🚀 Getting Started

### Backend

```bash
cd backend
npm install
cp .env.example .env   # (Windows: copy .env.example .env)
```

Fill in your `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/parksmart_db
PORT=5000
JWT_SECRET=any_strong_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:4200
# Google/Facebook OAuth keys are optional — local register/login works without them
```

```bash
npm run dev    # watch mode (nodemon api/index.js)
npm start      # production (node api/index.js)
node seed.js   # optional demo data
```

Expected output:

```
✅ DB Connected
🚀 Server running on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
ng serve              # → http://localhost:4200 (proxies nothing — API base comes from src/environments/environment.ts)
ng build              # production build into dist/
```

API base URLs live in `src/environments/environment.ts` (`apiUrl: http://localhost:5000/api`); production values in `environment.prod.ts`.

---

## 🧩 API Endpoints

> 💡 **For any protected endpoint**, send the token in the request header:
>
> ```
> Authorization: Bearer <your_token>
> ```

### 🔐 Auth (`/api/auth`)

| Method | Endpoint                  | Description                              | Auth Required |
| ------ | ------------------------- | ---------------------------------------- | :-----------: |
| `POST` | `/api/auth/register`      | Register a new user (driver/owner)       |      ❌       |
| `POST` | `/api/auth/login`         | Login & get JWT token                    |      ❌       |
| `GET`  | `/api/auth/google`        | Google OAuth login                       |      ❌       |
| `GET`  | `/api/auth/facebook`      | Facebook OAuth login                     |      ❌       |
| `GET`  | `/api/auth/oauth/failure` | OAuth failure redirect                   |      ❌       |

### 👤 Users (`/api/users`)

| Method   | Endpoint               | Description                              |  Auth Required   |
| -------- | ---------------------- | ---------------------------------------- | :--------------: |
| `GET`    | `/api/users`           | List all users (contains PII)            |    ✅ admin      |
| `GET`    | `/api/users/:id`       | Get one user                             | ✅ self or admin |
| `PATCH`  | `/api/users/:id`       | Update name/phone (admin: + role, email) | ✅ self or admin |
| `DELETE` | `/api/users/:id`       | Delete a user                            |    ✅ admin      |
| `POST`   | `/api/users/:id/avatar`| Upload profile photo (multipart `image`) | ✅ self or admin |

### 🅿️ Parkings (`/api/parkings`)

| Method   | Endpoint                                              | Description                          |      Auth Required      |
| -------- | ----------------------------------------------------- | ------------------------------------ | :---------------------: |
| `GET`    | `/api/parkings`                                       | Get all parkings (newest first)      |           ❌            |
| `GET`    | `/api/parkings/nearby?lat=..&lng=..&maxDistance=5000` | Geo search (2dsphere `$near`)        |           ❌            |
| `GET`    | `/api/parkings/mine`                                  | Current owner's parkings             |        ✅ owner         |
| `GET`    | `/api/parkings/:id`                                   | Single parking details               |           ❌            |
| `POST`   | `/api/parkings`                                       | Create a parking                     |        ✅ owner         |
| `PUT`    | `/api/parkings/:id`                                   | Update own parking                   |        ✅ owner         |
| `DELETE` | `/api/parkings/:id`                                   | Delete (see policy below)            | ✅ owner (own) / admin  |
| `DELETE` | `/api/parkings/:id?force=true`                        | Delete incl. non-active history      | ✅ owner (own) / admin  |
| `POST`   | `/api/parkings/:id/image`                             | Upload parking photo (multipart `image`) |     ✅ owner (own)  |

**Delete policy:** always blocked with `409` while `active` bookings exist. Otherwise the parking's spots, reviews and uploaded photo are removed with it. Non-active booking history blocks a plain delete (`409 Cannot delete a parking with booking history`) unless `?force=true` — past bookings are kept and shown as "Deleted parking".

### 🔲 Spots (`/api/spots`)

| Method   | Endpoint                        | Description                          | Auth Required |
| -------- | ------------------------------- | ------------------------------------ | :-----------: |
| `GET`    | `/api/spots`                    | All spots (populated)                |   ✅ admin    |
| `GET`    | `/api/spots/parking/:parkingId` | Spots of one parking (public)        |      ❌       |
| `GET`    | `/api/spots/:id`                | Single spot                          |      ❌       |
| `POST`   | `/api/spots`                    | Add a spot (`parkingId`, `spotNumber`)|  ✅ owner    |
| `PUT`    | `/api/spots/:id/status`         | Set `available`/`booked` (ownership) |   ✅ owner    |
| `DELETE` | `/api/spots/:id`                | Delete (blocked if booked)           |   ✅ owner    |

### 📅 Bookings (`/api/bookings`)

| Method  | Endpoint                   | Description                                   | Auth Required |
| ------- | -------------------------- | --------------------------------------------- | :-----------: |
| `POST`  | `/api/bookings`            | Book (`parkingId`, `startTime`, `durationHours`, optional `spotId`) | ✅ |
| `GET`   | `/api/bookings`            | All bookings                                  |   ✅ admin    |
| `GET`   | `/api/bookings/my`         | Signed-in driver's bookings                   |      ✅       |
| `GET`   | `/api/bookings/owner`      | Bookings on the owner's parkings              |   ✅ owner    |
| `PATCH` | `/api/bookings/:id/status` | `cancelled`/`completed` (role-checked)        |      ✅       |

### ⭐ Reviews (`/api/reviews`)

| Method   | Endpoint                          | Description                                  | Auth Required |
| -------- | --------------------------------- | -------------------------------------------- | :-----------: |
| `GET`    | `/api/reviews/parking/:parkingId` | Reviews of a parking (reviewer name included)|      ❌       |
| `GET`    | `/api/reviews/my`                 | Signed-in user's reviews                     |      ✅       |
| `POST`   | `/api/reviews`                    | Add/update review (requires a booking there) |      ✅       |
| `DELETE` | `/api/reviews/:id`                | Delete (author or admin; rating recomputed)  |      ✅       |

### 🔔 Notifications (`/api/notifications`)

| Method  | Endpoint                      | Description          | Auth Required |
| ------- | ----------------------------- | -------------------- | :-----------: |
| `GET`   | `/api/notifications`          | My notifications     |      ✅       |
| `PATCH` | `/api/notifications/read-all` | Mark all as read     |      ✅       |
| `PATCH` | `/api/notifications/:id/read` | Mark one as read     |      ✅       |

### 🖼️ Uploaded files

- `POST` multipart/form-data with field name **`image`** (JPEG/PNG/WebP only, max 5 MB).
- Files land in `backend/uploads/` and are served at `GET /uploads/<file>` (local disk — fine for local demo/defense; ephemeral on most PaaS hosts).
- Re-uploading replaces the old file (old one deleted, best-effort).
- Frontend resolves display URLs via `core/utils/image-url.ts` (backend origin derived from `environment.apiUrl`).

---

## 🧭 Roles & Frontend Flows

| Role       | Entry pages & abilities |
| ---------- | ----------------------- |
| **Driver** | Search parkings (`/parkings`), public details, guarded flow: details → select-spot (green/red/navy grid) → booking → confirmation/success → review; My bookings, notifications (bell icon), personal profile with photo upload. |
| **Owner**  | Dashboard (stat cards + bookings-doughnut + active-per-parking bar chart + recent bookings), My parkings (add/edit, photo upload, spot management), owner bookings (complete/cancel), owner reviews, notifications, profile. |
| **Admin**  | Dashboard (users/bookings charts), users, parkings (incl. force delete), spots overview, bookings, reviews moderation, notifications, settings, profile. |
| Guest      | Landing, parkings search + public details, about, contact, login/register (local + Google/Facebook OAuth). “Book” CTAs redirect to login with `returnUrl`. |

Shared UI: `navbar` (role-aware links, bell with unread dot, avatar badge), `sidebar` (owner/admin), `footer` (landing/about/contact), `parking-card` (photo + spots pill), `image-upload` (picker + instant preview), `chart-widget` (Chart.js wrapper), `review-summary` (average + star bars), status/rating/loading/empty/error states.

---

## 🗄️ Database Schema

```
users          → _id, name, email, password (hashed), role [driver|owner|admin], phone,
                 provider [local|google|facebook], providerId, avatarUrl
parkings       → _id, name, address, ownerId, pricePerHour, location (GeoJSON Point [lng,lat]),
                 rating (auto from reviews), imageUrl
spots          → _id, parkingId, spotNumber, status [available|booked]
bookings       → _id, userId, spotId, parkingId, startTime, durationHours, totalPrice,
                 status [active|completed|cancelled], statusHistory[]
reviews        → _id, userId, parkingId, rating (1-5), comment
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
6. 🖼️ **Uploads:** multipart field is always named `image`; images are JPEG/PNG/WebP ≤ 5 MB; never commit `backend/uploads/*` (only `.gitkeep`)
7. 🧹 **Delete policy:** parkings cascade spots/reviews/photo; `?force=true` is required when non-active booking history exists; `active` bookings always block deletion
