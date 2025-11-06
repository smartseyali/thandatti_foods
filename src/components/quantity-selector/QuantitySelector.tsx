"use client"
import { updateQuantity } from "@/store/reducer/cartSlice";
import { useDispatch } from "react-redux";

const QuantitySelector = ({
  id,
  quantity,
  setQuantity,
}: {
  id: number;
  quantity: number;
  setQuantity?: any;
}) => {
  const dispatch = useDispatch();

  const handleQuantityChange = (operation: "increase" | "decrease") => {
    let newQuantity = quantity;
    if (operation === "increase") {
      newQuantity = quantity + 1;
    } else if (operation === "decrease" && quantity > 1) {
      newQuantity = quantity - 1;
    }
    if (undefined !== setQuantity) {
      setQuantity(newQuantity);
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  return (
    <>
      <div className='bb-qtybtn'
        onClick={() => handleQuantityChange("decrease")}
      >
        -
      </div>
      <input
        readOnly
        className="qty-input location-select"
        type="text"
        name="gi-qtybtn"
        value={quantity}
      />
      <div className='bb-qtybtn'
        onClick={() => handleQuantityChange("increase")}
      >
        +
      </div>
    </>
  );
};

export default QuantitySelector;
