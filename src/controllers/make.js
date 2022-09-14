const datasource = require("../utils");

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
  makeController({ entityName }) {
    const repository = datasource.getRepository(
      capitalizeFirstLetter(entityName)
    );
    const controller = {
      create: (req, res) => {
        // //* 1st METHOD : lancer les requêtes via TypeORM
        // repository.save(req.body).then(
        //   (data) => {
        //     console.log("Wilder created");
        //     res.json(data, { message: "Wilder created" });
        //   },
        //   (err) => {
        //     console.error("CREATE Error:", err);
        //     res.json({ success: false });
        //   }
        // );

        //* 2nd METHOD : lancer les requêtes directement via SQL
        repository
          .query(`INSERT INTO ${entityName}(name) VALUES (?)`, [req.body.name])
          .then(
            (id) => {
              repository
                .query(`SELECT * FROM ${entityName} WHERE id=?`, [id])
                .then((data) => {
                  console.log("Wilder created");
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
        //* 3 METHODS :
        //* req.body --> body request
        //* req.params --> url : /api/wilders/:wilderId
        //* req.query --> url but depends of demand of users (not predictable) : /api/wilders?wilderId=...

        //* METHOD by req.params
        repository.findOneBy({ id: req.params.id }).then(
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
        //* 2 METHODS :
        //* request by raw SQL --> "UPDATE... FROM ..."
        //* TypeORM: find + save

        repository.findOneBy({ id: req.params.id }).then(
          (entity) => {
            // Object.assign permet de modifier un objet existant
            // on aurait aussi pu faire : entity.name = req.body.name;
            Object.assign(entity, req.body);

            repository.save(entity).then((updatedWilder) => {
              res.json(updatedWilder);
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
        //* 2 METHODS :
        //* request by raw SQL --> "UPDATE... FROM ..."
        //* TypeORM: find + save

        // //* 1st METHOD with SQL

        // repository.query("DELETE FROM wilder WHERE id=?", [wilderId]).then(
        //   () => {
        //     res.json({ success: true });
        //   },
        //   (err) => {
        //     console.error("DELETE Error: ", err);
        //     res.json({ success: false });
        //   }
        // );

        //* 2nd METHOD with TypeORM
        repository.findOneBy({ id: req.params.id }).then(
          (entity) => {
            repository.remove(entity).then(
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

    return controller;
  },
};
