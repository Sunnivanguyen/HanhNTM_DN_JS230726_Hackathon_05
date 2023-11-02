import { useEffect, useState } from "react";

import axios from "axios";

import Header from "./components/Header";

// const port = process.env.REACT_APP_PORT;
// console.log(port);

function App() {
  const [products, setProduct] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const initalMoneyAmount = 1000000000000;
  const [moneyAmount, setMoneyAmount] = useState(initalMoneyAmount);

  async function fetchProducts() {
    try {
      const response = await axios.get("http://localhost:7000/api/v1/products");
      setProduct(response.data.data.products);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function handleSell(amount) {
    console.log("sell");
    setMoneyAmount((prevAmount) => prevAmount + amount);
  }

  function handleBuy(amount) {
    if (amount > moneyAmount) {
      alert("Not enough money");
      return;
    }
    if (amount < 0) {
      alert("Invalid amount");
      return;
    }
    console.log("buy");
    setMoneyAmount((prevAmount) => prevAmount - amount);
  }

  return (
    <>
      <Header moneyAmount={moneyAmount} initalMoneyAmount={initalMoneyAmount} />
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                  src={product.image}
                  alt={product.alt}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex flex-col justify-between gap-3">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-sm font-medium text-gray-900">
                    {product.price} $
                  </p>
                </div>
                <div className="mx-5 flex justify-between">
                  <button
                    className="bg-rose-700 text-white px-4 py-2 rounded-md"
                    onClick={() => handleSell(product.price)}
                  >
                    Sell
                  </button>
                  <button
                    className="bg-lime-500 text-white px-4 py-2 rounded-md"
                    onClick={() => handleBuy(product.price)}
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
