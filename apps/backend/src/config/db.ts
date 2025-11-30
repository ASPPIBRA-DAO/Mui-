import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async (uri: string) => {
  if (isConnected) {
    return;
  }

  try {
    if (!uri) throw new Error("MONGO_URI não definida no Wrangler/Environment");

    // Workers requerem buffering desligado ou conexões serverless específicas,
    // mas com nodejs_compat e conexões recentes, o padrão costuma funcionar.
    await mongoose.connect(uri);
    
    isConnected = true;
    console.log("🍃 MongoDB Conectado no Edge");
  } catch (error) {
    console.error("❌ Erro Mongo Edge:", error);
    throw error;
  }
};
