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

  console.log(payments);
  

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
    if (!cardHolder || !cardNumber || !expiryDate || !cvv || !totalPrice || !cartItems.length) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      if (editMode) {
        // Update payment
        const updatedPayment = { ...formData };
        await axios.put(`/payment/${payments[editIndex]._id}`, updatedPayment);
        const updatedPayments = [...payments];
        updatedPayments[editIndex] = { ...updatedPayment, _id: payments[editIndex]._id }; // Preserve ID
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
              <th className="border border-gray-300 p-2">CVV</th>
              <th className="border border-gray-300 p-2">Total Price</th>
              <th className="border border-gray-300 p-2">Cart Items</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment, index) => (
              <tr key={payment._id}>
                <td className="border border-gray-300 p-2">{payment.cardHolder}</td>
                <td className="border border-gray-300 p-2">{payment.cardNumber}</td>
                <td className="border border-gray-300 p-2">{payment.expiryDate}</td>
                <td className="border border-gray-300 p-2">{payment.cvv}</td>
                <td className="border border-gray-300 p-2">{payment.totalPrice}</td>
                <td className="border border-gray-300 p-2">
                  {payment.cartItems.map((item, i) => (
                    <div key={i}>
                      <strong>{item.Itemname}</strong> - ${item.price} x {item.quantity}
                    </div>
                  ))}
                </td>
                <td className="border border-gray-300 p-2">{payment.status}</td>
                <td className="border border-gray-300 p-2">
                  <button className="text-blue-500 hover:underline" onClick={() => openModal(index)}>
                    <FaEdit />
                  </button>
                  <button className="text-red-500 hover:underline ml-2" onClick={() => handleDelete(payment._id)}>
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          onClick={generatePDF}
        >
          <FaFilePdf /> Download PDF
        </button>
      </div>

      {/* Modal for Adding/Editing Payments */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <h3 className="text-xl font-semibold mb-4">{editMode ? "Edit Payment" : "Add Payment"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="cardHolder"
                value={formData.cardHolder}
                onChange={handleChange}
                placeholder="Cardholder Name"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                required
              />
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="Card Number"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                required
              />
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="Expiry Date (MM/YY)"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                required
              />
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="CVV"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                required
              />
              <input
                type="number"
                name="totalPrice"
                value={formData.totalPrice}
                onChange={handleChange}
                placeholder="Total Price"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                required
              />
              <h4 className="font-semibold mb-2">Cart Items</h4>
              {formData.cartItems.map((item, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    name="itemName"
                    value={item.Itemname}
                    onChange={(e) => handleCartItemsChange(e, index)}
                    placeholder="Item Name"
                    className="w-1/2 p-2 border border-gray-300 rounded mr-2"
                    required
                  />
                  <input
                    type="number"
                    name="price"
                    value={item.price}
                    onChange={(e) => handleCartItemsChange(e, index)}
                    placeholder="Price"
                    className="w-1/4 p-2 border border-gray-300 rounded mr-2"
                    required
                  />
                  <input
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleCartItemsChange(e, index)}
                    placeholder="Quantity"
                    className="w-1/4 p-2 border border-gray-300 rounded mr-2"
                    required
                  />
                  <button
                    type="button"
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    onClick={() => removeCartItem(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mb-4"
                onClick={addCartItem}
              >
                Add Cart Item
              </button>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                required
              >
                <option value="Payment Done">Payment Done</option>
                <option value="Proceed to Delivery">Proceed to Delivery</option>
                <option value="Completed">Completed</option>
              </select>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                >
                  {editMode ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
