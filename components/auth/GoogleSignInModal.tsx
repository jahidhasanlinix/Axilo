
import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { X, AlertCircle } from 'lucide-react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

interface GoogleSignInModalProps {
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({ onClose, onLogin }) => {
  const [error, setError] = useState<string | null>(null);
  const currentOrigin = window.location.origin;

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    try {
      if (credentialResponse.credential) {
        const decoded: any = jwtDecode(credentialResponse.credential);
        
        const userProfile: UserProfile = {
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          avatarUrl: decoded.picture
        };

        onLogin(userProfile);
        onClose();
      } else {
        setError("No credential received from Google.");
      }
    } catch (err) {
      console.error("Login Failed", err);
      setError("Failed to decode user information.");
    }
  };

  const handleError = () => {
    setError("Google Sign In was unsuccessful. Please try again.");
  };

  const handleDevBypass = () => {
    // Mock user for development when auth fails
    const mockUser: UserProfile = {
        id: 'dev_user_123',
        name: 'Developer Account',
        email: 'dev@example.com',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev'
    };
    onLogin(mockUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-[450px] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-8 pb-4 text-center">
                <div className="flex justify-center mb-4">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-10 h-10 block">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    </svg>
                </div>
                <h2 className="text-2xl font-medium text-gray-800">Sign in</h2>
                <p className="text-base text-gray-600 mt-2">to continue to Axilo</p>
            </div>

            {/* Content */}
            <div className="px-8 pb-8 flex flex-col items-center">
                <div className="w-full flex justify-center mb-6">
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        width="300"
                        theme="outline"
                        size="large"
                        text="continue_with"
                        shape="circle"
                    />
                </div>

                {error && (
                    <div className="mb-4 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-md border border-red-100 w-full text-center">
                        {error}
                    </div>
                )}

                <div className="mt-2 text-[10px] text-gray-400 text-center leading-relaxed max-w-xs mb-4">
                    By signing in, you agree to our Terms of Service and Privacy Policy. <br/>
                    We will receive your name, email, and profile picture from Google.
                </div>

                {/* Developer Helper Section */}
                <div className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 text-left">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-600">
                        <AlertCircle size={14} /> Developer Debug
                    </div>
                    <p className="text-[10px] text-gray-500 mb-2">
                        Getting <span className="font-mono bg-gray-200 px-1 rounded">origin_mismatch</span>? 
                        Add this URL to <strong>Authorized JavaScript origins</strong> in Google Cloud Console:
                    </p>
                    <code className="block w-full bg-white border border-gray-300 p-2 rounded text-[10px] font-mono text-gray-700 break-all select-all mb-3">
                        {currentOrigin}
                    </code>
                    <button 
                        onClick={handleDevBypass}
                        className="w-full py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded transition-colors"
                    >
                        Simulate Login (Bypass Auth)
                    </button>
                </div>
            </div>
            
            <button 
                onClick={onClose} 
                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
            >
                <X size={20} />
            </button>
        </div>
    </div>
  );
};

export default GoogleSignInModal;
