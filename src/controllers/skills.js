/**
 * VERSION WITH MAKER CONTROLLER
 */

// const datasource = require("../utils");

// const repository = datasource.getRepository("Skill");

// module.exports = makeController({ entityName: "skill" });

const datasource = require("../utils");

const repository = datasource.getRepository("Skill");

module.exports = {
  create: (req, res) => {
    repository
      .query("INSERT INTO skill(name) VALUES (?)", [req.body.name])
      .then(
        (id) => {
          repository
            .query("SELECT * FROM skill WHERE id=?", [id])
            .then((data) => {
              console.log("Skill created");
              res.json(data[0]);
            });
        },
        (err) => {
          console.error("CREATE Error:", err);
          res.json({ success: false });
        }
      );
  },

  findAll: (req, res) => {
    repository.find().then((data) => {
      res.json(data);
    });
  },

  find: (req, res) => {
    const skillId = req.params.skillId;

    repository.findOneBy({ id: skillId }).then(
      (data) => {
        res.json(data);
      },
      (err) => {
        console.error("FIND Error :", err);
        res.json({ success: false });
      }
    );
  },

  update: (req, res) => {
    const skillId = req.params.skillId;

    repository.findOneBy({ id: skillId }).then(
      (skill) => {
        // Object.assign permet de modifier un objet existant
        // on aurait aussi pu faire : skill.name = req.body.name;
        Object.assign(skill, req.body);

        repository.save(skill).then((updatedSkill) => {
          res.json(updatedSkill);
        });
      },
      (err) => {
        console.error("UPDATE: Error when saving:", err);
        res.json({ success: false });
      }
    ),
      (err) => {
        console.error("UPDATE Error when finding:", err);
        res.json({ success: false });
      };
  },

  delete: (req, res) => {
    const skillId = req.params.skillId;

    repository.findOneBy({ id: skillId }).then(
      (skill) => {
        repository.remove(skill).then(
          () => {
            res.json({ success: true });
          },
          (err) => {
            console.error("DELETE Error:", err);
            res.json({ success: false });
          }
        );
      },
      (err) => {
        console.error("DELETE Error when finding", err);
        res.json({ success: false });
      }
    );
  },
};
