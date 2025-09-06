import React, { useState, useRef } from "react";
import { PhoneCall, Mail, MapPin, Shield } from "lucide-react";
import FAQ from "./FAQ.jsx";
import axiosInstance from "../API/axiosInstance";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "Hello AuctionHub Team, ",
    file: null,
  });

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeToTerms) {
      alert("Please agree to the Terms & Conditions");
      return;
    }

    const data = new FormData();
    data.append("first_name", formData.firstName);
    data.append("last_name", formData.lastName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("message", formData.message);
    if (formData.file) data.append("file", formData.file);

    try {
      const _response = await axiosInstance.post("/api/contact/submit/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Message sent successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
        file: null,
      });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        alert("You must be logged in to submit a message!");
      } else {
        alert(
          "Error submitting form: " +
            JSON.stringify(err.response?.data || err.message)
        );
      }
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setFormData((prev) => ({ ...prev, file: e.dataTransfer.files[0] }));
    }
  };
  const handleFileClick = () => fileInputRef.current.click();

  return (
    <div className="bg-white-100 min-h-screen font-sans text-gray-900">
      {/* Get in Touch Section */}
      <section className="bg-gray-100 p-6 rounded-lg mx-auto max-w-6xl mt-10 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold mb-4">Get in Touch with Us</h2>
            <p className="text-gray-600 mb-4 text-base leading-relaxed">
              Your questions and special requests are always welcome. We are here
              to help.
            </p>
            <p className="text-gray-600 mb-16 text-base leading-relaxed">
              Whether you're interested in learning more about our services or
              need support, we're happy to assist you.
            </p>
            <div>
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p className="text-gray-600">Mars - Valles Marineris Outpost</p>
              <p className="text-gray-600">Delta</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-600">auctionhub@help.com</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Contact</h3>
              <p className="text-gray-600">+977 XX XXXXXXX</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Social Media</h3>
              <p className="text-gray-600">X</p>
              <p className="text-gray-600">Facebook</p>
              <p className="text-gray-600">Discord</p>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="bg-white p-6 rounded-lg border-1 shadow-inner">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Tell Us What You Need
            </h3>
            <p className="text-gray-600 mb-4">
              Our team is ready to assist you with every detail big or small
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2 ml-1">
                  Full name
                </label>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-1/2 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-1/2 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2 ml-1">
                  Phone Number{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="flex w-full space-x-2 overflow-hidden">
                  <select className="px-3 py-2.5 text-sm rounded-l-full border border-r-0 border-gray-300 bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none w-28">
                    <option value="+977">NP +977</option>
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="XXX-XXXXXXX"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="flex-1 min-w-0 px-3 py-2.5 border border-gray-300 rounded-r-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2 ml-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-24"
                  required
                ></textarea>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2 ml-1">
                  Attach File{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg py-8 text-center text-gray-600 cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={handleFileClick}
                >
                  <p className="text-sm">
                    Click or drag and drop to upload your file
                  </p>
                  <p className="text-xs">
                    PNG, JPG, PDF, GIF, SVG (MAX 5 MB)
                  </p>
                  <input
                    type="file"
                    name="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.svg"
                    className="hidden"
                  />
                  {formData.file && (
                    <p className="text-orange-500 font-medium mt-2 text-xs">
                      Selected: {formData.file.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mr-2 h-4 w-4 border-gray-400 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-600">
                  I've read and agree to{" "}
                  <a href="#" className="text-orange-500">
                    AuctionHub Terms & Conditions
                  </a>
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition duration-200"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Customer Services Section */}
      <section className="bg-white p-6 rounded-lg mx-auto max-w-6xl mt-10 shadow-md">
        <h2 className="text-4xl font-bold mb-6">Customer Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   {[
            {
              title: "Book a call",
              desc: "Schedule a 15 min call with available agents",
              icon: <PhoneCall className="w-8 h-8 text-orange-500 mb-3 mx-auto" />,
            },
            {
              title: "Send a mail",
              desc: "Send an email to support@auctionhub.com",
              icon: <Mail className="w-8 h-8 text-orange-500 mb-3 mx-auto" />,
            },
            {
              title: "Visit us",
              desc: "Visit our office HQ",
              icon: <MapPin className="w-8 h-8 text-orange-500 mb-3 mx-auto" />,
            },
            {
              title: "Privacy choices",
              desc: "Manage Consent Preferences",
              icon: <Shield className="w-8 h-8 text-orange-500 mb-3 mx-auto" />,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="text-center p-6 bg-gray-50 rounded-lg border border-gray-300"
            >
              {item.icon}
              <h4 className="font-semibold text-gray-900">{item.title}</h4>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white p-6 rounded-lg mx-auto max-w-6xl mt-10 shadow-md">
        <FAQ />
      </section>
    </div>
  );
};

export default ContactUs;

