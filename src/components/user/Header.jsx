// import './header.css'
import React, { useState, useEffect } from "react";
import {
  useUserLogoutMutation,
  useUseGetInfoUserQuery,
  useUpdateMutation,
} from "../../store/service/authService";
import { useGetCateLevel123Query } from "../../store/service/cateService";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, addInfo } from "../../store/reducer/authReducer";
import { emptyCart } from "../../store/reducer/cartReducer";
import { useGetAllProductsQuery } from "../../store/service/productService";
import { useAddItemToCartMutation } from "../../store/service/cartUserService";
import diacritics from "diacritics";
import { clearWishList } from "../../store/reducer/wishListReducer";
import toast, { Toaster } from "react-hot-toast";
import { useGetCartByUserIdQuery } from "../../store/service/cartUserService";
import { addCart } from "../../store/reducer/cartReducer";

const Header = () => {
  const dispatch = useDispatch();
  const cartArray = useSelector((state) => state?.cartReducer?.cart) || null;
  const wishLisst = useSelector((state) => state?.wishListReducer?.wishList);
  // const ca = useSelector((state) => state?.wishListReducer?.wishList);
  const userExist =
    useSelector((state) => state?.authReducer?.userToken) || null;
  // const navigate = useNavigate();

  const [accUser, setAccUser] = useState(null);
  const [totalItemCart, setTotalItemCart] = useState(0);
  const [parentCa23, setParentCa23] = useState([]);
  const [backColor, setBackColor] = useState("");
  // search
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  //
  const [userLogout] = useUserLogoutMutation();
  const [addCartUser] = useAddItemToCartMutation();
  const {
    data: infoUser,
    isSuccess: succesInfoUser,
    refetch,
  } = useUseGetInfoUserQuery(undefined, { skip: !userExist });

  const {
    data: dataCate123,
    isLoading: isLoadCate123,
    isSuccess: isSucGetCate,
  } = useGetCateLevel123Query();

  const {
    data: dataProduct,
    isFetching,
    error,
  } = useGetAllProductsQuery(undefined, { skip: !searchText });

  // const { data: dataCart, isSuccess: successGetCart } = useGetCartByUserIdQuery(
  //   undefined,
  //   { skip: !userExist }
  // );

  const [updateData, response] = useUpdateMutation();
  // ------------------

  function handleSearch() {
    const textS = diacritics.remove(searchText.toLowerCase());

    // Sử dụng filter đúng cách
    let arr = dataProduct?.data?.filter((product) =>
      diacritics.remove(product.name.toLowerCase()).includes(textS)
    );

    if (arr.length > 0) {
      setSearchResults(arr);
    }
    console.log(`${searchText}`, arr);
  }

  function arrCateParent23(idp) {
    dataCate123?.data?.forEach((element) => {
      if (element?.parent?._id === idp) {
        // console.log(element?.children);
        setParentCa23(element?.children);
      }
    });
  }

  useEffect(() => {
    if (isSucGetCate) {
      arrCateParent23(dataCate123?.data?.[0]?.parent?._id);
      setBackColor(dataCate123?.data?.[0]?.parent?._id);
    }
  }, [isSucGetCate]);

  const banner_header_top =
    "https://cdn0.fahasa.com/media/wysiwyg/Thang-08-2024/TrangsinhnhatT8_0824_LDP_Header_1263x60.jpg";

  useEffect(() => {
    if (succesInfoUser) {
      setAccUser(infoUser?.data);
    }
  }, [succesInfoUser]);

  useEffect(() => {
    setTotalItemCart(cartArray?.length || 0);
  }, [cartArray]);

  const handlerLogout = async () => {
    const formData = new FormData();
    if (wishLisst?.length > 0) {
      wishLisst.forEach((element, index) => {
        formData.append(`wishlist[${index}]`, element?._id);
      });
    }
    const response = await updateData({ dataProduct: formData }).unwrap();
    //--------------------
    let items = [];

    cartArray.forEach((element, index) => {
      items.push({
        product: element?._id,
        quantity: element?.quantity,
        color: element?.color,
      });
    });

    const res = await addCartUser({ items }).unwrap();
    if (response?.success && res?.success) {
      await userLogout().unwrap();
      dispatch(clearWishList());
      dispatch(logout("user-token"));
      dispatch(emptyCart());
      setAccUser(null);
      window.location.reload();
    } else {
      toast.error("Cập nhật wistlist/Cart thất bại");
    }
  };

  useEffect(() => {
    if (userExist && succesInfoUser && infoUser?.data) {
      try {
        let inputInfo = JSON.stringify(infoUser?.data);
        // console.log(inputInfo);
        localStorage.setItem("info", inputInfo);
      } catch (error) {
        console.error("Failed to save info to localStorage:", error);
      }
    }
  }, [userExist, succesInfoUser, infoUser]);

  // useEffect(() => {
  //   if (successGetCart && dataCart) {
  //     let arrLocal = localStorage.getItem("cart");
  //     arrLocal = arrLocal ? JSON.parse(arrLocal) : [];

  //     // Tạo một map để dễ dàng kiểm tra và cập nhật số lượng
  //     const itemMap = arrLocal.reduce((acc, item) => {
  //       const key = `${item._id}-${item.color}`; // Tạo key để phân biệt phần tử theo _id và color
  //       acc[key] = item;
  //       return acc;
  //     }, {});

  //     // Cập nhật hoặc thêm mới các phần tử từ dataCart
  //     dataCart?.data?.items.forEach((item) => {
  //       if (item) {
  //         const key = `${item._id}-${item.color}`; // Tạo key tương ứng
  //         if (itemMap[key]) {
  //           // Cập nhật số lượng nếu phần tử đã tồn tại
  //           itemMap[key].quantity += item?.quantity;
  //         } else {
  //           // Thêm mới nếu phần tử chưa tồn tại
  //           itemMap[key] = {
  //             _id: item?._id || "",
  //             name: item?.product?.name || "",
  //             color: item?.color || "",
  //             quantity: item?.quantity || 0,
  //             price: item?.product?.price || 0,
  //             discount: item?.product?.coupons?.discount || 0,
  //           };
  //         }
  //       }
  //     });

  //     // Chuyển đổi itemMap trở lại thành mảng và lưu vào localStorage
  //     const updatedCart = Object.values(itemMap);
  //     localStorage.setItem("cart", JSON.stringify(updatedCart));
  //   }
  // }, [successGetCart]);
  return (
    <>
      <div className="home">
        <div className="header">
          <div className="banner_header">
            <div className="image_banner_header">
              <img src={banner_header_top} alt="Banner-top" />
            </div>
          </div>
          <div className="container_header ">
            <div>
              <ul className="container_h">
                <li className="image-logo">
                  <Link to="/">
                    <img src="/image/logo/Hieusach.png" alt="" />
                  </Link>
                </li>
                <li className="icon-menu">
                  <i className="bi bi-grid"></i>
                  <i className="bi bi-chevron-down"></i>
                  <div id="dropdown-menu">
                    <div className="cate-content">
                      <div className="cate-left">
                        <p>Danh mục sản phẩm</p>
                        <ul>
                          {/* map-parent1 */}
                          {dataCate123?.data?.map((it) => (
                            <li
                              key={it?.parent?._id}
                              className="item-cate-left"
                              onClick={() => {
                                arrCateParent23(it?.parent?._id);
                                setBackColor(it?.parent?._id);
                              }}
                              style={
                                backColor === it?.parent?._id
                                  ? {
                                      backgroundColor: " #f73d4b",
                                    }
                                  : {}
                              }
                            >
                              <div>
                                <span
                                  style={
                                    backColor === it?.parent?._id
                                      ? {
                                          color: "#ffffff",
                                        }
                                      : {}
                                  }
                                >
                                  <Link
                                    to={`/category/${it?.parent?._id}/#page-vitri`}
                                  >
                                    {it?.parent?.name}
                                  </Link>
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="hr-vertical"></div>
                      <div className="cate-right">
                        {parentCa23?.map((i23, index) => (
                          <div className="cate-child" key={index}>
                            <ul>
                              <li className="child-item">
                                <div>
                                  <span>
                                    <Link
                                      to={`/category/${i23?._id}/#page-vitri`}
                                    >
                                      {i23?.name}
                                    </Link>
                                  </span>
                                  <hr />
                                </div>
                                <ul className="child-mini">
                                  {i23?.children.length > 0 ? (
                                    i23?.children?.map((i) => (
                                      <li
                                        className="cate-child-child"
                                        key={i._id}
                                      >
                                        <div>
                                          <Link
                                            to={`/category/${i?._id}/#page-vitri`}
                                          >
                                            {i?.name}
                                          </Link>
                                        </div>
                                      </li>
                                    ))
                                  ) : (
                                    <li style={{ color: "#434eed" }}>
                                      ---Đang cập nhật---
                                    </li>
                                  )}
                                </ul>
                              </li>
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
                <li className="search-header">
                  <div className="search-item">
                    <input
                      type="text"
                      onChange={(e) => {
                        setSearchText(e.target.value);
                      }}
                      className="input-search-p"
                    />
                    <div onClick={handleSearch}>
                      <i className="bi bi-search"></i>
                    </div>
                  </div>
                  {/* {searchResults.length > 0 && ( */}
                  <div className="result_search active">
                    <ul>
                      {searchResults.length > 0 ? (
                        searchResults.map((result) => (
                          <li key={result?._id} className="li-search">
                            <Link
                              to={`/product/${result?._id}/#page-detail-product`}
                            >
                              {result?.name}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li># Không có sản phẩm nào tìm thấy</li>
                      )}
                    </ul>
                  </div>
                  {/* )} */}
                </li>
                <li className="">
                  <div className="dropdown-notification">
                    <div className="dropdown-button-notification">
                      <div className="notification-item">
                        <i class="bi bi-bell"></i>
                        <span className="">Thông báo</span>
                        <div className="notification">0</div>
                      </div>
                      {accUser !== null && (
                        <div
                          className="dropdown-menu-notification"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="menu-button"
                          tabIndex="-1"
                        >
                          <div className="header-notification">
                            <i className="bi bi-bell-fill text-xl text-red-500"></i>
                            <span className="tb ">Thông báo</span>
                          </div>
                          <div
                            className="dropdown-content-notification"
                            role="none"
                          >
                            {/* <span className="dropdown-item-notification">
                              Chào mừng bạn đến với Hiệu Sách Mai Hương
                            </span>
                            <span className="dropdown-item-notification">
                              Đơn hàng #.... của bạn đang vận chuyển đến bạn
                            </span>
                            <span className="dropdown-item-notification">
                              
                            </span> */}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
                <li className="">
                  <div className="cart-item">
                    <i className="bi bi-cart3"></i>
                    <span className="">
                      <Link to="/cart">Giỏ hàng</Link>
                    </span>
                    {totalItemCart > 0 && (
                      <div className="cart-badge">{totalItemCart}</div>
                    )}
                  </div>
                </li>
                <li className="">
                  <div className="cart-item">
                    <div className="dropdown">
                      <div className="dropdown-button">
                        <i className="bi bi-person"></i>
                        <span className="dropdown-tk">
                          {accUser !== null ? (
                            accUser?.name
                          ) : (
                            <Link to="/user/login">Login</Link>
                          )}
                        </span>
                      </div>
                      {accUser !== null && (
                        <div
                          className="dropdown-menu"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="menu-button"
                          tabIndex="-1"
                        >
                          <div className="dropdown-content" role="none">
                            <Link to="/personal-info" className="dropdown-item">
                              Thay đổi thông tin
                            </Link>
                            <Link to="/order-detail" className="dropdown-item">
                              Quản lý đơn hàng
                            </Link>
                            {/* <a href="#" className="dropdown-item">
                            Hỗ trợ
                          </a> */}
                            <button
                              onClick={() => handlerLogout()}
                              className="dropdown-item"
                            >
                              Đăng xuất
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          {/* <Toaster /> */}
        </div>
      </div>
    </>
  );
};

export default Header;
