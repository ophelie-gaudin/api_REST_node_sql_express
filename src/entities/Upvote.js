const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Upvote",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    counter: {
      type: "int",
      default: 0,
    },
  },
  relations: {
    wilder: {
      target: "Wilder",
      type: "many-to-one",
      inverseSide: "upvotes",
    },
    skill: {
      target: "Skill",
      type: "many-to-one",
      inverseSide: "upvotes",
    },
  },
});
