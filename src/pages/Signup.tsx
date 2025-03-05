import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SIGNUP_MUTATION } from "../graphql/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signup, { loading, error }] = useMutation(SIGNUP_MUTATION);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await signup({
        variables: { input: { username, email, password } },
      });

      if (data?.signup?.token) {
        dispatch(loginSuccess({ user: data.signup.user, token: data.signup.token }));
        navigate("/dashboard"); // Redirect to dashboard
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center text-blue-600">Sign Up</h2>
        <form onSubmit={handleSignup} className="mt-4 space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        {error && <p className="mt-2 text-red-500 text-center">{error.message}</p>}
      </div>
    </div>
  );
};

export default Signup;
