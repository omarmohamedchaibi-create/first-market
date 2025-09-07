import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { API_URL } from "./api";

export default function AdminDashboard() {
  const [t] = useTranslation();

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [inStock, setInStock] = useState(true);
  const [description, setDescription] = useState("");

  // Feedback
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // <-- Add this
  const [error, setError] = useState("");

  // Product list states
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Edit modal states
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Fetch all products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const { data } = await axios.get(`${API_URL}/api/products`, {
        withCredentials: true, // 🔥 include cookie
      });
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Add product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSuccessMessage(""); // reset

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔥 include cookie
        body: JSON.stringify({ name, price, image, category, inStock, description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add product");

      setSuccess(true);
      setSuccessMessage("Product add successfully!"); // <-- Set message
      setName("");
      setPrice("");
      setImage("");
      setCategory("");
      setInStock(true);
      setDescription("");

      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Toggle stock
  const handleStockChange = async (productId, newValue) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/api/products/${productId}`,
        { inStock: newValue },
        { withCredentials: true } // 🔥 include cookie
      );
      if (newValue === false) {
        toast.warn("That means your product won't be available for customers");
      }
      setProducts(products.map(p => p._id === productId ? { ...p, inStock: data.inStock } : p));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  // Delete product
  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.delete(`${API_URL}/api/products/${id}`, {
        withCredentials: true, // 🔥 include cookie
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  // Open edit modal
  const openEditModal = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const handleEditChange = (e) => {
    setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
  };

  const updateProductHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${API_URL}/api/products/${editProduct._id}`,
        editProduct,
        { withCredentials: true } // 🔥 include cookie
      );
      setProducts(products.map((p) => (p._id === data._id ? data : p)));
      setShowModal(false);
      setSuccess(true);
      setSuccessMessage("Product edit successfully!"); // <-- Set message
      setEditProduct(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="p-8 text-center">
      {/* --- Add Product Form --- */}
      <h1 className="text-4xl font-bold mb-4 text-blue-600 dark:text-blue-300">
         Welcome Admin!
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-1">
        This is your admin dashboard. Only admins can access this page.
      </p>

      <div className="max-w-xl mx-auto p-8 bg-gray-400 dark:bg-gray-800 rounded-2xl shadow">
        <h2 className="text-3xl font-bold mb-6 dark:text-white">{editProduct ? "Edit Product" : "Add New Product"}</h2>

        {success && <p className="text-green-500 mb-4">{successMessage}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form
  onSubmit={editProduct ? updateProductHandler : handleAddProduct}
  className="space-y-4"
>
  <input
    type="text"
    placeholder="Name"
    value={editProduct ? editProduct.name : name}
    onChange={e =>
      editProduct
        ? setEditProduct({ ...editProduct, name: e.target.value })
        : setName(e.target.value)
    }
    required
    className="w-full p-3 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
  />
  <input
    type="number"
    placeholder="Price"
    value={editProduct ? editProduct.price : price}
    onChange={e =>
      editProduct
        ? setEditProduct({ ...editProduct, price: e.target.value })
        : setPrice(e.target.value)
    }
    required
    className="w-full p-3 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
  />
  <input
    type="text"
    placeholder="Image URL"
    value={editProduct ? editProduct.image : image}
    onChange={e =>
      editProduct
        ? setEditProduct({ ...editProduct, image: e.target.value })
        : setImage(e.target.value)
    }
    required
    className="w-full p-3 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
  />
  <select
    value={editProduct ? editProduct.category : category}
    onChange={e =>
      editProduct
        ? setEditProduct({ ...editProduct, category: e.target.value })
        : setCategory(e.target.value)
    }
    required
    className="w-full p-3 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
  >
    <option value="الكل">{t("general")}</option>
    <option value="الكترونيات">{t("electronics")}</option>
    <option value="ملحقات">{t("accessories")}</option>
    <option value="أثاث">{t("furniture")}</option>
  </select>
  <textarea
    placeholder="Description"
    value={editProduct ? editProduct.description : description}
    onChange={e =>
      editProduct
        ? setEditProduct({ ...editProduct, description: e.target.value })
        : setDescription(e.target.value)
    }
    required
    className="w-full p-3 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
  />
  <div className="flex items-center font-bold text-xl dark:text-white">
    <input
      type="checkbox"
      checked={editProduct ? editProduct.inStock : inStock}
      onChange={e =>
        editProduct
          ? setEditProduct({ ...editProduct, inStock: e.target.checked })
          : setInStock(e.target.checked)
      }
      className="w-5 h-5"
    />
    <label className="ml-2">In Stock</label>
  </div>
  <div className="flex gap-2">
    {editProduct && (
      <button
        type="button"
        onClick={() => {
          setEditProduct(null);
          setSuccess(false); // <-- Reset success when cancelling edit
          setSuccessMessage("");
        }}
        className="bg-gray-500 dark:bg-gray-400 cursor-pointer text-white px-3 py-1 rounded"
      >
        Cancel
      </button>
    )}
    <button
      type="submit"
      
      className={`w-full ${editProduct ? "bg-green-500 hover:bg-green-600" : "bg-blue-600 hover:bg-blue-700"} text-white p-3 rounded`}
    >
      {editProduct ? "Update Product" : "Add Product"}
    </button>
  </div>
</form>
      </div>

      {/* --- Product List --- */}
      <div className="mt-10">
        <h2 className="text-3xl font-bold mb-4 dark:text-white">Products List</h2>
        {loadingProducts ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border ">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 dark:text-white">
                <th className="border p-2">Image</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Stock</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="dark:text-white">
                  <td className="border p-2">
                    <img src={p.image} alt={p.name} className="w-16 h-16 object-cover" />
                  </td>
                  <td className="border p-2">{p.name}</td>
                  <td className="border p-2">${p.price}</td>
                  <td className="border p-2">{p.category}</td>
                   <td className="border p-2"><div className="flex items-center font-bold text-xl dark:text-white">
                     <input
                       type="checkbox"
                       checked={p.inStock}
                       onChange={e => handleStockChange(p._id, e.target.checked)}
                       className="w-5 h-5"
                      />
                    <label className="ml-2">In Stock</label>
                </div></td>
                  <td className="border justify-center">
                    <button onClick={() =>{ setEditProduct(p);  window.scrollTo({ top: 0, behavior: "smooth" });}} className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-3 py-1 m-2 cursor-pointer rounded">Edit</button>
                    <button onClick={()=>deleteHandler(p._id)} className="bg-red-500 hover:bg-red-600  dark:bg-red-700 dark:hover:bg-red-600 text-white px-3 py-1 cursor-pointer rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
