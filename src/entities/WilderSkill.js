// const EntitySchema = require("typeorm").EntitySchema;

// module.exports = new EntitySchema({
//   name: "WilderSkill",
//   columns: {
//     id: {
//       primary: true,
//       type: "int",
//       generated: true,
//     },
//     score: {
//       type: "int",
//     },
//   },
//   relations: {
//     wilder: {
//       target: "Wilder",
//       type: "many-to-one",
//       primary: true,
//       // joinTable: true,
//       eager: true,
//     },
//     skill: {
//       target: "Skill",
//       type: "many-to-one",
//       primary: true,
//       // joinTable: true,
//       eager: true,
//     },
//   },
// });
