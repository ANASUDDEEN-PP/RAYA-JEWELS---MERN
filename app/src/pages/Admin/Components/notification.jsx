import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, ShoppingCart, Users, Package, TrendingUp, CreditCard, MessageCircle, Filter } from 'lucide-react';
import axios from 'axios';
// import io from 'socket.io-client';
import baseUrl from '../../../url';

// Socket connection
// const socket = io(baseUrl);

// Notification Item Component
const NotificationItem = ({ notification, onMarkAsRead, onDelete, isRead }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <CheckCircle size={20} className="text-green-600" />;
      case 'warning': return <AlertCircle size={20} className="text-yellow-600" />;
      case 'error': return <AlertCircle size={20} className="text-red-600" />;
      case 'info': return <TrendingUp size={20} className="text-blue-600" />;
      case 'order': return <ShoppingCart size={20} className="text-purple-600" />;
      case 'user': return <Users size={20} className="text-indigo-600" />;
      case 'product': return <Package size={20} className="text-pink-600" />;
      case 'payment': return <CreditCard size={20} className="text-green-600" />;
      case 'comment': return <MessageCircle size={20} className="text-orange-600" />;
      default: return <Bell size={20} className="text-blue-600" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success': return 'border-green-400';
      case 'warning': return 'border-yellow-400';
      case 'error': return 'border-red-400';
      case 'order': return 'border-purple-400';
      case 'user': return 'border-indigo-400';
      case 'product': return 'border-pink-400';
      case 'payment': return 'border-green-400';
      case 'comment': return 'border-orange-400';
      default: return 'border-blue-400';
    }
  };

  const getBackgroundColor = () => {
    if (isRead) return 'bg-gray-50/80 backdrop-blur-sm';
    switch (notification.type) {
      case 'success': return 'bg-green-50/80 backdrop-blur-sm';
      case 'warning': return 'bg-yellow-50/80 backdrop-blur-sm';
      case 'error': return 'bg-red-50/80 backdrop-blur-sm';
      case 'order': return 'bg-purple-50/80 backdrop-blur-sm';
      case 'user': return 'bg-indigo-50/80 backdrop-blur-sm';
      case 'product': return 'bg-pink-50/80 backdrop-blur-sm';
      case 'payment': return 'bg-green-50/80 backdrop-blur-sm';
      case 'comment': return 'bg-orange-50/80 backdrop-blur-sm';
      default: return 'bg-blue-50/80 backdrop-blur-sm';
    }
  };

  return (
    <div className={`flex items-start p-5 rounded-xl border-l-4 ${getBorderColor()} ${getBackgroundColor()} transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group`}>
      <div className="flex-shrink-0 mr-4 mt-1">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={`text-base font-semibold ${isRead ? 'text-gray-600' : 'text-gray-900'}`}>
              {notification.title}
            </p>
            <p className={`text-sm mt-2 leading-relaxed ${isRead ? 'text-gray-500' : 'text-gray-700'}`}>
              {notification.message}
            </p>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500 font-medium">{notification.time}</p>
              <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
                {!isRead && (
                  <button
                    onClick={() => onMarkAsRead(notification.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-100 px-3 py-1 rounded-full transition-all"
                  >
                    Mark as read
                  </button>
                )}
                <button
                  onClick={() => onDelete(notification.id)}
                  className="text-sm text-red-600 hover:text-red-800 font-semibold hover:bg-red-100 px-3 py-1 rounded-full transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          {!isRead && (
            <div className="w-3 h-3 bg-blue-500 rounded-full ml-4 mt-2 flex-shrink-0 animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
};

// Filter Button Component
const FilterButton = ({ type, label, isActive, onClick, count, icon: Icon }) => {
  return (
    <button
      onClick={() => onClick(type)}
      className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
          : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
      {count > 0 && (
        <span className={`text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold ${
          isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
        }`}>
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};

// Full Screen Notification System Component
// Full Screen Notification System Component
const FullScreenNotificationSystem = ({ notifications: initialNotifications, isOpen, onClose, onMarkAsRead, onDelete }) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const getFilteredNotifications = () => {
    if (activeFilter === 'all') return notifications;
    return notifications.filter(notification => notification.type === activeFilter);
  };

  const getNotificationCount = (type) => {
    if (type === 'all') return notifications.length;
    return notifications.filter(n => n.type === type).length;
  };

  const filterButtons = [
    { type: 'all', label: 'All', icon: Filter },
    { type: 'order', label: 'Orders', icon: ShoppingCart },
    { type: 'user', label: 'User Registration', icon: Users },
    { type: 'payment', label: 'Payment', icon: CreditCard },
    { type: 'product', label: 'Product Dispatch', icon: Package },
    { type: 'info', label: 'Product Add', icon: TrendingUp },
    { type: 'comment', label: 'Comments', icon: MessageCircle },
  ];

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background Blur */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Main Container */}
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden mx-4 flex flex-col">
        
        {/* Header - Fixed height */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl border-b border-gray-200/50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Bell size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-gray-600">
                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Filter Buttons - Fixed height */}
          <div className="px-6 pb-6">
            <div className="flex flex-wrap gap-3">
              {filterButtons.map((filter) => (
                <FilterButton
                  key={filter.type}
                  type={filter.type}
                  label={filter.label}
                  isActive={activeFilter === filter.type}
                  onClick={setActiveFilter}
                  count={getNotificationCount(filter.type)}
                  icon={filter.icon}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List - Scrollable area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">
                {activeFilter === 'all' 
                  ? "You're all caught up! No new notifications." 
                  : `No ${filterButtons.find(f => f.type === activeFilter)?.label.toLowerCase()} notifications.`
                }
              </p>
            </div>
          ) : (
            <>
              {/* Unread Notifications */}
              {filteredNotifications.filter(n => !n.isRead).length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      New ({filteredNotifications.filter(n => !n.isRead).length})
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {filteredNotifications.filter(n => !n.isRead).map((notification) => (
                      <NotificationItem 
                        key={`unread-${notification.id}`}
                        notification={notification} 
                        onMarkAsRead={onMarkAsRead}
                        onDelete={onDelete}
                        isRead={false}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Read Notifications */}
              {filteredNotifications.filter(n => n.isRead).length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-gray-600 mb-4">Earlier</h2>
                  <div className="space-y-4">
                    {filteredNotifications.filter(n => n.isRead).map((notification) => (
                      <NotificationItem 
                        key={`read-${notification.id}`}
                        notification={notification} 
                        onMarkAsRead={onMarkAsRead}
                        onDelete={onDelete}
                        isRead={true}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Notification Component
const NotificationSystem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map API categories to notification types
  const mapCategoryToType = (category) => {
    switch(category) {
      case 'USRG': return 'user';
      case 'CMTPST': return 'comment';
      case 'PRDAD': return 'info';
      case 'ORDPRCS': return 'order';
      case 'ORDPYMT': return 'payment';
      case 'PRDDISP': return 'product';
      case 'ERROR': return 'error';
      case 'WARNING': return 'warning';
      default: return 'info';
    }
  };

  // Fetch notifications from API
  const fetchNotifications = async() => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${baseUrl}/get/all/notification`);
      
      const transformedNotifications = response.data.allNotifications.map(notification => ({
        id: notification._id,
        type: mapCategoryToType(notification.Category),
        title: notification.Title,
        message: notification.Content,
        time: notification.createdDate,
        isRead: notification.MarkAsRead === "true"
      }));
      
      setNotifications(transformedNotifications);
    } catch(err) {
      setError("Failed to load notifications");
      console.error("Notification fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await axios.put(`${baseUrl}/mark/notification/as/read`, { notificationId: id });
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      ));
    } catch(err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${baseUrl}/delete/notification`, { data: { notificationId: id } });
      setNotifications(notifications.filter(notification => notification.id !== id));
    } catch(err) {
      console.error("Error deleting notification:", err);
    }
  };

  // Initialize socket and fetch notifications
  useEffect(() => {
    fetchNotifications();

    // // Socket.io listeners
    // socket.on('new-notification', (newNotification) => {
    //   const transformedNotification = {
    //     id: newNotification._id,
    //     type: mapCategoryToType(newNotification.Category),
    //     title: newNotification.Title,
    //     message: newNotification.Content,
    //     time: newNotification.createdDate,
    //     isRead: false
    //   };
    //   setNotifications(prev => [transformedNotification, ...prev]);
    // });

    // socket.on('notification-read', (notificationId) => {
    //   setNotifications(prev => prev.map(n => 
    //     n.id === notificationId ? { ...n, isRead: true } : n
    //   ));
    // });

    // socket.on('notification-deleted', (notificationId) => {
    //   setNotifications(prev => prev.filter(n => n.id !== notificationId));
    // });

    // return () => {
    //   socket.off('new-notification');
    //   socket.off('notification-read');
    //   socket.off('notification-deleted');
    // };
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Bell size={18} />
          <span className="text-sm font-medium">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg z-50">
          <p>{error}</p>
        </div>
      )}

      <FullScreenNotificationSystem 
        notifications={notifications}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onMarkAsRead={markAsRead}
        onDelete={deleteNotification}
      />
    </div>
  );
};

export default NotificationSystem;