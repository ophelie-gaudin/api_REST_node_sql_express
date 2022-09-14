// changer les require par des import
const express = require(`express`);
const datasource = require(`./utils`);

const wildersController = require(`./controllers/wilders`);
const skillsController = require(`./controllers/skills`);

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Request url:", req.url);
  res.send("Hello 6th crew ! :-D");
});

/**
 * Wilder routes
 */

// create
app.post("/api/wilders", wildersController.create);

// find all
app.get("/api/wilders", wildersController.findAll);

// find
app.get("/api/wilders/:wilderId", wildersController.find);

// update
app.put("/api/wilders/:wilderId", wildersController.update);

// delete
app.delete("/api/wilders/:wilderId", wildersController.delete);

/**
 * Skill routes
 */

// create
app.post("/api/skills", skillsController.create);

// find all
app.get("/api/skills", skillsController.findAll);

// find
app.get("/api/skills/:skillId", skillsController.find);

// update
app.put("/api/skills/:skillId", skillsController.update);

// delete
app.delete("/api/skills/:skillId", skillsController.delete);

// Start server
app.listen(3000, () => {
  console.log("Server started on port:3000");

  datasource.initialize().then(() => {
    console.log("I'm connected ! ");
  });
});

// makeCrud({ entitySchema: {
//   name: "Skill",
//   columns: {
//     id: {
//       primary: true,
//       type: "int",
//       generated: true,
//     },
//     name: {
//       type: "text",
//     },
//   },
// } })
