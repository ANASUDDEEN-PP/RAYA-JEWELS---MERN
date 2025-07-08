import {Package} from 'lucide-react';
const ProductDetails = ({ productData, loading, productImage }) => {
  // console.log("productData :",productData)
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
          <div className="w-32 h-6 bg-gray-300 rounded"></div>
        </div>
        <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
        <div className="space-y-3">
          <div className="w-full h-4 bg-gray-300 rounded"></div>
          <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
          <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No product data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md ">
      <div className="flex items-center gap-3 mb-4">
        <Package className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-800">Product Details</h3>
      </div>
      
      {/* Product Image */}
      <div className="mb-4">
        <img 
          src={productImage[0].ImageUrl} 
          alt="Product" 
          className="w-full h-48 object-cover rounded-lg shadow-sm"
        />
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-600 font-medium">Product Id</label>
          <p className="text-gray-800">{productData.ProductId}</p>
        </div>
        <div>
          <label className="text-sm text-gray-600 font-medium">Product Name</label>
          <p className="text-gray-800">{productData.ProductName}</p>
        </div>
        <div>
          <label className="text-sm text-gray-600 font-medium">Category</label>
          <p className="text-gray-800">{productData.CollectionName}</p>
        </div>
        <div>
          <label className="text-sm text-gray-600 font-medium">Price</label>
          <p className="text-gray-800 font-semibold">${productData.OfferPrice}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;