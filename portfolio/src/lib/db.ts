import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Simplified caching for cross-bundler compatibility
const globalAny: any = global;

if (!globalAny._mongoose) {
  globalAny._mongoose = { conn: null, promise: null };
}
const cached = globalAny._mongoose;

export async function dbConnect(uri?: string) {
  const connectionUri = uri || MONGODB_URI;
  
  if (!connectionUri) {
    throw new Error(
      'Please define the MONGODB_URI environment variable or pass a valid connection string'
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(connectionUri, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
