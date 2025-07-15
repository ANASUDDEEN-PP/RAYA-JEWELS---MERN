import React, { useState, useEffect } from "react";
import {
  Package,
  Truck,
  Calendar,
  Clock,
  Loader,
  ChevronRight,
  X,
} from "lucide-react";
import NavBar from "../../components/navBar";
import axios from "axios";
import baseUrl from "../../url";
import UnauthorizedPage from "../../components/unauthorized Alert/unAuth";

export default function OrderDetailsPage() {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [ordersData, setOrdersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  // Safely get user from localStorage
  const user = JSON.parse(localStorage.getItem("userProfile")) || { _id: "" };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${baseUrl}/order/user/get/${user._id}`
        );

        let rawOrders = response.data?.orders || response.data || {};
        let orders = Object.values(rawOrders);

        const formattedOrders = orders
          .filter((order) => order && order.product)
          .map((order) => ({
            ...order,
            orderId: order.orderId || "N/A",
            orderDate: order.orderDate || "Date not available",
            status: order.status || "Unknown",
            trackId: order.trackId || "",
            expectedDeliveryDate:
              order.expectedDeliveryDate || new Date().toISOString(),
            product: {
              name: order.product?.name || "Unknown Product",
              brand: order.product?.brand || "Unknown Brand",
              image: order.product?.image || "",
              price: parseFloat(order.product?.price) || 0,
              quantity: order.product?.quantity || 1,
              size: order.product?.size || "N/A",
              sku: `SKU-${order.product?.size || "00"}-${Math.floor(
                Math.random() * 1000
              )}`,
            },
          }));

        setOrdersData(formattedOrders);
        if (formattedOrders.length > 0) {
          setSelectedOrderId(formattedOrders[0].orderId);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch order details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user._id) {
      fetchOrderDetails();
    }
  }, [user._id]);

  const currentOrder =
    ordersData.find((order) => order.orderId === selectedOrderId) || {};
  const ordersList = [...ordersData];

  const handleCancelOrder = async () => {
    if (!cancellationReason.trim()) {
      alert("Please provide a reason for cancellation.");
      return;
    }

    setIsCancelling(true);
    try {
      // console.log(cancellationReason, currentOrder.id)
      // Here you would typically make an API call to cancel the order
      await axios.put(`${baseUrl}/order/user/cancel/${currentOrder.id}`, {
        reason: cancellationReason,
      });

      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1500));

      // Update local state
      setOrdersData(
        ordersData.map((order) =>
          order.orderId === currentOrder.orderId
            ? { ...order, status: "Cancelled" }
            : order
        )
      );

      alert(
        `Order cancellation request submitted successfully.\nReason: ${cancellationReason}\nYou will receive a confirmation email shortly.`
      );
      setShowCancelModal(false);
      setCancellationReason("");
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Failed to cancel order. Please try again later.");
    } finally {
      setIsCancelling(false);
    }
  };

  const openCancelModal = () => {
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setCancellationReason("");
  };

  const handleTrackOrder = () => {
    if (currentOrder.trackId) {
      window.open(currentOrder.trackId, "_blank");
    } else {
      alert("Tracking information is not yet available for this order.");
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "text-gray-600 bg-gray-100";

    switch (status.toLowerCase()) {
      case "confirmed":
        return "text-green-600 bg-green-100";
      case "shipped":
        return "text-blue-600 bg-blue-100";
      case "processing":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (!JSON.parse(localStorage.getItem("userProfile"))) {
    return (
      <div>
        <NavBar />
        <UnauthorizedPage />
      </div>
    );
  }

  if (isLoading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-700">Loading your orders...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  if (ordersData.length === 0) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No Orders Found
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet.
            </p>
            <a
              href="/products"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block"
            >
              Browse Products
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Cancel Order</h3>
              <button
                onClick={closeCancelModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this order? Please provide a
              reason for cancellation.
            </p>

            <div className="mb-4">
              <label
                htmlFor="cancellationReason"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Reason for cancellation
              </label>
              <textarea
                id="cancellationReason"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your reason here..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeCancelModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isCancelling}
              >
                Go Back
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin inline" />
                    Cancelling...
                  </>
                ) : (
                  "Confirm Cancellation"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Details
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <span className="text-lg font-medium text-gray-600">
                  Order {currentOrder.orderId || "N/A"}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    currentOrder.status
                  )}`}
                >
                  {currentOrder.status || "Unknown"}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                Ordered on {currentOrder.orderDate || "Date not available"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Orders List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Orders
                </h2>
                <div className="space-y-3">
                  {ordersList.map((order) => (
                    <div
                      key={order.orderId}
                      onClick={() => setSelectedOrderId(order.orderId)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedOrderId === order.orderId
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">
                            {order.orderId || "N/A"}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {order.orderDate || "Date not available"}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status || "Unknown"}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Processing Status Message */}
              {currentOrder.status?.toLowerCase() === "processing" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="mb-4">
                        <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                          <Clock className="w-8 h-8 text-yellow-600 animate-pulse" />
                        </div>
                      </div>
                      <p className="text-yellow-800 font-medium text-lg">
                        We are cross checking your order details.
                        <br /> Wait for your order confirmation.
                      </p>
                      <p className="text-red-600 mt-3 animate-pulse">
                        You can cancel your order before it is confirmed. Once
                        the order is confirmed and shipped, the Cancel button
                        will be hidden.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* Product Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Product Details
                </h2>

                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={currentOrder.product?.image || ""}
                      alt={currentOrder.product?.name || "Product"}
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/128";
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {currentOrder.product?.name || "Unknown Product"}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {currentOrder.product?.brand || "Unknown Brand"}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      SKU: {currentOrder.product?.sku || "N/A"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Quantity: {currentOrder.product?.quantity || 1}
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        ₹{currentOrder.product?.price?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleTrackOrder}
                      className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Track Order
                    </button>

                    {currentOrder.status?.toLowerCase() === "processing" && (
                      <button
                        onClick={openCancelModal}
                        className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {/* Expected Delivery Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Expected Delivery
                </h3>

                <div className="space-y-4">
                  {currentOrder.expectedDeliveryDate &&
                  new Date(currentOrder.expectedDeliveryDate).getTime() >
                    Date.now() ? (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">
                          Expected Delivery Date
                        </p>
                        <p className="font-medium text-gray-900 text-lg">
                          {new Date(
                            currentOrder.expectedDeliveryDate
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Time Window</p>
                        <p className="font-medium text-gray-900 text-lg">
                          9:00 AM - 6:00 PM
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="mb-4">
                        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        Delivery Date Coming Soon
                      </h4>
                      <p className="text-blue-700 text-center mb-4">
                        Delivery date will be updated soon...
                      </p>
                      <p className="text-sm text-gray-600 text-center">
                        We'll notify you once your order is confirmed and a
                        delivery date is scheduled.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
