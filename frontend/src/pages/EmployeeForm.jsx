import React, { useState, useRef } from "react";
import EmployeeForm from "./EmployeeForm"; // Import your EmployeeForm component

const EmployeeManagement = () => {
  // Sample employee data
  const [employees, setEmployees] = useState([
    { id: 1, name: "Alice Johnson", role: "Supervisor", department: "Production", email: "alice@example.com" },
    { id: 2, name: "Bob Smith", role: "Technician", department: "Maintenance", email: "bob@example.com" },
    { id: 3, name: "Charlie Brown", role: "Operator", department: "Quality Control", email: "charlie@example.com" },
  ]);

  // State for the new employee form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
  });

  // Create a ref for the employee table
  const tableRef = useRef(null);

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Add the new employee to the list
    const newEmployee = { id: employees.length + 1, ...formData };
    setEmployees([...employees, newEmployee]);

    // Reset form data
    setFormData({ name: "", email: "", role: "", department: "" });

    // Scroll to the employee table
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="flex-1 p-10">
      <EmployeeForm onSubmit={handleFormSubmit} formData={formData} onChange={handleInputChange} />
      
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Employee Management</h2>
      
      <div ref={tableRef} className="bg-white rounded-lg shadow-lg p-5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Role</th>
              <th className="p-3 border-b">Department</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="border-b hover:bg-gray-100 transition">
                <td className="p-3">{employee.name}</td>
                <td className="p-3">{employee.role}</td>
                <td className="p-3">{employee.department}</td>
                <td className="p-3">{employee.email}</td>
                <td className="p-3 text-center flex justify-center space-x-4">
                  <button className="text-blue-600 hover:text-blue-800 transition">Edit</button>
                  <button className="text-red-600 hover:text-red-800 transition">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeManagement;
