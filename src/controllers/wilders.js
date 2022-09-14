const datasource = require("../utils");

const repository = datasource.getRepository("Wilder");

module.exports = {
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
      .query("INSERT INTO wilder(name) VALUES (?)", [req.body.name])
      .then(
        (id) => {
          repository
            .query("SELECT * FROM wilder WHERE id=?", [id])
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
    const wilderId = req.params.wilderId;

    repository.findOneBy({ id: wilderId }).then(
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

    const wilderId = req.params.wilderId;

    repository.findOneBy({ id: wilderId }).then(
      (wilder) => {
        // Object.assign permet de modifier un objet existant
        // on aurait aussi pu faire : wilder.name = req.body.name;
        Object.assign(wilder, req.body);

        repository.save(wilder).then((updatedWilder) => {
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

    const wilderId = req.params.wilderId;

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
    repository.findOneBy({ id: wilderId }).then(
      (wilder) => {
        repository.remove(wilder).then(
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
