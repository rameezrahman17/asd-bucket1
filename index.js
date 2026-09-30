const express = require("express");
const fs = require("fs/promises");

const app = express();
let productsCache;
const responseDelay = () => new Promise((resolve) => setTimeout(resolve, 1500));

async function getProducts() {
  if (productsCache) {
    return productsCache;
  }

  const data = await fs.readFile("db.json", "utf-8");
  productsCache = JSON.parse(data);
  return productsCache;
}

app.get("/products", async (req, res) => {
  try {
    await responseDelay();
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    await responseDelay();
    const id = Number(req.params.id);

    console.log("Requested ID:", id);

    const products = await getProducts();

    const product = products.find((product) => {
      return product.id === id;
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
