const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// Load env vars
dotenv.config({ path: './config/config.env' });

// connect db
connectDB();

// body parser
const app = express();
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// use cors
app.use(cors());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Route files
const campgrounds = require('./routes/campgrounds');
const bookings = require('./routes/bookings');
const auth = require('./routes/Auth');
const reviews = require('./routes/reviews');
const promotions = require('./routes/promotions');

app.use('/api/v1/campgrounds', campgrounds);
app.use('/api/v1/bookings', bookings);
app.use('/api/v1/auth', auth);
app.get('/', (req, res) => {
  res.status(200).json({ success: true, data: { id: 1 } });
});
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/campgrounds/:campgroundId/reviews', reviews);
app.use('/api/v1/promotions', promotions);

// Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'Campground Booking API'
    },
    servers: [
      {
        url: '/api/v1' // <-- No HOST here! Just relative
      }
    ]
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Handle unhandled promise rejections 
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

// ✨ IMPORTANT: Instead of app.listen(), just EXPORT app
module.exports = app;
