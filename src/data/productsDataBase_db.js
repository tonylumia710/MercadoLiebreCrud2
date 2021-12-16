const fs=require("fs");
const path=require("path");


//vuelve a releer la base de datos 
const products = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../data/productsDataBase.json"),
    "utf-8"
  )
);

module.exports = products;
