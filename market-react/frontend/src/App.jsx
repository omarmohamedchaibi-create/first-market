import ProductCard from "./ProductCard";
import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import ProductDetails from "./ProductDetails";
import CartPage from "./Cartpage";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './index.css';
import { Moon , Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import Login from "./Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./AdminDashboard";
import axios from "axios";
import { useAuth } from "./context/AuthContext"; // لتأكيد أن المشرف فقط من يرى الزر
import { API_URL } from "./api";

function App() {
  const { userInfo } = useAuth();


  const [Cart,setCart]=useState(()=>{
    const savedCart=localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart):[];
});
  const [searchTerm,setSearchTerm]=useState("");
  const [category,setCategory]=useState("الكل");
  const [maxprice,setMaxprice]=useState("");
  const [minprice,setMinprice]=useState("");

  const [theme, setTheme] = useState(() => {
  return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
  localStorage.setItem("theme", theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
    

   const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };

    fetchProducts();
  }, []);

 
  

  useEffect(() => {
  const timer = setTimeout(() => {
    localStorage.setItem("cart", JSON.stringify(Cart));
  }, 300); // يحفظ بعد 300ms من آخر تغيير

  return () => clearTimeout(timer);
}, [Cart]);


  
  function addToCart(product){
    const aleardyincart=Cart.some(item=>item._id===product._id);
    if(!aleardyincart){
    setCart([...Cart,product]);
    toast.success(`✅ تم إضافة ${product.name} إلى السلة`)
  }
    else{
      toast.info(t("alreadyInCart"))
    }
}
  function ClearCart(){
    setCart([]);
  }
  function RemoveFromCart(index){
    setCart(Cart.filter((_,i)=>i!==index));
  }
  
  const totalprice=Cart.reduce((sum,item)=>sum+item.price,0);

  const filteredProducts = products.filter(product => {
  const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesCategory =
    category === "الكل" || product.category === category;

  const matchesMin = minprice === "" || product.price >= parseInt(minprice);
  const matchesMax = maxprice === "" || product.price <= parseInt(maxprice);

  return matchesSearch && matchesCategory && matchesMin && matchesMax;
});

const toggletheme = ()=>{
  const newtheme=theme==="light" ? "dark" : "light";
  setTheme(newtheme);
  

}
const [t,i18n] = useTranslation();


  return (
      <>
      <div  className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-6">
    <header className="bg-gray-400 dark:bg-gray-800 shadow-lg rounded-2xl sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row-reverse items-center sm:justify-between gap-y-2 gap-x-4">
    {/* اسم المتجر */}
    <div className="flex flex-row-reverse items-center gap-4 mb-2 sm:mb-0">
      <h1 className="text-2xl font-bold text-black dark:text-white tracking-wide">
        {t("welcome")}
      </h1>
      <button
        onClick={() => i18n.changeLanguage("en")}
        className="transition-all ease-in-out shadow-md text-sm cursor-pointer bg-gray-300 dark:bg-gray-800 text-black dark:text-white px-2 py-1 rounded-full"
      >
        En
      </button>
      <button
        onClick={() => i18n.changeLanguage("ar")}
        className="transition-all ease-in-out shadow-md text-sm cursor-pointer bg-gray-300 dark:bg-gray-800 text-black dark:text-white px-2 py-1 rounded-full"
      >
        ع
      </button>
    </div>

    {/* روابط التنقل */}
    <nav className="flex flex-wrap gap-4 sm:gap-6 items-center justify-center">
      <Link to="/" className="text-black hover:text-gray-700 dark:text-gray-300 font-bold dark:hover:text-white transition text-xl">
        {t("home")}
      </Link>
      <Link to="/login" className="text-black hover:text-gray-700 dark:text-gray-300 font-bold dark:hover:text-white transition text-xl">
        Login   |
      </Link>
      <Link to="/cart"
        className="font-bold bg-indigo-800 dark:bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm transition"
      >
        {t("cart")}
      </Link>
      {userInfo?.isAdmin &&
        <Link to="/AdminDashboard" className="text-black hover:text-gray-700 dark:text-gray-300 font-bold dark:hover:text-white transition text-xl">
          ADMIN
        </Link>
      }
      <button onClick={toggletheme} className="rounded-full p-2 shadow-md shadow-black dark:shadow-purple-400 cursor-pointer text-gray-700 hover:text-black dark:hover:text-purple-400 transition-all ease-in-out">
        {theme === "light" ? <Moon /> : <Sun />}
      </button>
    </nav>
  </div>
</header>

    <Routes>

    <Route
    path="/AdminDashboard"
     element={
      <ProtectedRoute adminOnly={true}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
   <Route path="/login" element={<Login />} />
  <Route path="/" element={
    
    <div  >
      <div className="flex flex-col justify-start sm:flex-row   gap-4 items-center mt-3 mb-1">
        
  {/* البحث */}
  <input
    type="text"
    placeholder={t("search")}
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full md:w-80 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 dark:focus:ring-indigo-500 transition"
  />
  
  {/* تصفية الفئة */}
<select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="bg-gray-200 dark:bg-gray-800 text-black text-md dark:text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:focus:ring-indigo-500 transition"
>
  <option value="الكل">{t("catg")}</option>
  <option value="الكترونيات">{t("electronics")}</option>
  <option value="ملحقات">{t("accessories")}</option>
  <option value="أثاث">{t("furniture")}</option>
</select>


  {/* تصفية السعر */}
  
  <input 
    type="number"
    placeholder={t("prmin")}
    value={minprice}
    onChange={(e) => setMinprice(e.target.value)}
     className="w-32 px-3 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white border border-gray-600 rounded-md focus:ring-gray-800 dark:focus:ring-indigo-500 focus:ring-2 focus:outline-none transition"
  />

  <input
    type="number"
    placeholder={t("prmax")}
    value={maxprice}
    onChange={(e) => setMaxprice(e.target.value)}
    className="w-32 px-3 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white border border-gray-600 rounded-md focus:ring-gray-800 dark:focus:ring-indigo-500 focus:ring-2 focus:outline-none transition"
  />
</div>

      <div>
        
       <h2 className="text-lg font-bold text-black dark:text-white mb-2">🛒 {t("cart")}: {Cart.length} {t("pro")}</h2>
       <p className="text-green-600 dark:text-green-400 font-semibold mb-3">💰 {t("ttl")}: {totalprice} {t("da")}</p>
       {Cart.length >0 &&(
        <button onClick={ClearCart} className="bg-red-600 dark:bg-red-900 text-black dark:text-white py-2 px-4 rounded hover:bg-red-700 dark:hover:bg-red-800 transition">🗑️ {t("eb")}</button>
       )}
       
       <details className="mb-2 dark:bg-gray-900 border border-transparent dark:open:border-black/10 dark:open:bg-gray-800 dark:text-white text-xl rounded-2xl transition-all">
        <summary>{t("your products..")}</summary>
       {Cart.length > 0 ? (
        <ul>
        {Cart.map((item, index) => (
          <li key={index}>
            {item.name} - {item.price} {t("da")}
            <button onClick={()=>RemoveFromCart(index)}>❌</button>
          </li>
        ))}
      </ul>
      
       ) : (
      <p className="dark:text-white mb-2">{t("cartEmpty")}</p>
       )}
</details>
    <div  className=" grid grid-cols-1 sm:grid-cols-2   md:grid-cols-3 gap-6">
      {filteredProducts.filter(product => product.inStock === true).length > 0 ? (
        filteredProducts
          .filter(product => product.inStock === true)
          .map(product => (
            <div key={product._id} className="relative">
              <ProductCard
                id={product._id}
                name={product.name}
                price={product.price}
                image={product.image}
                addcart={() => addToCart(product)}
              />
            </div>
          ))
      ) : (
        <h3 className="text-xl font-bold dark:text-white mb-2">{t("No Results ❌")}</h3>
      )}
    </div>
    </div>
    </div>} />
    

  <Route path="/product/:id" element={
    <ProductDetails products={products} />
  } />
    <Route
    path="/cart"
    element={
      <CartPage
        cart={Cart}
        removeFromCart={RemoveFromCart}
        clearCart={ClearCart}
      />
    }
  />
</Routes>
<ToastContainer />
</div>
</div>
</>
  );
}

export default App;
