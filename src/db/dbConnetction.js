import mongoose from "mongoose";

async function dbConnection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
    console.log("databaseb is connected");
    } catch (error) {
        console.log("database connection failed");
        
        console.log(error.message);
          process.exit(1);
    }
    
    
}

export default dbConnection;