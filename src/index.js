// changer les require par des import
const express = require(`express`);
const datasource = require(`./utils`);

const wildersController = require(`./controllers/wilders`);
const skillsController = require(`./controllers/skills`);

const app = express();

const asyncHandler = (controller) => {
  return async (req, res) => {
    console.log("I'm executing a controller by asyncHandler !");

    try {
      await controller(req, res);
    } catch (err) {
      console.error("Error :", err);
      res.json({ success: false });
    }
  };
};

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
app.get("/api/wilders/:wilderId", asyncHandler(wildersController.find));

// update
app.put("/api/wilders/:wilderId", asyncHandler(wildersController.update));

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

/**
 * JoinTable routes Wilder - Skill (many to many)
 */

app.post("/api/wilders/:wilderId/skills/:skillId", wildersController.addSkill);

app.get("/api/wilders/:wilderId/skills/", wildersController.findAllSkills);

app.delete(
  "/api/wilders/:wilderId/skills/:skillId",
  wildersController.deleteSkill
);

// Start server
app.listen(4000, async () => {
  console.log("Server started on port:4000");
  await datasource.initialize();
  console.log("I'm connected ! ");
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
