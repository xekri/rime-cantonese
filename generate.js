const fs = require("fs");

const convert = syllable => {
  let [atone, tone] = syllable.match(/^([a-z]+)([1-6])$/).slice(1);
  tone = parseInt(tone)
  const voiced = 3 < tone;
  tone = (tone - 1) % 3;
  if (/[ktp]$/.test(atone))
    tone = 3;

  atone = atone
    .replace(/yu/, "y")
    .replace(/oe|eo/, "ơ")
    .replace(/a/g, "r")
    .replace(/rr/, "a")

    .replace(/^k/, "kx")
    .replace(/^g/, "k")
    .replace(/^c/, "tsx")
    .replace(/^z/, "ts")
    .replace(/^t/, "tx")
    .replace(/^d/, "t")
    .replace(/^p/, "px")
    .replace(/^b/, "p")
    .replace(/^h/, "x")
    .replace(/w/, "v")

    .replace(/ng/g, "g")
    .replace(/k$/g, "g")
    .replace(/t$/g, "n")
    .replace(/p$/g, "m")

    .replace(/(?<=[ueoơar])i/g, "j")
    .replace(/(?<=[ieoơar])u/g, "v")

    .replace(/j(?=[iyơ])/, "")
    .replace(/v(?=u)/, "")

    .replace(/ơn$/, "on")
    .replace(/(?<!dz|tsx?|s|j)ơj$/, "y")

    .replace(/(?<!dz|tsx?|s|j)ej$/, "i")
    ;

  if (voiced)
    atone = atone
      .replace(/^k/, "c")
      .replace(/^x/, "h")
      .replace(/^ts/, "dz")
      .replace(/^s/, "z")
      .replace(/^t/, "d")
      .replace(/^p/, "b")
      .replace(/^f/, "w")
  else
    atone = atone
      .replace(/^(?=[gnmljviuyeoơar])/, "q");

  return atone + tone;
}

convertAll = s =>
  s.replace(/[a-z]+[1-6]/g, convert);

const old = "jyut6ping3";
const neu = convertAll(old);

for (const suffix of ["", ".lettered", ".maps", ".phrase"]) {
  const pathOld = old + suffix + ".dict.yaml";
  const pathNew = neu + suffix + ".dict.yaml";

  const contentOld = fs.readFileSync(pathOld, "utf-8");
  fs.writeFileSync(pathNew, convertAll(contentOld));
}
