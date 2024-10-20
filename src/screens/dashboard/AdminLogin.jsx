import { useAuthLoginMutation } from "../../store/service/authService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAdminToken } from "../../store/reducer/authReducer";
import { useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [state, setState] = useState({ email: "", password: "" });
  const [login, { isLoading, isError, isSuccess, data, error }] =
    useAuthLoginMutation();

  const adminLoginFunction = async (e) => {
    e.preventDefault();
    await login(state);
  };

  const allowedRoles = ["admin", "employee", "shipper"];
  useEffect(() => {
    if (isSuccess && allowedRoles.includes(data?.role)) {
      localStorage.setItem("admin-token", data?.token);
      dispatch(setAdminToken(data?.token));
      toast.success("Đăng nhập thành công!!!");
      navigate("/dashboard/products");
    } else if (isSuccess) {
      toast.error("Bạn không đủ quyền đăng nhập!!!");
      setState({ email: "", password: "" });
    }
  }, [isSuccess, data, dispatch, navigate]);

  useEffect(() => {
    if (isError && error?.data?.errors) {
      // error.data.errors.forEach((err) => {
      // toast.error(err.msg);
      toast.error("Đăng nhập thất bại!!!");
      // });
    } else if (isError) {
      toast.error("Đăng nhập thất bại!!!");
    }
  }, [isError, error]);

  const handleInputs = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="bg-black1 h-screen flex justify-center items-center">
        <form
          onSubmit={adminLoginFunction}
          className="bg-black2 p-5 w-10/12 sm:w-8/12 md:w-6/12 lg:w-3/12 rounded"
        >
          <Toaster position="top-right" />
          <h3 className="mb-4 text-white capitalize font-semibold text-lg">
            Đăng nhập trang quản lý
          </h3>
          <div className="mb-4 mt-4">
            <input
              type="email"
              name="email"
              className="w-full bg-black1 p-4 rounded outline-none text-white"
              value={state.email}
              onChange={handleInputs}
              placeholder="Nhập email..."
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              className="w-full bg-black1 p-4 rounded outline-none text-white"
              value={state.password}
              onChange={handleInputs}
              placeholder="Nhập mật khẩu..."
            />
          </div>
          <div className="mb-4">
            <input
              type="submit"
              value={isLoading ? "Đang tải..." : "Đăng nhập"}
              className="bg-indigo-600 w-full p-4 rounded text-white uppercase font-semibold cursor-pointer"
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminLogin;
