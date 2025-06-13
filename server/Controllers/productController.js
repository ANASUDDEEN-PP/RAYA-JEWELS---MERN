const productModel = require("../Models/productModel");
const imageModel = require("../Models/ImageModel");

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
