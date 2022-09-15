/**
 * VERSION WITH MAKER CONTROLLER
 */

// const datasource = require("../utils");

// const repository = datasource.getRepository("Skill");

// module.exports = makeController({ entityName: "skill" });

const datasource = require("../utils");

const repository = datasource.getRepository("Upvote");

module.exports = {
  create: async (req, res) => {
    const existingUpvote = await repository.findOne({
      where: {
        skill: { id: req.body.skillId },
        wilder: { id: req.body.wilderId },
      },
    });

    // Check if relationship already exists

    if (existingUpvote) {
      res.json(existingUpvote);
    } else {
      const upvote = await repository.save({
        //upvote: 0,
        wilder: { id: req.body.wilderId },
        skill: { id: req.body.skillId },
      });
      res.json(upvote);
    }
  },

  increase: async (req, res) => {
    const existingUpvote = await repository.findOne({
      where: {
        skill: { id: req.body.skillId },
        wilder: { id: req.body.wilderId },
      },
    });

    if (existingUpvote) {
      existingUpvote.upvote = existingUpvote.upvote + 1;

      await repository.save(existingUpvote);
    } else {
      // create an error

      throw new Error("This Upvote doesn't exist ! ");
    }
  },
};
