import mongoose from "mongoose";

interface DBConnection {
  isConnected?: number;
  connectionHost?: string;
}

const connection: DBConnection = {};

export async function connectDB(): Promise<void> {
  if (connection.isConnected) {
    console.log("Database Already Connnected");
    return;
  }
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DB_URL}/${process.env.DB_NAME}`
    );
    connection.isConnected = connectionInstance.connections[0].readyState;
    connection.connectionHost = connectionInstance.connections[0].host;
    console.log("☘️ Database Connected Successfully !!");
  } catch (error: any) {
    console.log("❌ Error Connecting Database : ", error);
    process.exit(1);
  }
}
