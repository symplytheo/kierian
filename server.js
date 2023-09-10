const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`(c) ${new Date().getFullYear()} Kierian Technologies`);
});

app.listen(PORT, () => {
  console.log(`[SERVER]: Microservice listening on port:${PORT}`);
});
