import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { google } from "googleapis";
import form from "./routes/form.route.js";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://application-form-1-y61q.onrender.com",
      "https://form.wijha-dz.com",
      "http://form.wijha-dz.com",
    ],
    credentials: true,
  }),
);

app.use(express.json());

export const auth = new google.auth.GoogleAuth({
  credentials: {
    type: "service_account",
    project_id: "applicationform-499410",
    private_key_id: "9866fb8ab2bea953de202995c0dce95c38adde40",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDNfrd1LOFs2w3t\n5s1iDcffbxaNK1jXuDBxBoqemR4NeIQS+M2l2zX1bc7ENQKpgg0X6k9KaiCaIhAE\ncVZgAUlMp7kbT7cmsum0ZoaDb0589+Z9OXQ45qfrsIdLrVeXWmD44vDQjtEnblDl\neMFX4G9EORAw+n4Fshf+zVG3njXYGH8180aRUl20DXdK5WNSHx3QhdB5KcBJZ7dv\n+Zkh+Jt1up9o3cGTq2y7xZM0VcE7uI2s0AL08xEMRIBuaEatTmmaIcqakxahdqz6\n8Byd/C2TUnsDtEG/p/2f6z+Xf/oCUFD9W1aiK3k6YAf/82tWwIb9DUQ45cimu9+a\nM3eYjloZAgMBAAECggEAFsDPnm1MPonYtn1GQ3OkLGS3+gSRLz2JO5KOWbY5giNU\neGdNGe62QEkaylXWSB+KxJmgkuxCVN6tqFhGSJYL4C14DQKcFHBd+Sga/8WcyrCG\nOFpauIwtjqa6rFHyr2MF9rjmEimmFfgcg/QFcG380/B/jvTFbGsGRiPExxCBBL6q\npuO2YrMY1GnC9BcKBuaiKBu9vrWioFxxuKbg+vF3J//K+gbuzq4QaRFQHnwo//mq\nw2GSsyCqbqRqN8P6VVGNReMqM+Ybg7fXZsjp4ibKneXVfFL5cr7yO0QVP7UJryMd\n85xcAItTbw7e+/wo5gOXgyFsIQyk/pPcc5xsYqAywQKBgQD6RABSK94EDtlQzjgP\nVW8btZzCkDalLh9AKOrgKCyGyLbZEm9zj/CGl7fLfSCCyQmBGftEdz/KaWh5xUq+\nJ3kU9NYR+q14q3gNMrDxhme/fZfOpJcoCRV8/DljYwk9wE4BHZ9h0yM+5abEWO5F\nZu9RzwV5ZQ4CpoMH6+S8AD+q8QKBgQDSNBn2ljFR0Cb+/2uVAgJLNjO6FueFyh80\nXjtqgSndn+kWVqVPYu8pRYaD1DJ+I5C8fTqFNX1QpPtJs5GPvpVL6pXbMgu0FjoQ\nh04e3aDbNoE+YnLsh/ACcKKnjxEr+re/T7csCnubkCzafdzGm4lloJUuI1n3znvx\nDBm1gfSRqQKBgFKFnb16rYiVBN96QE3+E9cFOZ2GRB6PaMqVM22akaQYBwLo60sl\nyV/4Iyi8J744YCPr10iqMaSiwUp13cF57pkUaoofKJhDoiBn+KSLdyZTWX1QFG+l\nHyrJWHsHKwLrqE0B4Y42OscAns7brCXCXWOSafGvesEw+r/f7tp3EodhAoGAc08v\neuyTK40jBzk4W+pZNccLAyczZFonWgPjVh56x9/D7oQjdPQRvDMugjyyYi3CZRPR\nOWfJUabfTmPaEt96aMXL5Q2EDAsxWQXQXfA4IGi652z8HDLJ/5yoLYC268hCagkh\ns2AgxIqHgGgQ50ZFTeGUVFYCMYUsymNX6xDaB9kCgYEAm/WjyYVlZdy+fe9+Rch4\nZjtSZ2g8mDI7BbArKO/XElTqNRCLt8CwqVh90HSPCa3QfPi3u+l1uNtaBPz1g8Zn\n+tXeO09OY5TGxvSgi4duhOxlYKw+J9DbKUpbwRcGEMFQpRnNuKoRPezCLRSO2ZnS\nI9aJktDjfO/XOq2iQ9JnfME=\n-----END PRIVATE KEY-----\n",
    client_email:
      "applicationform@applicationform-499410.iam.gserviceaccount.com",
    client_id: "114721736506231610924",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/applicationform%40applicationform-499410.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const sheets = google.sheets({
  version: "v4",
  auth,
});

console.log("Connected successfully");

app.use("/api/v1", form);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, message });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
