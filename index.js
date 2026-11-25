const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
let productsCache;
const responseDelay = () => new Promise((resolve) => setTimeout(resolve, 1500));

async function getProducts() {
  if (productsCache) {
    return productsCache;
  }

  const data = await fs.readFile(path.join(__dirname, "db.json"), "utf-8");
  productsCache = JSON.parse(data);
  return productsCache;
}

app.get("/", (req, res) => {
  res.json({
    message: "API is running",
    endpoints: ["/products", "/products/:id"],
  });
});

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
