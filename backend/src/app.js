const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const env = require('./config/env');
const { errorHandler } = require('./middlewares/error');
const postRoutes = require('./routes/post.routes');
const ApiError = require('./utils/ApiError');

const app = express();

// Trust Render/Railway reverse proxy (required for rate-limiter & correct IP detection)
app.set('trust proxy', 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: true,
  credentials: true
};
app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  message: { code: 429, message: 'Too many requests, please try again later.' }
});

const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', apiLimiter);

app.get('/api', (req, res) => {
  res.status(200).json({ 
    message: 'NexPost API is running successfully. Please visit /api-docs for documentation.' 
  });
});

app.use('/api/posts', postRoutes);

app.use((req, res, next) => {
  next(new ApiError(404, 'Not found'));
});

app.use(errorHandler);

module.exports = app;
