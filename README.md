# Wanderlust - Major Project 🌎✈️

**Wanderlust** is a full-stack web application designed for listing, discovering, and booking unique homestays and hotels worldwide, similar to Airbnb. It allows users to register accounts, upload and manage their listings (complete with image uploads and maps), write reviews, and search for rentals.

---

## 🚀 Features

- **User Authentication**: Secure user registration (signup), login, and logout functionalities implemented using `Passport.js` and `Passport-Local-Mongoose`.
- **Listing Management (CRUD)**:
  - **Create**: Add new listing descriptions, prices, location, country, and images.
  - **Read**: Explore all listed properties on the homepage, or view detailed specifications, location maps, and user reviews on the details page.
  - **Update**: Listing owners can edit property details.
  - **Delete**: Owner-only listing deletion.
- **Interactive Geocoding & Map Integration**: Built-in **Mapbox API** to auto-geocode listing addresses and display interactive pins on maps.
- **Image Storage & Uploads**: Handled via `Multer` and integrated with `Cloudinary` storage.
- **Reviews & Ratings System**: Logged-in users can write reviews and leave star ratings for any listings.
- **Robust Error Handling**: Customized error handling with a user-friendly error page.
- **Session & Flash Storage**: Local session storage utilizing MongoDB (`connect-mongo`) and flashing messages (success/error alerts) using `connect-flash`.

---

## 🛠️ Tech Stack

- **Frontend**: EJS (Embedded JavaScript Templates), Bootstrap 5, EJS-Mate layouts, Custom CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose ODM
- **Authentication**: Passport.js, Passport-local
- **APIs & Services**: Mapbox SDK (Geocoding), Cloudinary API (Image hosting)

---

## 📂 Project Structure

```text
MAJOR_PROJECT/
├── init/                  # Database initialization/seeding scripts (index.js, data.js)
├── models/                # MongoDB/Mongoose Models (User, Listing, Review)
├── publlic/               # Static assets (stylesheets, JS scripts, images)
├── views/                 # EJS views (Layouts, Listings, Users, Errors)
├── app.js                 # Main server/app logic
├── middleware.js          # Authentication and redirection middleware
├── cloudconfig.js         # Cloudinary storage configuration
├── schema.js              # Joi validation schemas
├── package.json           # Node dependencies and scripts
└── .env                   # Environment variables (Ignored in Git)
```

---

## ⚙️ Installation & Setup

To run Wanderlust locally on your machine, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/HarshitMangal/major_project.git
cd major_project
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add the following keys with your own API credentials:
```env
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAP_TOKEN=your_mapbox_access_token
ATLAS_DB_URL=your_mongodb_atlas_connection_string
SECRET=your_session_secret
```

### 4. Initialize Database Seed Data (Optional)
If you want to seed the database with sample listings, run:
```bash
node init/index.js
```

### 5. Start the application
```bash
npm start
```
The server will start on port `7560`. Visit `http://localhost:7560` in your web browser.

---

## 📄 License
This project is open-source and licensed under the [ISC License](LICENSE).
