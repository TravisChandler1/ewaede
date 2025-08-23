import { useNavigate } from "react-router";
import useAuth from "@/utils/useAuth";

function LogoutPage() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    signOut();
    navigate("/");
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
      
      <div className="relative w-full max-w-md bg-[#1e293b]/95 backdrop-blur-sm border border-[#334155] rounded-2xl p-8 shadow-2xl text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#10b981] to-[#06b6d4] flex items-center justify-center">
            <span className="text-xl font-bold text-white">E</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Sign Out</h1>
        </div>
        
        <p className="text-[#cbd5e1] mb-8">
          Are you sure you want to sign out of your Ewa Ede Yoruba Academy account?
        </p>

        <button
          onClick={handleSignOut}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#b91c1c] hover:to-[#991b1b] text-white rounded-lg font-semibold transition-all"
        >
          Sign Out
        </button>
        
        <a 
          href="/dashboard"
          className="block mt-4 text-[#06b6d4] hover:text-[#0891b2] transition-colors"
        >
          Cancel
        </a>
      </div>
    </div>
  );
}

export default LogoutPage;