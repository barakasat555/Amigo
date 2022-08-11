import express from "express";
import Dotenv from "dotenv";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import path from "path";
const __dirname = path.resolve();

console.log(__dirname);
Dotenv.config();

const router = express.Router();

router.use(swaggerUi.serve);

const EditHtml = (Html, ID) => {
  return Html?.replace?.(
    `<script src="./swagger-ui-init.js"> </script>`,
    `<script src="./swagger-ui-init.js"> </script>
  <script src="https://kjur.github.io/jsrsasign/jsrsasign-all-min.js"></script>
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
  <script type="text/javascript">const ConfigUrl = "/documentation/data/${ID}"; const ConfigSecret = "${process.env.ClientJWT_SECRET}";</script>`
  );
};

var options = {
  customJs: "/documentation/custom.js",
};

const swaggerFileIR = JSON.parse(
  fs.readFileSync(`${__dirname}/SwaggerRoute/defs/IR.json`, "utf8")
);

router.get("/data/IR", (req, res) => res.json(swaggerFileIR));
let swaggerHtmlIR = EditHtml(swaggerUi.generateHTML(swaggerFileIR, options), "IR");
router.get("/IR", swaggerUi.serveFiles(swaggerFileIR), (req, res) => {
  if (req?.query?.secret != "IRsapoijehrugwie12") return res.sendStatus(404);
  res.send(swaggerHtmlIR);
});

router.get("/custom.js", (req, res) => {
  //serve js file from "./Swagger/custom.js"
  console.log(`${__dirname}/SwaggerRoute/js/custom.js`);
  res.sendFile(`${__dirname}/SwaggerRoute/js/custom.js`);
});

export default router;
