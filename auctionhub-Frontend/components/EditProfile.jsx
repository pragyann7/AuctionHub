import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useState, useEffect, useContext } from "react";
import axiosInstance from "../API/axiosInstance";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function EditProfile() {
    const { user, updateUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        about: "",
        firstName: "",
        lastName: "",
        email: "",
        country: "United States",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        notifications: {
            comments: true,
            candidates: false,
            offers: false,
        },
        push: "everything",
        phone_number: "",
    });

    const [profilePhoto, setProfilePhoto] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const handleProfilePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // create a preview URL
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        }
    };

    // Fetch user data from context or API
    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                username: user.username || "",
                firstName: user.first_name || "",
                lastName: user.last_name || "",
                email: user.email || "",
                about: user.about || "",
                country: user.country || "United States",
                street: user.street || "",
                city: user.city || "",
                state: user.state || "",
                postalCode: user.postalCode || "",
                phone_number: user.phone_number || "",
            }));
        } else {
            axiosInstance
                .get("users/me/")
                .then((res) => {
                    const data = res.data;
                    setFormData((prev) => ({
                        ...prev,
                        username: data.username || "",
                        firstName: data.first_name || "",
                        lastName: data.last_name || "",
                        email: data.email || "",
                        about: data.about || "",
                        country: data.country || "United States",
                        street: data.street || "",
                        city: data.city || "",
                        state: data.state || "",
                        postalCode: data.postalCode || "",
                        phone_number: data.phone_number || "",
                    }));
                })
                .catch((err) => console.error(err));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                notifications: { ...prev.notifications, [name]: checked },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // const handleProfilePhotoChange = (e) => setProfilePhoto(e.target.files[0]);
    const handleCoverPhotoChange = (e) => setCoverPhoto(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (key !== "notifications") { // skip nested objects if any
                data.append(key, value || "");
            }
        });

        if (profilePhoto) data.append("profile_picture", profilePhoto);
        if (coverPhoto) data.append("cover_photo", coverPhoto);

        try {
            const res = await axiosInstance.put("edit-profile/", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Update context with the new user data
            updateUserProfile(res.data);

            setFormData(prev => ({ ...prev, ...res.data }));


            navigate("/userprofile");
        } catch (err) {
            console.error(err);
            alert(
                err.response?.data
                    ? JSON.stringify(err.response.data)
                    : "Error updating profile"
            );
        }
    };


    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto p-6 space-y-12 bg-white rounded-xl shadow-md"
        >
            <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-900 text-center">
                    Profile Photo
                </label>
                <div className="flex flex-col items-center justify-center gap-4 mt-4">
                    {/* If user selected an image, show it */}
                    {previewImage ? (
                        <img
                            src={previewImage}
                            alt="Profile Preview"
                            className="h-50 w-50 rounded-full object-cover"
                        />
                    ) : (
                        <UserCircleIcon className="h-50 w-50 text-gray-300" />
                    )}

                    <label className="px-4 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50 text-sm font-medium cursor-pointer">
                        Change
                        <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleProfilePhotoChange}
                        />
                    </label>
                </div>
            </div>

            {/* Profile Section */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
                <p className="mt-1 text-sm text-gray-600">
                    This information will be displayed publicly.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-6 sm:gap-6">
                    {/* Username */}
                    <div className="sm:col-span-4">
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-900"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="janesmith"
                            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    {/* About */}
                    <div className="sm:col-span-6">
                        <label
                            htmlFor="about"
                            className="block text-sm font-medium text-gray-900"
                        >
                            About
                        </label>
                        <textarea
                            id="about"
                            name="about"
                            rows={3}
                            value={formData.about}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                        <p className="mt-1 text-sm text-gray-600">
                            Write a few sentences about yourself.
                        </p>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                    Personal Information
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Use a permanent address where you can receive mail.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-6 sm:gap-6">
                    {/* First name */}
                    <div className="sm:col-span-3">
                        <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-gray-900"
                        >
                            First name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    {/* Last name */}
                    <div className="sm:col-span-3">
                        <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-gray-900"
                        >
                            Last name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    {/* Email */}
                    <div className="sm:col-span-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-900"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            disabled
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-2 cursor-not-allowed block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    {/* Phone */}
                    <div className="sm:col-span-3">
                        <label
                            htmlFor="phone_number"
                            className="block text-sm font-medium text-gray-900"
                        >
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="phone_number"
                            id="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    {/* Country */}
                    <div className="sm:col-span-3 relative">
                        <label
                            htmlFor="country"
                            className="block text-sm font-medium text-gray-900"
                        >
                            Country
                        </label>
                        <div className="mt-2 relative">
                            <select
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            >
                                <option>United States</option>
                                <option>Canada</option>
                                <option>Mexico</option>
                            </select>
                            <ChevronDownIcon
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        </div>
                    </div>

                    {/* Street */}
                    <div className="sm:col-span-6">
                        <label
                            htmlFor="street"
                            className="block text-sm font-medium text-gray-900"
                        >
                            Street Address
                        </label>
                        <input
                            type="text"
                            name="street"
                            id="street"
                            value={formData.street}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    {/* City */}
                    <div className="sm:col-span-2">
                        <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-900"
                        >
                            City
                        </label>
                        <input
                            type="text"
                            name="city"
                            id="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    {/* State */}
                    <div className="sm:col-span-2">
                        <label
                            htmlFor="state"
                            className="block text-sm font-medium text-gray-900"
                        >
                            State / Province
                        </label>
                        <input
                            type="text"
                            name="state"
                            id="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    {/* Postal Code */}
                    <div className="sm:col-span-2">
                        <label
                            htmlFor="postalCode"
                            className="block text-sm font-medium text-gray-900"
                        >
                            ZIP / Postal Code
                        </label>
                        <input
                            type="text"
                            name="postalCode"
                            id="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>
                </div>
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                    type="button"
                    onClick={() => navigate("/userprofile")}
                    className="w-full sm:w-auto text-gray-900 font-semibold border rounded-md px-4 py-2 cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="w-full sm:w-auto bg-orange-500 text-white px-4 py-2 rounded-md shadow hover:bg-orange-600 cursor-pointer"
                >
                    Save
                </button>
            </div>
        </form>
    );
}
