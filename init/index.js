const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listning.js");
const User = require("../models/user.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const dbUrl = process.env.ATLAS_DB_URL || 'mongodb://127.0.0.1:27017/Wanderlast';

async function main() {
    console.log(`Connecting to DB at: ${dbUrl.replace(/:([^:@]+)@/, ":****@")}...`);
    try {
        await mongoose.connect(dbUrl);
        console.log("DB connected successfully!");

        // Delete old listings
        console.log("Cleaning old listings...");
        await Listing.deleteMany({});
        console.log("Old listings cleared.");

        // Find or create a default owner/admin user
        let user = await User.findOne({ username: "admin" });
        if (!user) {
            console.log("Creating default 'admin' user...");
            user = new User({ username: "admin", email: "admin@gmail.com" });
            user = await User.register(user, "admin123");
            console.log("Default admin user created!");
        }

        console.log("Geocoding listings location coordinates via Mapbox API...");
        const dataWithOwner = [];
        
        for (let i = 0; i < initData.data.length; i++) {
            const item = initData.data[i];
            console.log(`[${i + 1}/${initData.data.length}] Geocoding: ${item.location}, ${item.country}`);
            
            let geometry = { type: "Point", coordinates: [77.209, 28.613] }; // default
            
            if (mapToken) {
                try {
                    const response = await geocodingClient.forwardGeocode({
                        query: `${item.location}, ${item.country}`,
                        limit: 1
                    }).send();
                    
                    if (response && response.body && response.body.features && response.body.features.length > 0) {
                        geometry = response.body.features[0].geometry;
                    }
                } catch (geocodeErr) {
                    console.log(`   ⚠️ Failed to geocode ${item.location}, using default coordinates.`);
                }
            } else {
                console.log("   ⚠️ No MapToken found, using default coordinates.");
            }
            
            dataWithOwner.push({
                ...item,
                owner: user._id,
                geometry: geometry
            });
            
            // Add a minor delay between geocoding requests to prevent Mapbox rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log("Inserting new listings into the database...");
        await Listing.insertMany(dataWithOwner);
        console.log("Database initialized with mock Airbnb hotel/villa listings successfully!");

        mongoose.connection.close();
        console.log("DB connection closed.");
    } catch (err) {
        console.log("Error during database seeding:", err);
    }
}

main();