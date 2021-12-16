const fs = require("fs");
const path = require("path");

const products = require("../data/productsDataBase_db");

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

let guardar = () => {
  fs.writeFileSync(
    path.join(__dirname, "..", "data/productsDataBase.json"),
    JSON.stringify(products, null, 2),
    "utf-8"
  );
};

const controller = {
  // Root - Show all products
  index: (req, res) => {
    return res.render("products", {
      products,
      toThousand,
    });
  },

  // Detail - Detail from one product
  detail: (req, res) => {
    let id = req.params.id;
    return res.render("detail", {
      //a la variable product
      product: products.find((product) => product.id === +id),
      toThousand,
    });
  },

  // Create - Form to create
  create: (req, res) => {
    return res.render("product-create-form");
  },

  // Create -  Method to store
  store: (req, res) => {
    console.log(req.file);
    if (req.file) {
      //Se crea un objeto literal basado en las propeidades del JSON_db y el valor será tomado de lo que llegue del formulario req.body.name
      let product = {
        //   del array products entramos a la ultima posicion del array con length
        id: products[products.length - 1].id + 1,
        name: req.body.name,
        price: req.body.price,
        discount: req.body.discount,
        category: req.body.category,
        description: req.body.description,
        image: req.file ? req.file.filename : "default-image.png",
      };
      //Se pusheará el objeto literal al JSON_db como un objeto literal normal de JavaScript
      products.push(product);
      //En la función guardar se ejecuta  el modulo fs con su metodo writeFileSync y JSON.stringify lo que guardará la variable y la stringificara para que pueda ser una lectura mas eficiente hacía otros lenguajes
      guardar();
      //Al terminar la ejecución que creá el producto se redicrecciona al usuarío hacia el home.
      res.redirect("/");
    } else {
      res.render("product-create-form");
    }
  },

  // Update - Form to edit
  edit: (req, res) => {
    let id = req.params.id;
    return res.render("product-edit-form", {
      product: products.find((product) => product.id === +id),
    });
  },
  // Update - Method to update
  update: (req, res) => {
    const { name, price, discount, category, description } = req.body;
    //Se recorre el array products y se mete a cada producto y verificará si algun id de un producto coincide con el id pasado por parametro en la URL  y si coincide reemplazará los valores de cada propiedad que lleguen del formulario que haya llenado el usuario
    products.forEach((product) => {
      if (product.id === +req.params.id) {
        product.id = +req.params.id;
        product.name = name;
        product.price = +price;
        product.discount = +discount;
        product.category = category;
        product.description = description;
      }
    });
    //En la función guardar se ejecuta  el modulo fs con su metodo writeFileSync y JSON.stringify lo que guardará la variable y la stringificara para que pueda ser una lectura mas eficiente hacía otros lenguajes
    guardar();

    //Al terminar la ejecución que creá el producto se redicrecciona al usuarío hacia el home.
    res.redirect("/products/detail/" + req.params.id);
  },

  // Delete - Delete one product from DB
  destroy: (req, res) => {
    let id = req.params.id;
    //creamos un loop en el que nuestra variable iteradora es igual a 0 y mientras el iterador sea menor a la longitud del array se le sumara 1.
    for (let i = 0; i < products.length; i++) {
      if (products[i].id == id) {
        //en products en la posicion i entramos al id (products=>product.id) y si matchea con el id pasado por parametro en la url se ejecutará el splice

        products.splice(i, 1);
        //al utilizar el metodo splice sobre products indicamos que queremos que "corte" desde donde i está parado y cuantos elementos del array queremos que elimine, en este caso queremos que solo "corte" uno
      }
    }
    //En la función guardar se ejecuta  el modulo fs con su metodo writeFileSync y JSON.stringify lo que guardará la variable y la stringificara para que pueda ser una lectura mas eficiente hacía otros lenguajes
    guardar();

    //Al terminar la ejecución que creá el producto se redicrecciona al usuarío hacia el home.
    res.redirect("/");
  },
};

module.exports = controller;
