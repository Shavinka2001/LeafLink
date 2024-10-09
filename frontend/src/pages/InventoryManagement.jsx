import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaSearch, FaPlus, FaEdit, FaTrashAlt, FaFilePdf } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const InventoryManagement = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    Itemname: '',
    Discription: '',
    quantity: '',
    price: '',
    image: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Fetch items from the backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/item'); // Adjust the URL as needed
        setItems(response.data);
      } catch (error) {
        toast.error('Failed to fetch inventory items.');
      }
    };

    fetchItems();
  }, []);

  const openModal = (index = null) => {
    if (index !== null) {
      setEditMode(true);
      setEditIndex(index);
      setFormData(items[index]);
    } else {
      setEditMode(false);
      setFormData({
        Itemname: '',
        Discription: '',
        quantity: '',
        price: '',
        image: '',
      });
    }
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const validateForm = () => {
    const errors = {};
    const { Itemname, Discription, quantity, price } = formData;

    // Validate Item Name
    if (!Itemname.trim()) {
      errors.Itemname = 'Item Name is required.';
    }

    // Validate Description
    if (!Discription.trim()) {
      errors.Discription = 'Description is required.';
    }

    // Validate Quantity
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      errors.quantity = 'Quantity should be a positive number.';
    }

    // Validate Price to ensure it is a float with exactly two decimal points
    const priceRegex = /^\d+(\.\d{2})$/; // Regex for a positive float with exactly two decimal places
    if (!price || !priceRegex.test(price)) {
      errors.price = 'Price should be a positive number formatted to two decimal points (e.g., 13.00).';
    }

    return errors;
  };

  const filteredItems = items.filter(
    (item) =>
      item.Itemname.toLowerCase().includes(searchQuery) ||
      item.Discription.toLowerCase().includes(searchQuery)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length) {
      // If there are errors, don't submit and show the errors
      Object.values(errors).forEach((error) => toast.error(error));
      return; // Exit the function if there are validation errors
    }

    try {
      if (editMode) {
        await axios.put(`/item/${items[editIndex]._id}`, formData);
        const updatedItems = [...items];
        updatedItems[editIndex] = { ...formData, _id: items[editIndex]._id };
        setItems(updatedItems);
        toast.success('Item updated successfully.'); // Show success message only after successful update
      } else {
        const response = await axios.post('/item', formData);
        setItems((prev) => [...prev, response.data]);
        toast.success('Item added successfully.'); // Show success message only after successful addition
      }
      setModalOpen(false);
    } catch (error) {
      toast.error('Failed to save the item.'); // Show error message if the request fails
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/item/${id}`);
      const updatedItems = items.filter((item) => item._id !== id);
      setItems(updatedItems);
      toast.success('Item deleted successfully.');
    } catch (error) {
      toast.error('Failed to delete the item.');
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Add logo to the PDF (replace 'data:image/png;base64,...' with your actual base64 image string)
    const logo = '..src'; // Insert your base64 logo here
    doc.addImage(logo, 'PNG', 14, 10, 40, 20); // Adjust position (x, y) and size (width, height)
  
    // Set the title and company details
    doc.setFontSize(18);
    doc.text('Inventory Management', 14, 35); // Title position
  
    // Company information
    doc.setFontSize(16);
    doc.text('Leaflink Tea Factory', 14, 50); // Company name
    doc.text('Urubokka', 14, 55); // Address line 1
    doc.text('Matara', 14, 60); // Address line 2
    
    // Add the date
    const date = new Date().toLocaleDateString(); // Get current date
    doc.text(`Date: ${date}`, 14, 65); // Date position
  
    // Create table headers
    const headers = [['Item Name', 'Description', 'Quantity', 'Price']];
    
    // Extract data from filteredItems
    const data = filteredItems.map(item => [
      item.Itemname,
      item.Discription,
      item.quantity,
      item.price,
    ]);
  
    // Add headers and data to the PDF
    doc.autoTable({
      head: headers,
      body: data,
      startY: 70, // Adjust starting position to leave space for company info
      styles: { 
        cellPadding: 3, // Reduce padding for smaller table
        fontSize: 9, // Reduce font size for a smaller table
        overflow: 'linebreak', // Ensure line breaks in cells if needed
        minCellHeight: 8, // Set minimum cell height for better readability
      },
      columnStyles: {
        0: { halign: 'left', cellWidth: 30 }, // Adjust width for better alignment
        1: { halign: 'left', cellWidth: 60 }, // Adjust width for better alignment
        2: { halign: 'center', cellWidth: 25 }, // Adjust width for better alignment
        3: { halign: 'right', cellWidth: 25 }, // Adjust width for better alignment
      },
      margin: { top: 30, left: 14, right: 14 }, // Set margins to fit the page
    });
  
    // Save the PDF
    doc.save('inventory_management.pdf');
    toast.success('PDF downloaded successfully.');
  };
  
  

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-4 text-center">Inventory Management</h2>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnFocusLoss draggable />

      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md flex items-center gap-2 hover:bg-green-600 transition duration-300"
          onClick={() => openModal()}
        >
          <FaPlus /> Add New Item
        </button>
        <div className="flex items-center border border-gray-300 rounded shadow-md p-2">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table id="inventory-table" className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-green-100">
            <tr className="text-left">
              <th className="py-3 px-4 font-semibold text-gray-700">Item Name</th>
              <th className="py-3 px-4 font-semibold text-gray-700">Description</th>
              <th className="py-3 px-4 font-semibold text-gray-700">Quantity</th>
              <th className="py-3 px-4 font-semibold text-gray-700">Price</th>
              <th className="py-3 px-4 font-semibold text-gray-700">Image URL</th>
              <th className="py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item._id} className="hover:bg-gray-100 transition duration-200">
                <td className="py-4 px-4 border-b border-gray-300">{item.Itemname}</td>
                <td className="py-4 px-4 border-b border-gray-300">{item.Discription}</td>
                <td className="py-4 px-4 border-b border-gray-300">{item.quantity}</td>
                <td className="py-4 px-4 border-b border-gray-300">{item.price}</td>
                <td className="py-4 px-4 border-b border-gray-300">
                  <img
                    src={item.image}
                    alt={item.Itemname}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="py-4 px-4 border-b border-gray-300 flex items-center gap-2">
                  <button
                    className="text-blue-500 hover:text-blue-700 transition duration-300"
                    onClick={() => openModal(items.findIndex((itm) => itm._id === item._id))}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 transition duration-300"
                    onClick={() => handleDelete(item._id)}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md flex items-center gap-2 hover:bg-blue-600 transition duration-300"
        onClick={generatePDF}
      >
        <FaFilePdf /> Download PDF
      </button>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">{editMode ? 'Update Item' : 'Add New Item'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Item Name</label>
                <input
                  type="text"
                  name="Itemname"
                  value={formData.Itemname}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Description</label>
                <input
                  type="text"
                  name="Discription"
                  value={formData.Discription}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Price</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  required
                />
                <small className="text-red-500">
                  Price should be a positive number formatted to two decimal points (e.g., 13.00).
                </small>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 text-black py-2 px-4 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded-lg"
                >
                  {editMode ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
