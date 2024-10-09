import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
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

    // Validate on input change
    const errors = validateForm();
    if (errors[name]) {
      toast.error(errors[name]); // Show notification immediately
    }
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

    // Validate Price with regex for two decimal points
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    if (!price || !priceRegex.test(price)) {
      errors.price = 'Price should be a positive number and formatted to two decimal points (e.g., 10.00).';
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
      Object.values(errors).forEach(error => toast.error(error));
      return;
    }

    try {
      if (editMode) {
        await axios.put(`/item/${items[editIndex]._id}`, formData);
        const updatedItems = [...items];
        updatedItems[editIndex] = { ...formData, _id: items[editIndex]._id };
        setItems(updatedItems);
        toast.success('Item updated successfully.');
      } else {
        const response = await axios.post('/item', formData);
        setItems((prev) => [...prev, response.data]);
        toast.success('Item added successfully.');
      }
      setModalOpen(false);
    } catch (error) {
      toast.error('Failed to save the item.');
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

    // Set the title
    doc.setFontSize(18);
    doc.text('Inventory Management', 14, 22);

    // Create table headers
    const headers = [['Item Name', 'Description', 'Quantity', 'Price', 'Image URL']];
    const data = filteredItems.map(item => [
      item.Itemname,
      item.Discription,
      item.quantity,
      item.price,
      item.image,
    ]);

    // Set column widths
    const columnWidths = [40, 80, 20, 30, 40];

    // Add the headers and data to the PDF
    doc.autoTable({
      head: headers,
      body: data,
      startY: 30,
      styles: { cellPadding: 5, fontSize: 10 },
      columnStyles: {
        0: { cellWidth: columnWidths[0] },
        1: { cellWidth: columnWidths[1] },
        2: { cellWidth: columnWidths[2] },
        3: { cellWidth: columnWidths[3] },
        4: { cellWidth: columnWidths[4], halign: 'center' },
      },
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
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
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
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 px-4 text-center text-gray-500">No items found</td>
              </tr>
            ) : (
              filteredItems.map((item, index) => (
                <tr key={item._id}>
                  <td className="py-3 px-4 border-b">{item.Itemname}</td>
                  <td className="py-3 px-4 border-b">{item.Discription}</td>
                  <td className="py-3 px-4 border-b">{item.quantity}</td>
                  <td className="py-3 px-4 border-b">{item.price}</td>
                  <td className="py-3 px-4 border-b">{item.image}</td>
                  <td className="py-3 px-4 border-b flex gap-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => openModal(index)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDelete(item._id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md flex items-center gap-2 hover:bg-blue-600 transition duration-300"
        onClick={generatePDF}
      >
        <FaFilePdf /> Generate PDF
      </button>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">{editMode ? 'Edit Item' : 'Add New Item'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Item Name</label>
                <input
                  type="text"
                  name="Itemname"
                  value={formData.Itemname}
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-2 w-full"
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
                  className="border border-gray-300 rounded p-2 w-full"
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
                  className="border border-gray-300 rounded p-2 w-full"
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
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg"
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
