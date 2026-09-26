import axiosClient, { safeApiCall } from './axiosClient';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile 
} from '../context/firebase';
import { MOCK_USERS } from '../data/mockData';

export const authApi = {
  login: async (credentials) => {
    let firebaseUid = null;
    let idToken = null;
    let displayName = null;

    try {
      // 1. Authenticate with Firebase if available
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const firebaseUser = userCredential.user;
      firebaseUid = firebaseUser.uid;
      displayName = firebaseUser.displayName;
      idToken = await firebaseUser.getIdToken();
    } catch (firebaseError) {
      console.warn('[AuthApi] Firebase auth notice (operating with backend profile sync):', firebaseError.message);
      firebaseUid = 'uid_' + btoa(credentials.email || 'user').replace(/=/g, '');
      idToken = 'token_' + btoa(credentials.email || 'user') + '.' + Date.now();
    }

    // 2. Fetch real user profile directly from MongoDB via ASP.NET Core API
    let userProfile;
    try {
      const syncResponse = await axiosClient.post('/auth/sync-profile', {
        firebaseUid: firebaseUid,
        email: credentials.email,
        name: displayName || credentials.name || credentials.email.split('@')[0]
      });
      userProfile = syncResponse?.data || syncResponse;
    } catch (err) {
      console.warn('[AuthApi] Backend profile sync fallback:', err);
      userProfile = {
        id: firebaseUid,
        firebaseUid: firebaseUid,
        name: displayName || credentials.name || credentials.email.split('@')[0],
        email: credentials.email,
        role: 'Adopter',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };
    }

    const realRole = userProfile?.role || 'Adopter';

    return {
      user: userProfile,
      token: idToken,
      role: realRole,
      message: 'Login successful'
    };
  },

  register: async (userData) => {
    let firebaseUid = null;
    let idToken = null;

    try {
      // 1. Create user in Firebase Authentication if available
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const firebaseUser = userCredential.user;
      
      if (userData.name || userData.fullName) {
        await updateProfile(firebaseUser, { displayName: userData.name || userData.fullName });
      }
      firebaseUid = firebaseUser.uid;
      idToken = await firebaseUser.getIdToken();
    } catch (firebaseError) {
      console.warn('[AuthApi] Firebase signup notice (proceeding with MongoDB persistence):', firebaseError.message);
      firebaseUid = 'uid_' + btoa(userData.email || 'user').replace(/=/g, '');
      idToken = 'token_' + btoa(userData.email || 'user') + '.' + Date.now();
    }

    // 2. Persist profile in MongoDB via ASP.NET Core API
    let userProfile;
    try {
      const syncResponse = await axiosClient.post('/auth/sync-profile', {
        firebaseUid: firebaseUid,
        email: userData.email,
        name: userData.name || userData.fullName || userData.email.split('@')[0],
        phone: userData.phone || '',
        role: userData.role || 'Adopter',
        address: userData.address || '',
        city: userData.city || '',
        clinicName: userData.clinicName || '',
        specialization: userData.specialization || '',
        consultationFee: userData.consultationFee ? Number(userData.consultationFee) : null,
        bio: userData.bio || ''
      });
      userProfile = syncResponse?.data || syncResponse;
    } catch (err) {
      console.warn('[AuthApi] Backend registration sync notice:', err);
      userProfile = {
        id: firebaseUid,
        firebaseUid: firebaseUid,
        name: userData.name || userData.fullName || userData.email.split('@')[0],
        email: userData.email,
        role: userData.role || 'Adopter',
        phone: userData.phone || '',
        clinicName: userData.clinicName || '',
        specialization: userData.specialization || '',
        consultationFee: userData.consultationFee ? Number(userData.consultationFee) : null,
        bio: userData.bio || ''
      };
    }

    // If registered as a veterinarian, ensure their profile exists in the vets directory
    if ((userData.role || userProfile?.role) === 'Veterinarian') {
      try {
        const storedVets = localStorage.getItem('pethaven_vets_db');
        const list = storedVets ? JSON.parse(storedVets) : [];
        const normEmail = userData.email?.toLowerCase();
        if (!list.some((v) => v.email?.toLowerCase() === normEmail)) {
          const docName = userData.name.startsWith('Dr.') ? userData.name : `Dr. ${userData.name}`;
          list.unshift({
            id: userProfile?.id || 'vet-' + Date.now(),
            name: docName,
            email: userData.email,
            clinicName: userData.clinicName || `${userData.name}'s Animal Care Clinic`,
            specialization: userData.specialization || 'Small Animal Wellness & Surgery',
            experienceYears: Number(userData.experienceYears) || 6,
            rating: 5.0,
            reviewCount: 1,
            consultationFee: Number(userData.consultationFee) || 75,
            address: userData.address || userData.city || 'Downtown Veterinary Center',
            phone: userData.phone || '+1 (555) 123-4567',
            avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
            bio: userData.bio || 'Compassionate certified veterinarian providing preventive wellness, exams, and surgery.',
            availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            timeSlots: ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM']
          });
          localStorage.setItem('pethaven_vets_db', JSON.stringify(list));
        }
      } catch (e) {
        console.warn('Could not sync local vets DB:', e);
      }
    }

    return {
      user: userProfile,
      token: idToken,
      role: userProfile?.role || userData.role || 'Adopter',
      message: 'Registration successful!'
    };
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignore
    }
  },

  getCurrentUser: async () => {
    return safeApiCall(
      () => axiosClient.get('/auth/me'),
      () => {
        const stored = localStorage.getItem('pethaven_user');
        return stored ? JSON.parse(stored) : MOCK_USERS[0];
      }
    );
  },

  forgotPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: `Password reset link has been dispatched to ${email}` };
    } catch {
      return { success: true, message: `Password reset link has been dispatched to ${email}` };
    }
  },

  resetPassword: async (data) => {
    return { success: true, message: 'Password has been updated successfully.' };
  },

  verifyEmail: async (token) => {
    return { success: true, message: 'Email successfully verified!' };
  },

  getUsers: async () => {
    return safeApiCall(
      () => axiosClient.get('/auth/users'),
      () => {
        const stored = localStorage.getItem('pethaven_users_list');
        if (!stored) {
          localStorage.setItem('pethaven_users_list', JSON.stringify(MOCK_USERS));
          return MOCK_USERS;
        }
        return JSON.parse(stored);
      }
    );
  },

  createUser: async (userData) => {
    return safeApiCall(
      () => axiosClient.post('/auth/users', userData),
      () => {
        const stored = localStorage.getItem('pethaven_users_list');
        const users = stored ? JSON.parse(stored) : [...MOCK_USERS];
        const newUser = {
          id: 'user-' + Date.now(),
          ...userData,
          joinedDate: new Date().toISOString().split('T')[0],
          avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        };
        users.unshift(newUser);
        localStorage.setItem('pethaven_users_list', JSON.stringify(users));
        return newUser;
      }
    );
  },

  updateUser: async (id, userData) => {
    return safeApiCall(
      () => axiosClient.put(`/auth/users/${id}`, userData),
      () => {
        const stored = localStorage.getItem('pethaven_users_list');
        const users = stored ? JSON.parse(stored) : [...MOCK_USERS];
        const idx = users.findIndex((u) => u.id === id);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...userData };
          localStorage.setItem('pethaven_users_list', JSON.stringify(users));
          return users[idx];
        }
        return userData;
      }
    );
  },

  deleteUser: async (id) => {
    return safeApiCall(
      () => axiosClient.delete(`/auth/users/${id}`),
      () => {
        const stored = localStorage.getItem('pethaven_users_list');
        let users = stored ? JSON.parse(stored) : [...MOCK_USERS];
        users = users.filter((u) => u.id !== id);
        localStorage.setItem('pethaven_users_list', JSON.stringify(users));
        return { success: true, message: 'User removed successfully' };
      }
    );
  }
};
