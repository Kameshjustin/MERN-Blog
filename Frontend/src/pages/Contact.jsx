import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    submitted: false,
    error: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, submitted: false, error: null });

    // Basic Validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ loading: false, submitted: false, error: "All fields are required." });
      return;
    }

    try {
      // Replace with your actual Backend API URL
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({ loading: false, submitted: true, error: null });
        setFormData({ name: "", email: "", message: "" });
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to send message.");
      }
    } catch (err) {
      setStatus({ loading: false, submitted: false, error: err.message });
    }
  };

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        Contact Us
      </h1>

      <div className="max-w-lg mx-auto bg-white p-8 shadow-lg rounded-xl border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="John Doe"
              disabled={status.loading}
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="john@example.com"
              disabled={status.loading}
            />
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="5"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="How can we help you?"
              disabled={status.loading}
            ></textarea>
          </div>

          {/* Status Messages */}
          {status.error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {status.error}
            </div>
          )}
          
          {status.submitted && (
            <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm text-center">
              Message sent successfully! We'll get back to you soon.
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status.loading}
            className={`w-full py-3 rounded-md text-white font-bold transition-all duration-300 ${
              status.loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
            }`}
          >
            {status.loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
