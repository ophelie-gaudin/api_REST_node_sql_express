const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Skill",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "text",
      unique: true,
    },
  },
  relations: {
    upvotes: {
      target: "Upvote",
      type: "one-to-many",
      inverseSide: "skill",
    },
  },
});
