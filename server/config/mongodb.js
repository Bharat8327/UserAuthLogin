import mongoose from 'mongoose';

const db = async () => {
  const mongoUrl = process.env.MONGOOES_URL;

  try {
    const connect = await mongoose.connect(mongoUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log('MongoDb Connected', connect.connection.host);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default db;
