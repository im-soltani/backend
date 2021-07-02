import { ActualiteModel } from "../../../../models";

export default (
  _,
  { id, input },
  { user: { _id } }
) =>
  ActualiteModel.findById(id).then(actualite => {
    if (!actualite) return null;
    return new Promise(async (resolve, reject) => {
      (actualite as any).title = input.title;
      (actualite as any).description = input.description;
      (actualite as any).lien = input.lien;
      (actualite as any).startPublication = input.startPublication;
      (actualite as any).ent_type = input.ent_type;
      (actualite as any).entreprise_id = input.entreprise_id;
      (actualite as any).endPublication = input.endPublication;
      (actualite as any).eventDate = input.eventDate;
      (actualite as any).visibleToAdherent = input.visibleToAdherent;
      (actualite as any).visibleToCandidat = input.visibleToCandidat;
      actualite
        .save()
        .then(() => {
          ActualiteModel.findById(id)
            .then(actualities => {
              ActualiteModel.createMapping(function (err, mapping) {
                if (err) {
                  console.log(
                    "error creating mapping (you can safely ignore this)"
                  );
                  console.log(err);
                } else {
                  console.log("mapping created!");

                  var stream = ActualiteModel.synchronize();
                  var count = 0;

                  stream.on("data", function (err, doc) {
                    count++;
                  });
                  stream.on("close", function () {
                    console.log(
                      "[ElasticSearch] Indexed " + count + " " + " documents!"
                    );
                  });
                  stream.on("error", function (err) {
                    console.log("mongoosastic ERROR");
                    console.log(err);
                  });
                }
              });
              resolve(actualities);
            })
            .catch(err => reject(err));
        })

        .catch(err => reject(err));
    });
  });