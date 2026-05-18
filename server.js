import "dotenv/config";

import app from "./src/app.js";
import dbConnection from "./src/db/dbConnetction.js";

const PORT = process.env.PORT;

dbConnection();

app.listen(PORT, () => {
  console.log(
  `server running on port ${PORT}`
);
});