export default {
  mongoUrl:
    process.env.MONGO_URL ||
    'mongodb+srv://mongodb:mongodb123@sandbox.hrm79pu.mongodb.net/?retryWrites=true&w=majority',
  port: process.env.PORT || 3333,
  jwtSecret: process.env.JWT_SECRET || 'A@lt10_$14',
};
