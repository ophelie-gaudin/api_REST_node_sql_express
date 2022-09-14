const typeorm = require("typeorm");

const datasource = new typeorm.DataSource({
  type: "sqlite",
  database: "./wilders.db",
  synchronize: true,
  entities: [require("./entities/Wilder"), require("./entities/Skill")],
  logging: ["query", "error"],
});

module.exports = datasource;
