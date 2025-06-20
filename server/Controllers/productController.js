const productModel = require("../Models/productModel");
const imageModel = require("../Models/ImageModel");
const collectionModel = require("../Models/collectionModel");

exports.createProduct = async (req, res) => {
  try {
    const { productName, description, collection, normalPrice, offerPrice, quantity, material, size, images } = req.body;

    // Validation
    if (!productName || !collection || !normalPrice || !quantity) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    // Generate Product ID
    const year = new Date().getFullYear();
    let productId = "";
    const productCount = await productModel.countDocuments();

    if (productCount === 0) {
      productId = `RAYA/${year}/PRD/0001`;
    } else {
      const lastPrd = await productModel.findOne().sort({ _id: -1 });
      const lastPrdId = lastPrd.ProductId?.split("/").pop();
      const nextId = String(parseInt(lastPrdId) + 1).padStart(4, '0');
      productId = `RAYA/${year}/PRD/${nextId}`;
    }

    // Create Product
    const productData = {
      ProductId: productId,
      Description: description,
      ProductName: productName,
      CollectionName: collection,
      NormalPrice: parseFloat(normalPrice),
      OfferPrice: offerPrice ? parseFloat(offerPrice) : null,
      Quantity: parseInt(quantity),
      Material: material || null,
      Size: size || null
    };

    const product = await productModel.create(productData);

    // Store base64 images directly in imageModel
    const imageDocs = images.map(img => ({
      imageId: product._id.toString(),
      from: 'PRDIMG',
      ImageUrl: img  // directly store the base64 string or data:image/... URL
    }));

    await imageModel.insertMany(imageDocs);

    return res.status(201).json({
      message: "Product created successfully",
      productId: product.ProductId,
      images: images
    });

  } catch (err) {
    console.error("Error creating product:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
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

exports.getAllProducts = async(req, res) => {
  try{
    const products = await productModel.find({});
    return res.status(200).json({
      products
    })
  } catch(err){
    return res.status(404).json({
      message : "Internal Server Error"
    })
  }
}