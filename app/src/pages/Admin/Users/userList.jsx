import React, { useState } from 'react';
import { Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import NavBar from "../Components/navBar";
import Sidebar from "../Components/sideBar";

const UserListPage = () => {
  // Sample user data
  const [users] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 987-6543",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      phone: "+1 (555) 456-7890",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      phone: "+1 (555) 321-0987",
    },
    {
      id: 5,
      name: "David Brown",
      email: "david.brown@example.com",
      phone: "+1 (555) 654-3210",
    },
    {
      id: 6,
      name: "Lisa Garcia",
      email: "lisa.garcia@example.com",
      phone: "+1 (555) 789-0123",
    },
    {
      id: 7,
      name: "Robert Miller",
      email: "robert.miller@example.com",
      phone: "+1 (555) 234-5678",
    },
    {
      id: 8,
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "+1 (555) 876-5432",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Generate pagination buttons
  const getPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;

    if (totalPages <= maxVisibleButtons) {
      // Show all pages if total pages <= 5
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      // Complex pagination logic
      if (currentPage <= 3) {
        // Show 1,2,3,4,5 ... last
        for (let i = 1; i <= 5; i++) {
          buttons.push(i);
        }
        if (totalPages > 5) {
          buttons.push("...");
        }
      } else if (currentPage >= totalPages - 2) {
        // Show 1 ... last-4,last-3,last-2,last-1,last
        buttons.push(1);
        buttons.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          buttons.push(i);
        }
      } else {
        // Show 1 ... current-1,current,current+1 ... last
        buttons.push(1);
        buttons.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          buttons.push(i);
        }
        buttons.push("...");
        buttons.push(totalPages);
      }
    }

    return buttons;
  };

  const handleAction = (action, user) => {
    alert(`${action} action clicked for ${user.name}`);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    // Close sidebar when clicking outside on mobile
    React.useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 1024) {
          setIsSidebarOpen(false);
        }
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Navbar */}
        <NavBar toggleSidebar={toggleSidebar} />

        {/* Main Content Area */}
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header Section */}
              <div className="flex justify-between items-center mb-8">
                {/* Left side - Title and Counter */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    AllUsers
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Total Users:{" "}
                    <span className="font-semibold text-blue-600">
                      {filteredUsers.length}
                    </span>
                    {filteredUsers.length > 0 && (
                      <span className="ml-2 text-sm">
                        (Showing {startIndex + 1}-
                        {Math.min(endIndex, filteredUsers.length)} of{" "}
                        {filteredUsers.length})
                      </span>
                    )}
                  </p>
                </div>

                {/* Right side - Search Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Table Section */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sl No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentUsers.map((user, index) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {startIndex + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAction("View", user)}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                                title="View User"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleAction("Edit", user)}
                                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full transition-colors"
                                title="Edit User"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleAction("Delete", user)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                                title="Delete User"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* No results message */}
                {currentUsers.length === 0 && filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">
                      No users found matching your search.
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filteredUsers.length > itemsPerPage && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(endIndex, filteredUsers.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{filteredUsers.length}</span>{" "}
                    results
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Previous button */}
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </button>

                    {/* Page numbers */}
                    <div className="flex items-center space-x-1">
                      {getPaginationButtons().map((button, index) => (
                        <React.Fragment key={index}>
                          {button === "..." ? (
                            <span className="px-3 py-2 text-sm text-gray-500">
                              ...
                            </span>
                          ) : (
                            <button
                              onClick={() => setCurrentPage(button)}
                              className={`px-3 py-2 text-sm font-medium rounded-md ${
                                currentPage === button
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                              }`}
                            >
                              {button}
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Next button */}
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === totalPages
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserListPage;
