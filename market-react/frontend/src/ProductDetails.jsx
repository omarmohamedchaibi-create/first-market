import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { API_URL } from "./api";

function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [t,i18n] = useTranslation();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/products/` + id);
        setProduct(data);
      } catch (err) {
        setError("تعذر تحميل المنتج 😢");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>⏳ جاري تحميل المنتج...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>❌ المنتج غير موجود</p>;

  return (
    <div className="p-8 text-center dark:text-white">
      <h2 className="m-2 text-2xl">{product.name}</h2>
      <img className="mx-auto block mb-1" src={product.image} alt={product.name} style={{ width: "300px" }} />
      <p className="text-xl  font-bold  text-green-600 dark:text-green-400 mb-2">💰 السعر: {product.price} دج</p>
      <p className="mb-4 text-xl">{product.description}</p>
      <button onClick={() => navigate("/")} className="fixed left-4 bottom-0 w-48 bg-indigo-600 text-white my-10 py-2 rounded hover:bg-indigo-500 transition cursor-pointer">{t("backToProducts")}</button>
    </div>
  );
}

export default ProductDetails;
