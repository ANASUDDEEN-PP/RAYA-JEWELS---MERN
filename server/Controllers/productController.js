const productModel = require("../Models/productModel");
const imageModel = require("../Models/ImageModel");
const collectionModel = require("../Models/collectionModel");

exports.createProduct = async (req, res) => {
  try {
    let productId = "";
    const year = new Date().getFullYear();

    const { productName, collection, normalPrice, offerPrice, quantity, material, size, images } = req.body;

    // Validation
    if (!productName || !collection || !normalPrice || !offerPrice || !quantity || !material || !size) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Generate Product ID
    const productCount = await productModel.countDocuments();
    if (productCount === 0) {
      productId = `RAYA/${year}/PRD/0001`;
    } else {
      const lastPrd = await productModel.findOne().sort({ _id: -1 });
      const lastPrdId = lastPrd.ProductId?.split("/").pop(); // e.g., "0001"
      const nextId = String(parseInt(lastPrdId) + 1).padStart(4, '0'); // e.g., "0002"
      productId = `RAYA/${year}/PRD/${nextId}`;
    }

    // Create product
    const productData = {
      ProductId: productId,
      ProductName: productName,
      CollectionName: collection,
      NormalPrice: normalPrice,
      OfferPrice: offerPrice,
      Quantity: quantity,
      Material: material,
      Size: size
    };

    const product = await productModel.create(productData);

    // Save images
    const imageDocs = images.map(img => ({
      imageId: product._id.toString(),
      from: 'PRDIMG',
      ImageUrl: img.base64 // or store file path if you save to disk
    }));

    await imageModel.insertMany(imageDocs);

    return res.status(200).json({
      message: "Product created successfully",
      productId: product.ProductId
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

exports.getProductOrderedByCollection = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the collection
    const collection = await collectionModel.findById(id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // 2. Find products in this collection
    const products = await productModel.find({ 
      CollectionName: collection.CollectionName 
    });

    // 3. Get images for all products
    const productIds = products.map(p => p._id);
    const images = await imageModel.find({ 
      imageId: { $in: productIds } 
    });

    // 4. Structure the response (using string comparison)
    const response = {
      collection: collection.CollectionName,
      products: products.map(product => {
        return {
          ...product.toObject(),
          images: images.filter(img => 
            img.imageId.toString() === product._id.toString()
          )
        };
      })
    };

    return res.status(200).json(response);

  } catch(err) {
    console.error("Error in getProductOrderedByCollection:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
}