
export type UserRole = 'admin' | 'doctor' | 'receptionist' | 'guest';

export interface Permission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  permissions: {
    records: Permission;
    users: Permission;
    settings: Permission;
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Demo users with predefined credentials
export const demoUsers: Record<string, { password: string; user: User }> = {
  admin: {
    password: 'admin123',
    user: {
      id: '1',
      username: 'admin',
      name: 'Administrator',
      email: 'admin@medical.org',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      permissions: {
        records: { create: true, read: true, update: true, delete: true },
        users: { create: true, read: true, update: true, delete: true },
        settings: { create: true, read: true, update: true, delete: true }
      }
    }
  },
  doctor: {
    password: 'doctor123',
    user: {
      id: '2',
      username: 'doctor',
      name: 'Dr. Sarah Smith',
      email: 'sarah@medical.org',
      role: 'doctor',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      permissions: {
        records: { create: true, read: true, update: true, delete: false },
        users: { create: false, read: true, update: false, delete: false },
        settings: { create: false, read: true, update: false, delete: false }
      }
    }
  },
  nurse: {
    password: 'nurse123',
    user: {
      id: '3',
      username: 'nurse',
      name: 'Nurse Rebecca',
      email: 'rebecca@medical.org',
      role: 'receptionist',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rebecca',
      permissions: {
        records: { create: true, read: true, update: true, delete: false },
        users: { create: false, read: false, update: false, delete: false },
        settings: { create: false, read: false, update: false, delete: false }
      }
    }
  }
};

