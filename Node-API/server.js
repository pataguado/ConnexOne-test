const express = require('express');
const Prometheus = require('express-prometheus-middleware');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors());

// Middleware for Prometheus metrics
app.use(Prometheus({ collectDefaultMetrics: true }));

// Middleware to check for authorization header
const checkAuthorization = (req, res, next) => {
  const token = req.headers.authorization;

  if (token === 'mysecrettoken') {
    next();
  } else {
    console.log('403 here')
    res.sendStatus(403);
  }
};

// Endpoint to get current server time
app.get('/time', checkAuthorization, (req, res) => {
  const epoch = Math.floor(Date.now() / 1000); // Get current time in epoch seconds

  res.json({ epoch });
});

// Endpoint to get metrics
app.get('/metrics', checkAuthorization, (req, res) => {
  res.send(Prometheus.metrics());
});


// Start the server
app.listen(5000, () => {
  console.log('API server is running on http://localhost:5000');
});
