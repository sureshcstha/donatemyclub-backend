# DonateMyClub – Backend API
## Overview
The DonateMyClub RESTful API built with Node.js and Express facilitates the management of club donations, providing endpoints to handle users, donations, and webhooks.

## Tech Stack
- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB** – Database
- **Mongoose** – Object Data Modeling (ODM) for MongoDB
- **Other dependencies**: (e.g. dotenv, cors, stripe, bcrypt)

## Features
- CRUD operations for clubs, donations, and webhook integrations
- Secure endpoints with middleware (e.g., authentication, input validation)
- Modular folder structure (`controllers/`, `models/`, `routes/`, `middleware/`, `db/`, `webhook/`)
- Configurable via environment variables

## Getting Started

### Prerequisites
- Node.js
- npm or yarn
- A running instance of MongoDB (local or cloud)

### Installation
```
git clone https://github.com/sureshcstha/donatemyclub-backend.git
cd donatemyclub-backend
npm install
```
### Configuration
Create a .env file in the root:
```
MONGODB_URL=your_mongo_connection_string
STRIPE_PUBLISHABLE_KEY=your_stripe_pk
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_key
ALLOWED_ORIGINS=your_allowed_origins
```

## Base URL

All endpoints are relative to:

```
https://donatemyclub.onrender.com
```

## Endpoints

### 1. Create a Club

- **Endpoint:** `POST /api/clubs`
- **Description:** Creates a new club entry.
- **Request Body:**
    
    ```json
    {
      "id": "chess-club",
      "name": "Chess Club",
      "description": "A club for chess enthusiasts."
    }
    ```
    
- **Success Response:** `201 Created`
    
    ```json
    {
      "_id": "606d1c8c6f8b2c3a90f1a9f5",
      "id": "chess-club",
      "name": "Chess Club",
      "description": "A club for chess enthusiasts.",
      "__v": 0
    }
    ```
    
- **Error Responses:**
    - `400 Bad Request` — Club ID already exists
    - `500 Internal Server Error` — Database error


### 2. Get All Clubs

- **Endpoint:** `GET /api/clubs`
- **Description:** Retrieves a list of all clubs.
- **Success Response:** `200 OK`
    
    ```json
    [
      {
        "_id": "606d1c8c6f8b2c3a90f1a9f5",
        "id": "chess-club",
        "name": "Chess Club",
        "description": "A club for chess enthusiasts.",
        "__v": 0
      },
      ...
    ]
    ```
    

### 3. Get Club by ID

- **Endpoint:** `GET /api/clubs/:clubId`
- **Description:** Retrieves details of a specific club by its ID.
- **Example:**
    
    `GET /api/clubs/chess-club`
    
- **Success Response:** `200 OK`
    
    ```json
    {
      "_id": "606d1c8c6f8b2c3a90f1a9f5",
      "id": "chess-club",
      "name": "Chess Club",
      "description": "A club for chess enthusiasts.",
      "__v": 0
    }
    ```
    

### 4. Search Clubs

- **Endpoint:** `GET /api/clubs/search?query=term`
- **Description:** Searches for clubs by name or description using case-insensitive matching.
- **Query Parameters:**
    - `query` (string, required) — Search term
- **Example:**
    
    `GET /api/clubs/search?query=chess`
    
- **Success Response:** `200 OK`
    
    ```json
    [
      {
        "_id": "606d1c8c6f8b2c3a90f1a9f5",
        "id": "chess-club",
        "name": "Chess Club",
        "description": "A club for chess enthusiasts.",
        "__v": 0
      }
    ]
    ```
    

### 5. Update a Club

- **Endpoint:** `PUT /api/clubs/:clubId`
- **Description:** Updates the details of an existing club (including changing its `id`, `name`, or `description`).
- **Request Parameters:**
    - `clubId` (URL param) — The current ID of the club you want to update.
- **Example:**
    
    `PUT /api/clubs/chess-club`
    
- **Request Body:**
    
    ```json
    {
      "id": "new-id-if-changing",          // optional: new ID to replace existing one
      "name": "Updated Club Name",         // optional
      "description": "Updated description" // optional
    }
    ```
    
- **Success Response:** `200 OK`
    
    ```json
    {
      "message": "Club updated successfully",
      "club": {
        "_id": "64ed14c233d2e...",
        "id": "new-id",
        "name": "Updated Club Name",
        "description": "Updated description",
        "__v": 0
      }
    }
    ```
    

### 6. Delete a Club

- **Endpoint:** `DELETE /api/clubs/:clubId`
- **Description:** Deletes a club by its unique `clubId`.
- **Request Parameters:**
    - `clubId` (URL param) — The unique identifier of the club to delete.
- **Success Response:** `200 OK`
    
    ```json
    {
      "message": "Club deleted successfully"
    }
    ```
    

### 7. Get All Donation History for a Specific Club

- **Endpoint:** `GET /api/clubs/:clubId/donations`
- **Description:** Retrieve donation history and stats for a specific club.
- **Path Parameters:**
    - `clubId` (string, required) — The ID of the club.
- **Example:**
    
    `GET /api/clubs/chess-club/donations`
    
- **Success Response:** `200 OK`
    
    ```json
    {
      "totalAmount": 150.00,
      "donationCount": 3,
      "donations": [
        {
          "_id": "...",
          "clubId": "chess-club",
          "donorFirstName": "Alice",
          "donorLastName": "Smith",
          "donorEmail": "alice@example.com",
          "amount": 50.00,
          "date": "2025-05-23T18:30:00.000Z",
          "paymentIntentId": "pi_...",
          "__v": 0
        },
        ...
      ]
    }
    ```
    

### 8. Create a Stripe Payment Intent

- **Endpoint:** `POST /api/clubs/:clubId/donate`
- **Description:** Create a Stripe payment intent to initiate a donation to a specific club.
- **Path Parameters:**
    - `clubId` (string, required) — The ID of the club.
- **Request Body:**
    
    ```json
    {
      "amount": 25.00,
      "donorFirstName": "John",
      "donorLastName": "Doe",
      "donorEmail": "john.doe@example.com"
    }
    ```
    
- **Example:**
    
    `POST /api/clubs/chess-club/donate`
    
- **Success Response:** `200 OK`
    
    ```json
    {
      "clientSecret": "pi_1234567890_secret_ABCDEF"
    }
    ```
    

## 📬 Stripe Webhook Documentation

## 🔧 Endpoint

`POST /webhook`

This endpoint receives **Stripe payment webhook events** to record successful donations.

---

## 📌 Purpose

To automatically capture and save successful donation payments made via Stripe into MongoDB database using the `Donation` model.

---

## 🧱 Middleware

- This endpoint uses raw body parsing via:
    
    ```jsx
    express.raw({ type: 'application/json' })
    ```
    
    This is **required** for Stripe signature verification.
    
- Do **not** use `express.json()` or body parsers globally for this endpoint.

---

## 🛡️ Security

### Signature Verification

Each incoming Stripe event is verified using:

- `stripe-signature` header.
- `process.env.STRIPE_WEBHOOK_SECRET`.

If verification fails, a `400 Webhook Error` is returned.

---

## 🔁 Supported Events

Currently, only:

- `payment_intent.succeeded`

---

## 📥 Request Example (from Stripe)

Headers:

```
POST /webhook HTTP/1.1
Content-Type: application/json
Stripe-Signature: t=timestamp,v1=signature,...
```

Raw Body:

```json
{
  "id": "evt_1ABC...",
  "object": "event",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_123456789",
      "amount": 5000,
      "metadata": {
        "clubId": "club-123",
        "donorFirstName": "Jane",
        "donorLastName": "Doe",
        "donorEmail": "jane@example.com"
      }
    }
  }
}
```

## 💾 What Happens on Success?

If the event type is `payment_intent.succeeded`, the backend:

1. Checks if a donation with the same `paymentIntentId` already exists.
2. If not found, it creates a new `Donation` document:
    
    ```json
    {
      "clubId": "club-123",
      "donorFirstName": "Jane",
      "donorLastName": "Doe",
      "donorEmail": "jane@example.com",
      "amount": 50.00,
      "date": "<current date>",
      "paymentIntentId": "pi_123456789"
    }
    ```
    
3. Saves it to MongoDB.

---

## ✅ Response

- On success:
    
    ```json
    { "received": true }
    ```
    

- On signature verification failure:
    
    ```
    400 Webhook Error: Signature verification failed
    ```

## Author
Developed by Suresh Shrestha — feel free to reach out at sureshshr91@gmail.com