const datasource = require("../utils");

const repository = datasource.getRepository("Wilder");

const skillRepository = datasource.getRepository("Skill");

const upvoteRepository = datasource.getRepository("Upvote");

module.exports = {
  create: async (req, res) => {
    // //* 1st METHOD : lancer les requêtes via TypeORM

    try {
      const data = await repository.save(req.body);

      console.log("Wilder created");
      res.json(data);
    } catch (err) {
      console.error("CREATE Error:", err);
      res.json({ success: false });
    }

    //* 2nd METHOD : lancer les requêtes directement via SQL
    // try {
    //   const wilderId = await repository.query(
    //     "INSERT INTO wilder(name) VALUES (?)",
    //     [req.body.name]
    //   );

    //   try {
    //     const data = await repository.query("SELECT * FROM wilder WHERE id=?", [
    //       wilderId,
    //     ]);
    //     console.log("Wilder created");
    //     res.json(data[0]);
    //   } catch (err) {
    //     console.error("CREATE Error for showing:", err);
    //   }
    // } catch (err) {
    //   console.error("CREATE Error:", err);
    //   res.json({ success: false });
    // }
  },

  findAll: async (req, res) => {
    try {
      const wilders = await repository.find();
      res.json(wilders);
    } catch (err) {
      console.error("FINDALL Error :", err);
      res.json({ success: false });
    }
  },

  find: async (req, res) => {
    //* 3 METHODS :
    //* req.body --> body request
    //* req.params --> url : /api/wilders/:wilderId
    //* req.query --> url but depends of demand of users (not predictable) : /api/wilders?wilderId=...

    //* METHOD by req.params

    try {
      const wilderId = req.params.wilderId;
      const wilder = await repository.findOneBy({ id: wilderId });
      res.json(wilder);
    } catch (err) {
      console.error("FIND Error :", err);
      res.json({ success: false });
    }
  },

  update: async (req, res) => {
    //* 2 METHODS :
    //* request by raw SQL --> "UPDATE... FROM ..."
    //* TypeORM: find + save

    const wilderId = req.params.wilderId;

    const wilder = await repository.findOneBy({ id: wilderId });

    // Object.assign permet de modifier un objet existant
    // on aurait aussi pu faire : wilder.name = req.body.name;
    Object.assign(wilder, req.body);

    try {
      const updatedWilder = await repository.save(wilder);

      res.json(updatedWilder);
    } catch (err) {
      console.error("UPDATE: Error when saving:", err);
      res.json({ success: false });
    }
  },

  delete: async (req, res) => {
    //* 2 METHODS :
    //* request by raw SQL --> "UPDATE... FROM ..."
    //* TypeORM: find + save

    const wilderId = req.params.wilderId;

    // //* 1st METHOD with SQL

    // try {
    //   await repository.query("DELETE FROM wilder WHERE id=?", [wilderId]);
    //   res.json({ success: true });
    // } catch (err) {
    //   console.error("DELETE Error", err);
    //   res.json({ success: false });
    // }

    //* 2nd METHOD with TypeORM
    try {
      const wilder = await repository.findOneBy({ id: wilderId });

      try {
        await repository.remove(wilder);
        res.json({ success: true });
      } catch (err) {
        console.error("DELETE Error:", err);
        res.json({ success: false });
      }
    } catch (err) {
      console.error("DELETE Error when finding", err);
      res.json({ success: false });
    }
  },

  addSkill: async (req, res) => {
    try {
      // ne fonctionne plus depuis qu'on a créé la table de jointure upvote
      // const wilderToUpdate = await repository.findOne({
      //   where: { id: req.params.wilderId },
      //   relations: ["skills"],
      // });
      // console.log("Wilder to update : ", wilderToUpdate);

      // const skillToAdd = await skillRepository.findOneBy({
      //   id: req.body.skillId,
      // });
      // console.log("Skill to add :", skillToAdd);

      // wilderToUpdate.skills = [...wilderToUpdate.skills, skillToAdd];
      // //wilderToUpdate.skills.push(skillToAdd)

      // await repository.save(wilderToUpdate);

      // res.send("Skill added to wilder");

      const newUpvote = await upvoteRepository.save({
        wilder: Number(req.params.wilderId),
        skill: req.body.skillId,
      });

      res.json(newUpvote);
    } catch (err) {
      console.log(err);
      res.send("Error while adding skill to wilder");
    }
  },

  findAllSkills: async (req, res) => {
    try {
      const wilderToGiveDetails = await repository.findOneBy({
        id: req.params.wilderId,
      });
      console.log("Wilder's skills :", wilderToGiveDetails.skills);
      res.json(wilderToGiveDetails.skills);
    } catch (err) {
      console.log(err);
      res.send("Error while seeing wilder's skills");
    }
  },

  deleteSkill: async (req, res) => {
    try {
      const wilderToDeleteSkill = await repository.findOneBy({
        id: req.params.wilderId,
      });
      console.log("Wilder to delete a skill: ", wilderToDeleteSkill);

      const skillToDelete = await skillRepository.findOneBy({
        id: req.params.skillId,
      });
      console.log("Skill to delete", skillToDelete);

      const wilderSkills = wilderToDeleteSkill.skills;
      console.log("Wilder's skills :", wilderSkills);

      try {
      } catch (err) {
        console.error("DELETE Error:", err);
        res.json({ success: false });
      }
      await wilderSkills.remove(skillToDelete);
      console.log("Wilder without deleted skill", wilderToDeleteSkill.skills);
      res.json({ success: true });
    } catch (err) {
      console.log(err);
      res.send("Error while deleting wilder's skills");
    }
  },
};
