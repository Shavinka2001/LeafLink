import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaUser, FaCalendarAlt, FaLock } from 'react-icons/fa';
import jsPDF from 'jspdf'; // Importing jsPDF
import { useLocation } from 'react-router-dom';
import { ErrorNotification, SuccessNotification } from '../notifications/notifications';
import axios from '../api/axios';

const Payment = () => {
  const location = useLocation();
  const { totalPrice, cartItems } = location.state || {};

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    cardNumber: false,
    cardHolder: false,
    expiryDate: false,
    cvv: false,
  });

  useEffect(() => {
    const newErrors = {};
    if (touched.cardNumber && !/^\d{16}$/.test(cardNumber)) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    if (touched.cardHolder && !/^[a-zA-Z\s]{3,}$/.test(cardHolder)) {
      newErrors.cardHolder = 'Cardholder name must be at least 3 characters long and contain only letters';
    }
    if (touched.expiryDate && !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in MM/YY format';
    }
    if (touched.cvv && !/^\d{3}$/.test(cvv)) {
      newErrors.cvv = 'CVV must be 3 digits';
    }
    setErrors(newErrors);
  }, [cardNumber, cardHolder, expiryDate, cvv, touched]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there are any validation errors
    if (Object.keys(errors).length === 0) {
      try {
        // Create payment data
        const paymentData = {
          cardHolder,
          cardNumber,
          expiryDate,
          cvv,
          status:"Payment Done",
          totalPrice,
          cartItems,
        };

        // Make POST request to create a new payment
        const response = await axios.post('/payment', paymentData);
        console.log('Payment created:', response.data);
        SuccessNotification('Payment Successful! Receipt has been generated.');

        // Generate PDF receipt
        generatePDFReceipt(paymentData);
      } catch (error) {
        console.error('Error creating payment:', error);
        ErrorNotification('Payment failed. Please try again.');
      }
    } else {
      ErrorNotification('Please correct the errors in the form');
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const generatePDFReceipt = () => {
    const doc = new jsPDF();
  
    // Adding a title with styling
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Tea Factory Payment Receipt', 105, 20, null, null, 'center');
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25); // Draw line below the title
  
    // Adding user details and receipt information
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Receipt Number: ${Math.floor(Math.random() * 100000)}`, 20, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 35);
  
    // Adding cardholder information section
    doc.setFontSize(12);
    doc.text(`Cardholder Name: ${cardHolder}`, 20, 45);
    doc.text(`Card Number: **** **** **** ${cardNumber.slice(-4)}`, 20, 55);
    doc.text(`Expiry Date: ${expiryDate}`, 20, 65);
    doc.text('Payment Status: Successful', 20, 75);
  
    // Add a divider
    doc.line(20, 80, 190, 80);
  
    // Adding a table for items
    const startY = 90;
    let rowY = startY;
  
    // Table Headers
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Item', 20, rowY);
    doc.text('Price', 120, rowY);
    doc.text('Quantity', 150, rowY);
    doc.text('Total', 180, rowY);
    rowY += 10;
  
    // Table Data
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    cartItems.forEach((item, index) => {
      doc.text(`${item.Itemname}`, 20, rowY);
      doc.text(`$${item.price}`, 120, rowY);
      doc.text(`${item.quantity}`, 150, rowY);
      doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 180, rowY);
      rowY += 10;
    });
  
    // Draw a line after table content
    doc.line(20, rowY + 2, 190, rowY + 2);
    rowY += 10;
  
    // Adding Total Price Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Price: $${totalPrice.toFixed(2)}`, 180, rowY, null, null, 'right');
  
    // Footer
    rowY += 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for your purchase!', 105, rowY, null, null, 'center');
    doc.text('Visit us again at the Tea Factory', 105, rowY + 10, null, null, 'center');
  
    // Save and download the PDF
    doc.save('payment_receipt.pdf');
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">Payment Details</h2>

        {/* Cart Items Summary */}
        <div className="border p-4 rounded-lg mb-4">
          <h3 className="text-lg font-semibold">Items Summary</h3>
          {cartItems && cartItems.length > 0 ? (
            <>
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between mt-2">
                  <span>{item.Itemname}</span>
                  <span>
                    ${item.price} x {item.quantity} = ${item.price * item.quantity}
                  </span>
                </div>
              ))}
              <div className="mt-4 font-bold text-lg">Total: ${totalPrice}</div>
            </>
          ) : (
            <p>No items in the cart</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Card Number</label>
            <div className="flex items-center border-b">
              <FaCreditCard className="text-gray-400 mr-2" />
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                onBlur={() => handleBlur('cardNumber')}
                className={`w-full px-2 py-2 focus:outline-none ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="1234 5678 9123 0000"
                maxLength={16}
                required
              />
            </div>
            {touched.cardNumber && errors.cardNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Cardholder Name</label>
            <div className="flex items-center border-b">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                onBlur={() => handleBlur('cardHolder')}
                className={`w-full px-2 py-2 focus:outline-none ${errors.cardHolder ? 'border-red-500' : 'border-gray-300'}`}
                placeholder=""
                required
              />
            </div>
            {touched.cardHolder && errors.cardHolder && (
              <p className="mt-1 text-sm text-red-500">{errors.cardHolder}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Expiry Date</label>
              <div className="flex items-center border-b">
                <FaCalendarAlt className="text-gray-400 mr-2" />
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  onBlur={() => handleBlur('expiryDate')}
                  className={`w-full px-2 py-2 focus:outline-none ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="MM/YY"
                  required
                />
              </div>
              {touched.expiryDate && errors.expiryDate && (
                <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700">CVV</label>
              <div className="flex items-center border-b">
                <FaLock className="text-gray-400 mr-2" />
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  onBlur={() => handleBlur('cvv')}
                  className={`w-full px-2 py-2 focus:outline-none ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="123"
                  maxLength={3}
                  required
                />
              </div>
              {touched.cvv && errors.cvv && (
                <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 transition"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
