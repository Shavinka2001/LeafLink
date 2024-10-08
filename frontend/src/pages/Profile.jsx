import React from 'react';

// Sample profile data
const profileData = {
  name: "John Doe",
  position: "Production Manager",
  email: "john.doe@example.com",
  phone: "+1 (234) 567-8901",
  address: "123 Tea Street, Tea City, TE 12345",
  bio: "Experienced manager with over 10 years in tea production and operations management. Passionate about quality and sustainability in the tea industry.",
  profilePicture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5q9GlWCAoQHPpOiDOECuYUeXW9MQP7Ddt-Q&s" // Replace with actual image URL
};

const Profile = () => {
  return (
    <div className="bg-green-50 min-h-screen p-8">
      <div className="max-w-2xl mx-auto bg-gray rounded-lg shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="flex items-center justify-center pt-6">
          <img 
            src={profileData.profilePicture} 
            alt="Profile" 
            className="w-32 h-32 rounded-full border-4 border-green-500 shadow-lg"
          />
        </div>
        <div className="text-center p-4">
          <h2 className="text-4xl font-bold text-gray-800">{profileData.name}</h2>
          <p className="text-xl text-gray-600">{profileData.position}</p>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
          <div className="space-y-2">
            <p className="text-gray-600"><strong>Email:</strong> {profileData.email}</p>
            <p className="text-gray-600"><strong>Phone:</strong> {profileData.phone}</p>
            <p className="text-gray-600"><strong>Address:</strong> {profileData.address}</p>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">About Me</h3>
          <p className="text-gray-600">{profileData.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
