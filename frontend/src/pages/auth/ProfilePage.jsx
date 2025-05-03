import React, { useState } from "react";
import { Camera, Mail, User, MapPin, Phone, Save, X } from "lucide-react";
import { useAuthStore } from "../../store/auth/useAuthStore.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { authUser, logout, isUpdatingProfile, updateProfile } = useAuthStore();
  const navigate = useNavigate();

  // console.log("authUser", authUser);


  // Form state
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    email: authUser?.email || "",
    location: authUser?.location || "",
    phone: authUser?.phone || "",
    profilePic: authUser?.profilePic || null,
  });
  const [selectedImg, setSelectedImg] = useState(authUser?.profilePic || null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target.result;
        setSelectedImg(base64Image);
        setFormData({
          ...formData,
          profilePic: base64Image,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to process image");
      console.error("Error processing image:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Reset form to original values
  const handleCancel = () => {
    setFormData({
      fullName: authUser?.fullName || "",
      email: authUser?.email || "",
      location: authUser?.location || "",
      phone: authUser?.phone || "",
      profilePic: authUser?.profilePic || null,
    });
    setSelectedImg(authUser?.profilePic || null);
    setEditMode(false);
  };

  // Profile info item component
  const ProfileInfoItem = ({ icon, label, name, value, editMode }) => (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {icon}
        {label}
      </div>
      {editMode ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      ) : (
        <div className="px-3 py-2 bg-white border border-gray-200 rounded-md">
          {value || "Not provided"}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center py-10 bg-gray-100 min-h-screen">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-8 p-6 bg-white rounded-md shadow-lg md:grid-cols-3">
        {/* Profile Card */}
        <div className="p-6 space-y-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl md:col-span-1">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              Profile Overview
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {editMode ? "Edit your profile" : "Manage your account information"}
            </p>
          </div>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <img
                src={
                  selectedImg ||
                  authUser?.profilePic ||
                  "https://via.placeholder.com/150"
                }
                alt="Profile"
                className="object-cover w-32 h-32 transition-all duration-300 border-4 border-white rounded-full shadow-md group-hover:opacity-90"
              />
              {editMode && (
                <label
                  htmlFor="avatar-upload"
                  className={`absolute inset-0 flex items-center justify-center w-32 h-32 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-30 cursor-pointer transition-all duration-300 ${
                    isUpdatingProfile ? "animate-pulse" : ""
                  }`}
                >
                  <Camera className="w-6 h-6 text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              )}
            </div>
            {editMode && (
              <p className="text-sm text-gray-400">
                {isUpdatingProfile ? "Uploading..." : "Click image to update"}
              </p>
            )}
          </div>

          {/* Profile Info */}
          <div className="space-y-4">
            <ProfileInfoItem
              icon={<User className="w-4 h-4" />}
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              editMode={editMode}
            />
            <ProfileInfoItem
              icon={<Mail className="w-4 h-4" />}
              label="Email Address"
              name="email"
              value={formData.email}
              editMode={editMode}
            />
            <ProfileInfoItem
              icon={<MapPin className="w-4 h-4" />}
              label="Location"
              name="location"
              value={formData.location}
              editMode={editMode}
            />
            <ProfileInfoItem
              icon={<Phone className="w-4 h-4" />}
              label="Phone Number"
              name="phone"
              value={formData.phone}
              editMode={editMode}
            />
          </div>
        </div>

        {/* Account Actions Card */}
        <div className="p-6 space-y-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl md:col-span-2">
          <h2 className="text-xl font-semibold text-gray-800">
            Account Settings
          </h2>

          {editMode ? (
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSubmit}
                disabled={isUpdatingProfile}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isUpdatingProfile ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isUpdatingProfile}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
              <button
                onClick={logout}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          )}

          {/* Additional Account Info */}
          <div className="p-4 mt-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800">
              Account Information
            </h3>
            <div className="mt-2 space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Account Created:</span>{" "}
                {new Date(authUser?.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Last Updated:</span>{" "}
                {new Date(authUser?.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Change Password Section */}
          {!editMode && (
            <div className="p-4 mt-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800">
                Security Settings
              </h3>
              <button
                onClick={() => navigate("/change-password")}
                className="px-4 py-2 mt-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Change Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;