import { CandidatModel } from "../../../../models";

export default (_, __, { user: { _id } }) =>
  CandidatModel.find({}).then((candidates) => {
    let Homme = 0;
    let Femme = 0;
    let unspecifiedGender = 0;
    let one = 0; //18-24
    let two = 0; //25-29
    let three = 0; // 30-34
    let four = 0; // 35-39
    let five = 0; // +40
    let six = 0; //

    let Eone = 0; //BAC+1
    let Etwo = 0; //BAC+2
    let Ethree = 0; // BAC+3
    let Efour = 0; // BAC+4
    let Efive = 0; // BAC+5
    let Esix = 0; // > BAC+5
    let total;
    (candidates as any).map((candidate) => {
      if (candidate.sexe == "Homme") Homme = Homme + 1;
      else if (candidate.sexe == "Femme") Femme = Femme + 1;
      else unspecifiedGender = unspecifiedGender + 1;
      //age stats
      if (parseInt(candidate.age) >= 18 && parseInt(candidate.age) <= 24)
        one = one + 1;
      else if (parseInt(candidate.age) >= 25 && parseInt(candidate.age) <= 29)
        two = two + 1;
      else if (parseInt(candidate.age) >= 30 && parseInt(candidate.age) <= 34)
        three = three + 1;
      else if (parseInt(candidate.age) >= 35 && parseInt(candidate.age) <= 39)
        four = four + 1;
      else if (parseInt(candidate.age) >= 40) five = five + 1;
      else six = six + 1;

      if (candidate.etude == "ONE") Eone = Eone + 1;
      else if (candidate.etude == "TWO") Etwo = Etwo + 1;
      else if (candidate.etude == "THREE") Ethree = Ethree + 1;
      else if (candidate.etude == "FOUR") Efour = Efour + 1;
      else if (candidate.etude == "FIVE") Efive = Efive + 1;
      else if (candidate.etude == "MORE_THAN_FIVE") Esix = Esix + 1;
      total = Eone + Etwo + Ethree + Efive + Esix;
    });
    return [
      Homme,
      Femme,
      unspecifiedGender,
      one,
      two,
      three,
      four,
      five,
      six,
      Eone,
      Etwo,
      Ethree,
      Efour,
      Efive,
      Esix,
      total,
    ];
  });
