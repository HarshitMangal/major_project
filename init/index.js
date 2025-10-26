require("dotenv").config({ path: "../.env" });  // load env vars
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listning.js");

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlast');
       // await mongoose.connect(process.env.ATLAS_DB_URL);

        //  await mongoose.connect(process.env.ATLAS_DB_URL);
        console.log("DB connected");

        // Delete old data
        await Listing.deleteMany({});
        console.log("Old listings deleted");

        // Prepare data with owner
      const dataWithOwner = initData.data.map(obj => ({
    ...obj,
    owner: new mongoose.Types.ObjectId("64a7f3f4c1a5f2b4d6e4c8a1")
}));

        // Insert new data
        await Listing.insertMany(dataWithOwner);
        console.log("Data was initialized");

        mongoose.connection.close(); // close connection
    } catch (err) {
        console.log("Error:", err);
    }
}

main();