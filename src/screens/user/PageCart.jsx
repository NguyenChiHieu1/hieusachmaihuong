import "./style_user_css/style/cart.css";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  incQuantity,
  decQuantity,
  removeItem,
  toggleSelectItem,
  applyCouponToItem,
  checkoutSelectedItems,
  checkAll,
} from "../../store/reducer/cartReducer";
import { useSendPaymentMutation } from "../../store/service/paymentService";
import formatMoney from "../../utils/formatMoney";
import Wrapper from "../../components/user/Wrapper";
import Payment from "./Payment";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";

const PageCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let checkLogin = useSelector((state) => state.authReducer.userToken);
  let checkBlock = useSelector((state) => state.authReducer.info);
  let cartPayment = useSelector((state) => state.cartReducer.cart);
  let cartSelectPayment = useSelector(
    (state) => state.cartReducer.selectedCart
  );
  let totalPayment = useSelector((state) => state.cartReducer.total);
  let totalSelectPayment = useSelector(
    (state) => state.cartReducer.selectedTotal
  );

  const [data, { isLoading, error }] = useSendPaymentMutation();
  const { cart, items, total, selectedTotal, selectedItem } = useSelector(
    (state) => state.cartReducer
  );
  const [couponCodes, setCouponCodes] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("");
  const [checkALlItem, setCheckALlItem] = useState(false);

  // const handleCouponChange = (id, code) => {
  //   setCouponCodes({
  //     ...couponCodes,
  //     [id]: code,
  //   });
  // };

  // const handleApplyCoupon = (id) => {
  //   const coupon = couponCodes[id];
  //   if (coupon) {
  //     dispatch(
  //       applyCouponToItem({ id, coupon: { code, discountPercentage: 10 } })
  //     );
  //   }
  // };
  const handleAllCheck = () => {
    dispatch(checkAll(!checkALlItem));
    setCheckALlItem(!checkALlItem);
  };

  const handleCheckboxChange = (item) => {
    dispatch(toggleSelectItem(item));
    setCheckALlItem(false);
    console.log("selectedTotal: ", selectedTotal);
  };

  const [isFormVisible, setFormVisible] = useState();

  const handleCheckOut = async () => {
    if (!checkLogin) {
      navigate("/user/login");
      return;
    }
    console.log("checkBlock", checkBlock);
    if (checkBlock.isBlock) {
      alert(
        "Tài khoản bạn đang bị khóa, vui lòng liên hệ cửa hàng để mở khóa trước khi giao dịch!!!"
      );
      return;
    }
    if (cartSelectPayment.length <= 0) {
      toast.error("Vui lòng chọn sản phẩm trong giỏ trước để thanh toán!!!");
      return;
    }
    switch (paymentMethod) {
      case "COD":
        // console.log(paymentMethod);
        if (cartSelectPayment.length > 0) cartPayment = cartSelectPayment;
        if (totalSelectPayment.length > 0) totalPayment = totalSelectPayment;
        setFormVisible(cartPayment);
        localStorage.setItem("cart_buy", JSON.stringify(cartPayment));
        // toast.success(
        //   "Phương thức thanh toán này đang bảo trì. Quý khách vui lòng chọn phương thức khác thanh toán. Chân thành cảm ơn."
        // );
        break;
      case "bank_transfer":
        // console.log(paymentMethod);
        if (cartSelectPayment.length > 0) cartPayment = cartSelectPayment;
        if (totalSelectPayment.length > 0) totalPayment = totalSelectPayment;
        setFormVisible(cartPayment);
        localStorage.setItem("cart_buy", JSON.stringify(cartPayment));
        break;
      case "card":
        if (cartSelectPayment.length > 0) cartPayment = cartSelectPayment;
        // else toast.error("Giỏ hàng của bạn chưa có sản phẩm");
        await data({ cart: cartPayment })
          .then((dataRes) => {
            console.log(dataRes);
            let url = dataRes?.data?.url;
            if (url) {
              localStorage.setItem("cart_buy", JSON.stringify(cartPayment));
              window.location.href = url;
            } else {
              toast.error("Không tìm thấy URL để điều hướng");
            }
          })
          .catch((error) => {
            console.error("Error during checkout:", error);
            toast.error("Xảy ra lỗi trong quá trình thanh toán");
          });
        break;
      default:
        toast.error("Vui lòng chọn phương thức thanh toán!!!");
        break;
    }
  };

  useEffect(() => {
    if (error) {
      alert(error?.data?.errors?.[0]?.msg);
    }
  }, [error]);
  return (
    <Wrapper onFooter={true}>
      <div className="cart-container">
        <Breadcrumb colorBread={true} />

        <div className="cart-title">
          <h2>Giỏ hàng cá nhân</h2>
        </div>
        {cart?.length === 0 ? (
          <p className="cart-empty">Giỏ hàng của bạn đang trống</p>
        ) : (
          <div className="cart-content">
            <div className="cart-table-container">
              <table className="cart-table">
                <thead>
                  <tr className="cart-table-header">
                    <th className="cart-table-header-cell">
                      <input
                        type="checkbox"
                        checked={checkALlItem}
                        onChange={() => handleAllCheck()}
                        // className="p-2 bg-white"
                      />
                    </th>
                    <th className="cart-table-header-cell">STT</th>
                    <th className="cart-table-header-cell">Tên</th>
                    <th className="cart-table-header-cell">Giá</th>
                    <th className="cart-table-header-cell">Màu</th>
                    <th className="cart-table-header-cell">Giảm giá</th>
                    <th className="cart-table-header-cell">Số lượng</th>
                    <th className="cart-table-header-cell">Hỗ trợ</th>
                  </tr>
                </thead>
                <tbody>
                  {cart?.map((product, index) => (
                    <tr className="cart-table-row" key={index}>
                      <td className="cart-table-checkbox">
                        <input
                          type="checkbox"
                          checked={product.isSelected}
                          onChange={() =>
                            handleCheckboxChange({
                              _id: product?._id,
                              color: product?.color,
                            })
                          }
                        />
                      </td>
                      <td className="cart-table-cell">{index + 1}</td>
                      <td className="cart-table-cell">{product?.name}</td>
                      <td className="cart-table-cell">
                        {formatMoney(product?.price)}
                      </td>
                      <td className="cart-table-cell">
                        <span
                          className="inline-block w-6 h-6 rounded-full"
                          style={{ backgroundColor: product?.color }} // Thay đổi màu nền bằng inline style
                        ></span>
                      </td>
                      <td className="cart-table-cell">{product?.discount}%</td>
                      <td className="cart-table-cell quantity">
                        <div className="quantity-container">
                          <button
                            className="cart-item-button"
                            onClick={() => {
                              dispatch(
                                decQuantity({
                                  _id: product?._id,
                                  color: product?.color,
                                })
                              );
                            }}
                          >
                            -
                          </button>
                          <span className="quantity-value">
                            {product?.quantity}
                          </span>

                          <button
                            className="cart-item-button"
                            onClick={() =>
                              dispatch(
                                incQuantity({
                                  _id: product?._id,
                                  color: product?.color,
                                })
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="cart-table-cell">
                        <button
                          className="cart-item-button delete"
                          onClick={() =>
                            dispatch(
                              removeItem({
                                _id: product?._id,
                                color: product?.color,
                              })
                            )
                          }
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="cart-summary-container">
              <div className="title-cart-summary">
                <Toaster position="top-right" />
                <h2>Chi tiết giỏ hàng</h2>
                <hr />
              </div>
              <div className="coupons-code">
                <input type="text" name="" id="" placeholder="Code coupons" />
                <button>Nhập mã</button>
              </div>
              <div className="method_pay_div">
                {/* <label className="payment_method" for="payment_method">
                  Phương thức thanh toán:
                </label> */}
                <select
                  id="payment_method"
                  name="payment_method"
                  required
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                  }}
                >
                  <option value="">Phương thức thanh toán</option>
                  <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                  <option value="bank_transfer">
                    Chuyển khoản ngân hàng (bank_transfer)
                  </option>
                  <option value="card">Thanh toán qua thẻ (card)</option>
                </select>
              </div>
              <div className="check-out-div">
                <div className="cart-total-items">
                  <span>Tổng số lượng: </span>
                  <span className="number-total">{selectedItem}</span>{" "}
                </div>
                <div className="cart-total-price">
                  <span>Tổng tiền: </span>
                  <span className="number-price">
                    {checkALlItem
                      ? formatMoney(total)
                      : formatMoney(selectedTotal)}
                  </span>
                </div>
                <button
                  className="cart-checkout-button"
                  onClick={handleCheckOut}
                >
                  {isLoading ? <Spinner /> : "Thanh toán"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {isFormVisible && (
        <Payment
          itemCart={isFormVisible}
          totalPayment={totalPayment}
          paymentMethod={paymentMethod}
          onClose={() => {
            setFormVisible(!isFormVisible);
          }}
        />
      )}
    </Wrapper>
  );
};

export default PageCart;
