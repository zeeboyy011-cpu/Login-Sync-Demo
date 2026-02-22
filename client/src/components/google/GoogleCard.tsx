import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

interface GoogleCardProps {
  children: React.ReactNode;
  showFacebookContext?: boolean;
}

export function GoogleCard({ children, showFacebookContext = false }: GoogleCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#f0f4f9]">
      <div className="w-full max-w-[448px]">
        {showFacebookContext && (
          <div className="flex items-center justify-center gap-2 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">SYNCING</span>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm">
              <FaFacebook className="w-4 h-4 text-[#1877F2]" />
              <span className="text-xs text-gray-400 font-bold">+</span>
              <FcGoogle className="w-4 h-4" />
            </div>
          </div>
        )}
        
        <div className="bg-white sm:rounded-[28px] sm:border sm:border-gray-200 w-full overflow-hidden transition-all duration-300">
          <div className="p-6 sm:p-10 pb-12">
            {children}
          </div>
        </div>
        
        {/* Footer Links (Language, Help, Privacy, Terms) */}
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600 px-2 sm:px-6">
          <select className="bg-transparent border-none cursor-pointer hover:bg-gray-200/50 rounded py-1 px-2 focus:outline-none mb-4 sm:mb-0">
            <option>English (United States)</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
          <div className="flex gap-4 sm:gap-6">
            <a href="#" className="hover:bg-gray-200/50 rounded py-1 px-2 transition-colors">Help</a>
            <a href="#" className="hover:bg-gray-200/50 rounded py-1 px-2 transition-colors">Privacy</a>
            <a href="#" className="hover:bg-gray-200/50 rounded py-1 px-2 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </div>
  );
}
