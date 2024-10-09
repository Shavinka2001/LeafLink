import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaSearch, FaPlus, FaEdit, FaTrashAlt, FaFilePdf } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../api/axios'; // Import Axios

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    cardHolder: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    totalPrice: "",
    cartItems: [],
    status: "Payment Done",
  });
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Fetch payments from the backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('/payment');
        setPayments(response.data);
      } catch (error) {
        console.error('Error fetching payments:', error);
        toast.error("Failed to load payments.");
      }
    };
    fetchPayments();
  }, []);

  // Open modal for adding/editing payment
  const openModal = (index = null) => {
    if (index !== null) {
      setEditMode(true);
      setEditIndex(index);
      setFormData(payments[index]);
    } else {
      setEditMode(false);
      setFormData({
        cardHolder: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        totalPrice: "",
        cartItems: [],
        status: "Payment Done",
      });
    }
    setModalOpen(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle cart items change
  const handleCartItemsChange = (e, index) => {
    const { name, value } = e.target;
    const updatedCartItems = [...formData.cartItems];
    updatedCartItems[index][name] = value;
    setFormData((prev) => ({
      ...prev,
      cartItems: updatedCartItems,
    }));
  };

  // Add new cart item input
  const addCartItem = () => {
    setFormData((prev) => ({
      ...prev,
      cartItems: [...prev.cartItems, { itemName: "", price: 0, quantity: 0 }],
    }));
  };

  // Remove cart item
  const removeCartItem = (index) => {
    const updatedCartItems = formData.cartItems.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      cartItems: updatedCartItems,
    }));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter payments based on search query
  const filteredPayments = payments.filter(
    (payment) =>
      payment.cardHolder.toLowerCase().includes(searchQuery) ||
      payment.cardNumber.toLowerCase().includes(searchQuery) ||
      payment.status.toLowerCase().includes(searchQuery)
  );

  // Add or Edit payment with validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation rules
    const { cardHolder, cardNumber, expiryDate, cvv, totalPrice, cartItems } = formData;
    
    // Check if any field is empty
    if (!cardHolder || !cardNumber || !expiryDate || !cvv || !totalPrice || !cartItems.length) {
      toast.error("Please fill out all fields.");
      return;
    }

    // Validate card number (should be 16 digits)
    if (!/^\d{16}$/.test(cardNumber)) {
      toast.error("Card number should be 16 digits long.");
      return;
    }

    // Validate CVV (should be 3 digits)
    if (!/^\d{3}$/.test(cvv)) {
      toast.error("CVV should be 3 digits long.");
      return;
    }

    // Validate expiry date (should be in MM/YY format)
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      toast.error("Expiry date should be in MM/YY format.");
      return;
    }

    // Validate total price (should be a positive number)
    if (totalPrice <= 0) {
      toast.error("Total price should be a positive number.");
      return;
    }

    
    try {
      if (editMode) {
        // Update payment with ID preserved
        const updatedPayment = { ...formData };
        await axios.put(`/payment/${payments[editIndex]._id}`, updatedPayment);
        const updatedPayments = [...payments];
        updatedPayments[editIndex] = { ...updatedPayment, _id: payments[editIndex]._id };
        setPayments(updatedPayments);
        toast.success("Payment updated successfully.");
      } else {
        // Add new payment
        const newPayment = { ...formData };
        const response = await axios.post('/payment', newPayment);
        setPayments((prev) => [...prev, response.data]);
        toast.success("Payment added successfully.");
      }
    } catch (error) {
      console.error('Error saving payment:', error);
      toast.error("Failed to save payment.");
    }

    setModalOpen(false);
  };

  // Delete payment
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/payment/${id}`);
      const updatedPayments = payments.filter((payment) => payment._id !== id);
      setPayments(updatedPayments);
      toast.success("Payment deleted successfully.");
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast.error("Failed to delete payment.");
    }
  };

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Payment Management', 14, 22);

    // Capture table with html2canvas
    const input = document.getElementById('payment-table');
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 10;

      // Add the image to PDF
      doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save('payment_management.pdf');
      toast.success("PDF downloaded successfully.");
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-4 text-center">Payment Management</h2>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnFocusLoss draggable />

      {/* Search Bar and Add Payment Button */}
      <div className="flex justify-between items-center mb-4">
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

      {/* Payment Table */}
      <div className="overflow-x-auto">
        <table id="payment-table" className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2">Cardholder Name</th>
              <th className="border border-gray-300 p-2">Card Number</th>
              <th className="border border-gray-300 p-2">Expiry Date</th>
              <th className="border border-gray-300 p-2">Total Price</th>
              <th className="border border-gray-300 p-2">Cart Items</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment, index) => (
              <tr key={payment._id} className="text-center">
                <td className="border border-gray-300 p-2">{payment.cardHolder}</td>
                <td className="border border-gray-300 p-2">{payment.cardNumber}</td>
                <td className="border border-gray-300 p-2">{payment.expiryDate}</td>
                <td className="border border-gray-300 p-2">{payment.totalPrice}</td>
                <td className="border border-gray-300 p-2">
                  {payment.cartItems.map((item, i) => (
                    <div key={i}>
                      {item.itemName} - ${item.price} x {item.quantity}
                    </div>
                  ))}
                </td>
                <td className="border border-gray-300 p-2">{payment.status}</td>
                <td className="border border-gray-300 p-2 flex justify-center items-center space-x-4">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded shadow-md hover:bg-blue-600" onClick={() => openModal(index)}>
                    <FaEdit />
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded shadow-md hover:bg-red-600" onClick={() => handleDelete(payment._id)}>
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Download PDF Button */}
      <button
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
        onClick={generatePDF}
      >
        <FaFilePdf /> Download PDF
      </button>

      {/* Add/Edit Payment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">{editMode ? "Edit Payment" : "Add Payment"}</h2>
            <form onSubmit={handleSubmit}>
              {/* Form Fields */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Cardholder Name</label>
                <input
                  type="text"
                  name="cardHolder"
                  value={formData.cardHolder}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                  required
                />
              </div>
              <div className="flex justify-between space-x-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    className="w-full border border-gray-300 rounded p-2"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Total Price</label>
                <input
                  type="number"
                  name="totalPrice"
                  value={formData.totalPrice}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                  required
                />
              </div>
              {/* Cart Items Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Cart Items</label>
                {formData.cartItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      name="itemName"
                      value={item.itemName}
                      onChange={(e) => handleCartItemsChange(e, index)}
                      placeholder="Item Name"
                      className="flex-1 border border-gray-300 rounded p-2"
                      required
                    />
                    
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleCartItemsChange(e, index)}
                      placeholder="Qty"
                      className="w-20 border border-gray-300 rounded p-2"
                      required
                    />
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeCartItem(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-2 bg-blue-500 text-white py-1 px-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                  onClick={addCartItem}
                >
                  Add Item
                </button>
              </div>
              {/* Save Button */}
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-300 w-full"
              >
                {editMode ? "Update Payment" : "Save Payment"}
              </button>
            </form>
            {/* Close Modal Button */}
            <button
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition duration-300 w-full"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
