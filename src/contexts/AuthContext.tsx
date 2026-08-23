import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, isLive } from '../firebase/config';
import { UserProfile, UserRole } from '../types';
import { dbService } from '../services/db';

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isLiveFirebase: boolean;
  login: (email: string, pass: string) => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  hasRole: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('samachar_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLive && auth) {
      const unsub = onAuthStateChanged(auth, async (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser) {
          const isSuperAdminEmail = fbUser.email === 'saini.pardeep45@gmail.com';
          const profile: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Admin User',
            role: isSuperAdminEmail ? 'super_admin' : 'editor',
            photoURL: fbUser.photoURL || undefined,
            createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            isActive: true,
          };
          setCurrentUser(profile);
          localStorage.setItem('samachar_current_user', JSON.stringify(profile));
        } else {
          // If not signed into Firebase and no local user set
          const saved = localStorage.getItem('samachar_current_user');
          if (!saved) {
            setCurrentUser(null);
          }
        }
        setLoading(false);
      });
      return () => unsub();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    if (isLive && auth) {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const isSuperAdminEmail = cred.user.email === 'saini.pardeep45@gmail.com';
      const profile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName: cred.user.displayName || email.split('@')[0],
        role: isSuperAdminEmail ? 'super_admin' : 'admin',
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      setCurrentUser(profile);
      localStorage.setItem('samachar_current_user', JSON.stringify(profile));
      return;
    }

    // Local authentication fallback for development / instant review
    if (email.toLowerCase() === 'saini.pardeep45@gmail.com' || email.toLowerCase().startsWith('superadmin')) {
      const profile: UserProfile = {
        uid: 'usr-superadmin',
        email,
        displayName: 'प्रदीप सैनी (Chief Editor)',
        role: 'super_admin',
        designation: 'प्रधान संपादक (Super Admin)',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      setCurrentUser(profile);
      localStorage.setItem('samachar_current_user', JSON.stringify(profile));
      dbService.logActivity({
        userId: profile.uid,
        userName: profile.displayName,
        action: 'Super Admin Logged In',
        entityType: 'Auth',
        details: `${email} logged into CMS`,
        timestamp: new Date().toISOString(),
      });
    } else if (email.toLowerCase().includes('admin')) {
      const profile: UserProfile = {
        uid: 'usr-admin',
        email,
        displayName: 'राजेश खन्ना (CMS Admin)',
        role: 'admin',
        designation: 'प्रबंधक (Admin)',
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      setCurrentUser(profile);
      localStorage.setItem('samachar_current_user', JSON.stringify(profile));
      dbService.logActivity({
        userId: profile.uid,
        userName: profile.displayName,
        action: 'Admin Logged In',
        entityType: 'Auth',
        details: `${email} logged into CMS`,
        timestamp: new Date().toISOString(),
      });
    } else if (email.toLowerCase().includes('editor')) {
      const profile: UserProfile = {
        uid: 'usr-editor',
        email,
        displayName: 'अमित भारद्वाज (Senior Editor)',
        role: 'editor',
        designation: 'वरिष्ठ उप-संपादक',
        photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      setCurrentUser(profile);
      localStorage.setItem('samachar_current_user', JSON.stringify(profile));
    } else {
      const profile: UserProfile = {
        uid: `usr-${Date.now()}`,
        email,
        displayName: email.split('@')[0],
        role: 'reporter',
        designation: 'संवाददाता (Reporter)',
        photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      setCurrentUser(profile);
      localStorage.setItem('samachar_current_user', JSON.stringify(profile));
    }
  };

  const demoLogin = async (role: UserRole) => {
    const rolesMap: Record<UserRole, { name: string; email: string; desig: string }> = {
      super_admin: { name: 'प्रदीप सैनी', email: 'saini.pardeep45@gmail.com', desig: 'प्रधान संपादक (Super Admin)' },
      admin: { name: 'राजेश खन्ना', email: 'admin@samacharfirst.com', desig: 'प्रबंधक (CMS Admin)' },
      editor: { name: 'अमित भारद्वाज', email: 'editor@samacharfirst.com', desig: 'वरिष्ठ उप-संपादक (Editor)' },
      reporter: { name: 'पूजा शर्मा', email: 'reporter@samacharfirst.com', desig: 'विशेष संवाददाता (Reporter)' },
      moderator: { name: 'विकास कुमार', email: 'moderator@samacharfirst.com', desig: 'कमेंट मॉडरेटर' },
      reader: { name: 'पाठक', email: 'reader@samacharfirst.com', desig: 'पंजीकृत पाठक' },
    };

    const target = rolesMap[role] || rolesMap.admin;
    const profile: UserProfile = {
      uid: `demo-${role}`,
      email: target.email,
      displayName: target.name,
      role,
      designation: target.desig,
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    setCurrentUser(profile);
    localStorage.setItem('samachar_current_user', JSON.stringify(profile));
  };

  const logout = async () => {
    if (isLive && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.error('Logout error:', e);
      }
    }
    setCurrentUser(null);
    setFirebaseUser(null);
    localStorage.removeItem('samachar_current_user');
  };

  const resetPassword = async (email: string) => {
    if (isLive && auth) {
      await sendPasswordResetEmail(auth, email);
    }
  };

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    return allowedRoles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        loading,
        isLiveFirebase: Boolean(isLive),
        login,
        demoLogin,
        logout,
        resetPassword,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
