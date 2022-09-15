// changer les require par des import
const express = require(`express`);
const datasource = require(`./utils`);
const cors = require(`cors`);

const wildersController = require(`./controllers/wilders`);
const skillsController = require(`./controllers/skills`);
const upvotesController = require(`./controllers/upvotes`);

const app = express();
app.use(cors());

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

// addSkill OU faire un UPDATE du wilder
app.post("/api/wilders/:wilderId/skills", wildersController.addSkill);

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
 * Upvote routes
 */

// create
app.post("/api/upvotes", asyncHandler(upvotesController.create));

// update - increase
app.put(
  "/api/upvotes/:upvoteId/increase",
  asyncHandler(upvotesController.increase)
);

/**
 * Start serverskillsController
 */
app.listen(5000, async () => {
  console.log("Server started on port:5000");
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
