import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function ProductCard(props) {
  const [t,i18n] = useTranslation();
  return (
    <div className="w-75 h-90 bg-gradient-to-r from-gray-300 to-gray-400 dark:bg-none dark:bg-gray-800  rounded-xl shadow  p-4 hover:shadow-xl dark:hover:shadow-lg transform hover:-translate-y-1 transition duration-300 dark:hover:bg-gray-700">
      {/* فقط الصورة والاسم داخل <Link> */}
      <Link to={`/product/${props.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <div className="h-50  overflow-hidden flex items-center justify-center mb-4 rounded-xl bg-center">
        <img className="bg-center max-w-full h-full rounded-xl"
          src={props.image} 
          alt={props.name} 
           
        /></div>
        <h3 className="text-lg font-bold dark:text-white mb-2">{props.name}</h3>
        <p  className="text-green-600 dark:text-green-400 font-semibold mb-3">{props.price} {t("da")}</p>
      </Link>

      {/* الزر خارج الرابط، يعمل بشكل مستقل */}
      <button onClick={props.addcart} className="bg-indigo-900 dark:bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 dark:hover:bg-indigo-500 transition">{t("addToCart")}</button>
    </div>
  );
}

export default ProductCard;

