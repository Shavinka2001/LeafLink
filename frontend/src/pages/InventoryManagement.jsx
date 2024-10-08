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

  const filteredItems = items.filter(
    (item) =>
      item.Itemname.toLowerCase().includes(searchQuery) ||
      item.Discription.toLowerCase().includes(searchQuery)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Itemname || !formData.Discription || !formData.quantity || !formData.price || !formData.image) {
      toast.error('Please fill out all fields.');
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
    doc.setFontSize(18);
    doc.text('Inventory Management', 14, 22);

    const input = document.getElementById('inventory-table');
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save('inventory_management.pdf');
      toast.success('PDF downloaded successfully.');
    });
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
                <td className="py-4 px-4  border-gray-300 flex items-center gap-2">
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

      <div className="mt-4 text-right">
        <button
          className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md flex items-center gap-2 hover:bg-red-600 transition duration-300"
          onClick={generatePDF}
        >
          <FaFilePdf /> Download PDF
        </button>
      </div>

      {/* Modal for adding/editing item */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">{editMode ? 'Edit Item' : 'Add New Item'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Item Name:</label>
                <input
                  type="text"
                  name="Itemname"
                  value={formData.Itemname}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Description:</label>
                <input
                  type="text"
                  name="Discription"
                  value={formData.Discription}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Quantity:</label>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Price:</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Image URL:</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-2 w-full"
                />
              </div>
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                {editMode ? 'Update Item' : 'Add Item'}
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg ml-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
