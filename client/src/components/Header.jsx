import React from "react";

const Header = ({ moneyAmount, initalMoneyAmount }) => {
  return (
    <header className="bg-gray-900 w-full ">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <h3 className="text-white">
          Remaining :{" "}
          <span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(moneyAmount)}
          </span>{" "}
        </h3>
        <h3 className="text-white">
          You only spent <span>{moneyAmount / initalMoneyAmount}</span> % of the
          total
        </h3>
      </div>
    </header>
  );
};

export default Header;
