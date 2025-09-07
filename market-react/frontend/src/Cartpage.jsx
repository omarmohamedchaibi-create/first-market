import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";



function CartPage({ cart, removeFromCart, clearCart }) {
  const navigate = useNavigate();
  const [t,i18n]=useTranslation();

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const handlecheckout=()=>{
    if(cart.length===0){
      toast.warning(t("emptyOrder"));
      return;
    }
    toast.success(t("successOrder"));
    clearCart();
    navigate("/");
  }

  return (
    <div className="container text-center bg-white dark:bg-gray-900 min-h-screen relative">
      <h2 className="text-2xl font-bold text-black dark:text-white m-4">{t("cartContent")}</h2>
      {cart.length > 0 ? (
        <>
          <ul>
            {cart.map((item, index) => (
              <li key={index} className="text-lg font-bold text-black dark:text-white mb-2">
                {item.name} - {item.price} دج
                <button onClick={() => removeFromCart(index)} className="cursor-pointer mx-2"> ❌</button>
              </li>
            ))}
          </ul>
          <p className="text-xl font-bold pt-3 pb-8 text-green-600 dark:text-green-400 ">💰 {t("ttl")}: {totalPrice} دج</p>
          <button onClick={clearCart} className="fixed left-4 bottom-4 bg-red-900 text-white ml-52 py-2 px-3 rounded hover:bg-red-800 transition  cursor-pointer">{t("clearCart")}</button>
        </>
      ) : (
        <p className="text-lg font-bold text-black dark:text-white mb-2">{t("cartEmpty")}</p>
      )}

      <br />
      <div className="flex flex-col items-center gap-4 mb-2">
        <button
          onClick={handlecheckout}
          className="w-sm md:w-xl my-3 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-bold text-lg transition cursor-pointer"
        >
          {t("checkout")}
        </button>
      </div>

      {/* Fixed button in bottom left */}
      <button
        onClick={() => navigate("/")}
        className="fixed left-4 bottom-4 w-48 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500 transition p-1 cursor-pointer z-50"
      >
        {t("backToProducts")}
      </button>
    </div>
  );
}

export default CartPage;
