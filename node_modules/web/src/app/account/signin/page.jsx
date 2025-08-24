import { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "@/utils/useAuth";

function SignInPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { signIn } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn({
        email,
        password,
        name: email.split('@')[0] // Use email prefix as name for now
      });
      
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Sign-in failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=2000&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-[#0f172a]/85"></div>
      
      <form
        noValidate
        onSubmit={onSubmit}
        className="relative w-full max-w-md bg-[#1e293b]/95 backdrop-blur-sm border border-[#334155] rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#10b981] to-[#06b6d4] flex items-center justify-center">
              <span className="text-xl font-bold text-white">E</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          </div>
          <p className="text-[#cbd5e1]">Continue your Yoruba learning journey</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
              Email Address
            </label>
            <input
              required
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-[#475569] text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
              Password
            </label>
            <input
              required
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-[#475569] text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4]"
            />
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 bg-gradient-to-r from-[#10b981] to-[#06b6d4] hover:from-[#059669] hover:to-[#0891b2] text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          
          <p className="text-center text-sm text-[#cbd5e1]">
            Don't have an account?{" "}
            <a
              href={`/account/signup${
                typeof window !== "undefined" ? window.location.search : ""
              }`}
              className="text-[#06b6d4] hover:text-[#0891b2] transition-colors"
            >
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignInPage;