import express from "express";
import cors from "cors";
import routes from "./routes.js";

const app = express();

// Middleware
app.use(cors()); // <-- tambahkan ini
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

export default app;
