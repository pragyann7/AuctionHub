import { useState } from "react";
import axiosInstance from "../API/axiosInstance";

export default function DeleteProduct() {
    const [productId, setProductId] = useState("");
    const [message, setMessage] = useState("");

    const handleDelete = async () => {
        if (!productId) {
            setMessage("Please enter a product ID.");
            return;
        }

        try {
            const response = await axiosInstance.delete(`auctions/${productId}/`);

            setMessage(`Product with ID ${productId} deleted successfully!`);
            setProductId("");
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setMessage("Product not found.");
            } else {
                setMessage("Failed to delete the product.");
            }
            console.error(error);
        }
    };


    return (
        <div className="p-4 max-w-sm mx-auto bg-white shadow-md rounded-md">
            <h2 className="text-lg font-bold mb-4">Delete Product</h2>
            <input
                type="text"
                placeholder="Enter Product ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="border rounded-md px-3 py-2 w-full mb-3"
            />
            <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
                Delete
            </button>
            {message && <p className="mt-3 text-sm">{message}</p>}
        </div>
    );
}
