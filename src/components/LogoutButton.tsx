import { useMutation } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

const LogoutButton = () => {
  const [logoutMutation] = useMutation(LOGOUT);
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.auth.user?.id) || localStorage.getItem("userId");

  const handleLogout = async () => {
    if (!userId) {
      console.error("Error: userId is missing");
      return;
    }

    try {
      await logoutMutation({ variables: { userId: Number(userId) } });
      dispatch(logout()); // Clear Redux state
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md shadow-md"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
