import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export const useGoogleAuth = () => {
  const { dispatch } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Send the access token to your backend
        const response = await axios.post('/auth/google', {
          access_token: tokenResponse.access_token
        });
        
        if (response.data.success) {
          const { token, user } = response.data.data;
          localStorage.setItem('token', token);
          
          // Update auth state
          window.location.href = '/dashboard';
        }
      } catch (error) {
        console.error('Google login error:', error);
        throw new Error(error.response?.data?.message || 'Google login failed');
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      throw new Error('Google login failed');
    }
  });

  return googleLogin;
};
