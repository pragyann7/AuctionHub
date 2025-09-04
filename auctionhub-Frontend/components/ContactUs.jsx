import React, { useState } from "react";
import { PhoneCall, Mail, MapPin, Shield, ChevronDown } from "lucide-react";

const ContactUs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { question: "01 How will I know if I won?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { question: "02 What if I miss the end of the auction?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { question: "03 How do I contact support?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { question: "04 What happens if there’s a problem with a buyer or seller?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { question: "05 How will I know if I won?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white-100 min-h-screen font-sans text-gray-900">
      {/* Get in Touch Section */}
      <section className="bg-gray-100 p-6 rounded-lg mx-auto max-w-6xl mt-10 shadow-md">
        <h2 className="text-4xl font-bold mb-4">Get in Touch with Us</h2>
        <p className="text-gray-600 mb-6">
          Your questions and special requests are always welcome. We are here to help. Whether you're interested in learning more about our services or need support, we're happy to assist you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side: Location and Contact */}
          <div className="space-y-6">
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
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Tell Us What You Need</h3>
            <p className="text-gray-600 mb-4">
              Our team is ready to assist you with every detail big or small
            </p>
            <form className="space-y-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-1/2 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-1/2 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="NP +977 - XXX-XXXXXXX"
                  className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <textarea
                  placeholder="Hello AuctionHub Team, |"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 resize-none"
                ></textarea>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-600">
                <p>Attach File <span className="text-orange-500">(Optional)</span></p>
                <p className="text-sm">Click or drag and drop to upload your file</p>
                <p className="text-xs">PNG, JPG, PDF, GIF, SVG (MAX 5 MB)</p>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4 border-gray-400 rounded focus:ring-orange-500" />
                <span className="text-sm text-gray-600">
                  I've read and agree to <a href="#" className="text-orange-500">AuctionHub Terms & Conditions</a>
                </span>
              </div>
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

      {/* Frequently Asked Questions Section */}
      <section className="bg-white p-6 rounded-lg mx-auto max-w-6xl mt-10 shadow-md mb-10">
        <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
        <p className="text-gray-600 mb-4">
          Contact us if you still have any questions to make your experience smoother.
        </p>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-300 rounded-lg">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="p-4 border-t text-gray-600">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
