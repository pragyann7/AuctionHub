import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axiosInstance from "../API/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function BecomeSellerPage() {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [shopName, setShopName] = useState("");
    const [businessAddress, setBusinessAddress] = useState("");
    const [bankAccount, setBankAccount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!shopName || !businessAddress || !bankAccount) {
            setError("Please fill all required fields.");
            setLoading(false);
            return;
        }

        try {
            await axiosInstance.post("/become-seller/", {
                shop_name: shopName,
                business_address: businessAddress,
                bank_account: bankAccount,
            });

            const res = await axiosInstance.get("/users/me/");
            setUser(res.data);

            alert("You are now a seller!");
            navigate("/");
        } catch (err) {
            console.error(err);
            setError("Could not become seller. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl w-full max-w-md shadow-lg"
            >
                <h1 className="text-2xl font-bold mb-6 text-center">Become a Seller</h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <label className="block mb-2 font-medium">Shop Name</label>
                <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full border px-3 py-2 rounded mb-4"
                    placeholder="Your shop name"
                />

                <label className="block mb-2 font-medium">Business Address</label>
                <input
                    type="text"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    className="w-full border px-3 py-2 rounded mb-4"
                    placeholder="Shop address"
                />

                <label className="block mb-2 font-medium">Bank Account</label>
                <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full border px-3 py-2 rounded mb-6"
                    placeholder="Bank account number"
                />

                <button
                    type="submit"
                    className="w-full py-2 rounded bg-orange-500 text-white hover:bg-orange-600 font-medium"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    );
}
