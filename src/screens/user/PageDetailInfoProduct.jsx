import React, { useState, useEffect, useRef } from "react";
import "./style_user_css/style/detailInfoProduct.css";
import StarRatings from "../../components/user/StarRatings";
import formatMoney from "../../utils/formatMoney";
import toast, { Toaster } from "react-hot-toast";
import { addCart } from "../../store/reducer/cartReducer";
import { useDispatch } from "react-redux";

const PageDetailInfoProduct = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const [mainImage, setMainImage] = useState(product?.images?.[0]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantityBuy, setQuantityBuy] = useState(1);
  const [error, setError] = useState("");

  const handleImageClick = (img) => {
    setMainImage(img);
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  // const handleQuantityChange = (event) => {
  //   let value = parseInt(event.target.value, 10);
  //   if (isNaN(value) || value < 1) value = 1;
  //   if (value > product.quantity) value = product.quantity;
  //   setQuantityBuy(value);
  // };

  const handleIncrease = () => {
    setQuantityBuy((prevQuantity) => {
      if (prevQuantity < product?.stock) {
        return prevQuantity + 1;
      }
      return prevQuantity;
    });
  };

  const handleDecrease = () => {
    setQuantityBuy((prevQuantity) => {
      if (prevQuantity > 1) {
        return prevQuantity - 1;
      }
      return prevQuantity;
    });
  };

  useEffect(() => {
    console.log("increa", quantityBuy);
  }, [quantityBuy]);

  const handleAddCart = () => {
    if (!selectedColor) {
      toast.error("Vui lòng chọn màu trước khi thêm giỏ hàng!!!");
      return;
    }
    dispatch(
      addCart({
        _id: product?._id,
        name: product?.name,
        price: product?.price,
        color: selectedColor,
        quantity: quantityBuy,
        discount: product?.coupons?.discount,
      })
    );
    toast.success("Thêm sản phẩm vào giỏ thành công !!!");
    // Nhập đưa đơn hàng vào giỏ
  };

  function mathRating(ratings) {
    let result = 0;
    ratings.map((it) => {
      result += it?.star;
    });
    return result / ratings.length;
  }

  return (
    <div className="containe_detail_product" ref={containerRef}>
      <Toaster className="top-right" />
      <div className="detail_product">
        <div className="det_img_pro">
          <img src={mainImage} alt={product?.name} />
          <div className="det_list_img_pro">
            {product?.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product?.name} thumbnail ${idx}`}
                onClick={() => handleImageClick(img)}
              />
            ))}
          </div>
        </div>
        <div className="info_pro_buy">
          <div className="close_button_pro_buy">
            <button onClick={onClose}>×</button>
          </div>
          <h3>{product?.name}</h3>
          <div className="discount_pro_buy">
            <p>Giá tiền:</p>
            <p>
              <b>{formatMoney(product?.money || 0)}</b>
            </p>
            <p>{formatMoney(product?.price || 0)}</p>
            <p>-{product?.coupons?.discount}%</p>
          </div>
          <div className="color_pro">
            <p>Màu sắc:</p>
            {product?.color?.map((clr, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: clr,
                  border: "2px solid rgb(232 106 106)",
                }}
                className={selectedColor === clr ? "selected-color" : ""}
                onClick={() => handleColorClick(clr)}
              ></span>
            ))}
          </div>
          {/* <div className='size_pro'>Size: {product.sizes.join(', ') || 'N/A'}</div> */}
          <div className="quantity_pro">
            <p>Số lượng mua: </p>
            <span onClick={handleDecrease}>-</span>
            <input
              type="number"
              value={quantityBuy}
              onChange={(e) => {
                let value = parseInt(e.target.value, 10);
                if (isNaN(value) || value < 1) value = 1;
                if (value > product?.quantity) value = product?.quantity;
                setQuantityBuy(value);
              }}
              min="1"
              max={product?.quantity}
            />
            <span onClick={handleIncrease}>+</span>
            {/* <p>Available Quantity: {product.quantity}</p> */}
            {/* {error && <p className="error-message">{error}</p>} */}
          </div>
          <div className="sold_pro_new">
            <span>Số lượng đã bán:</span>
            <span>{product?.sold}</span>
          </div>
          <div className="description_pro">
            <p>Mô tả sản phẩm:</p>
            <div>
              <p dangerouslySetInnerHTML={{ __html: product?.description }} />
            </div>
          </div>
          <div className="rating_pro">
            <p>Đánh giá sản phẩm:</p>
            <div>
              <StarRatings rating={mathRating(product?.ratings)} />
              {`(${product?.totalRatings})`}
            </div>
          </div>
          <div className="button_pro_buy">
            {/* Tạo component ngoàichỉ để add sản phẩm */}
            <button onClick={handleAddCart}>Thêm vào giỏ hàng</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageDetailInfoProduct;
