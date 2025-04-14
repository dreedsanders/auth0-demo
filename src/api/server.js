const express = require("express");
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");
const port = 4000;
const axios = require("axios");

const app = express();
app.use(cors());

// Create middleware
const verifyJwt = auth({
  audience: "this is my identifier(unique)",
  issuerBaseURL: "https://dev-ieatf506s3q1ikgq.us.auth0.com/",
  tokenSigningAlg: "RS256"
});


// one way to define which routes get protected is by using this statement. Another way is including the 'unless' add on with the
// 'auth' function
app.use('/protected',verifyJwt);

// Routes
app.get("/", (req, res) => {
  res.send("Hello World from index route");
});

app.get("/protected", async (req, res) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    console.log(accessToken);
    const response = await axios.get(
      "https://dev-ieatf506s3q1ikgq.us.auth0.com/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
    });
    const userInfo = response.data
      console.log(userInfo);
      res.status(200).send(userInfo);
  } catch (error) {
    console.log(error)
  }
});

// Error handling
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).send({ error: "Invalid token", message: err.message });
  } else {
    next(err);
  }
});

app.listen(port, (err) => {
  if (err) console.error(err);
  console.log(`Server listening on PORT ${port}`);
});
