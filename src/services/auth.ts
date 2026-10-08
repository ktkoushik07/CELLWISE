import type { User, UserRole } from '../types/battery';

export const DEMO_USERS: (User & { password: string })[] = [
  {
    id: 'user-refurb-01',
    email: 'refurbisher@cellwise.demo',
    password: 'Refurb@123',
    name: 'Elena Vance',
    role: 'refurbisher',
    organization: 'Apex EV Service & Refurbishing Centre',
  },
  {
    id: 'user-second-01',
    email: 'secondlife@cellwise.demo',
    password: 'Second@123',
    name: 'Marcus Brody',
    role: 'second_life',
    organization: 'VoltGrid Energy Solutions',
  },
  {
    id: 'user-recycler-01',
    email: 'recycler@cellwise.demo',
    password: 'Recycler@123',
    name: 'Dr. Aris Thorne',
    role: 'recycler',
    organization: 'EcoMat Battery Recycling Corp',
  },
  {
    id: 'user-admin-01',
    email: 'admin@cellwise.demo',
    password: 'Admin@123',
    name: 'Sarah Jenkins',
    role: 'admin',
    organization: 'CELLWISE Ecosystem Admin',
  },
];

const AUTH_KEY = 'cellwise_current_user';

export const authService = {
  getCurrentUser(): User | null {
    const data = localStorage.getItem(AUTH_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data) as User;
    } catch {
      return null;
    }
  },

  login(email: string, pass: string): { user: User | null; error: string | null } {
    const trimmedEmail = email.trim().toLowerCase();
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.password === pass
    );

    if (!found) {
      return { user: null, error: 'Invalid credentials. Please check your email and password.' };
    }

    const user: User = {
      id: found.id,
      email: found.email,
      name: found.name,
      role: found.role,
      organization: found.organization,
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('cellwise_auth_change'));
    return { user, error: null };
  },

  logout() {
    localStorage.removeItem(AUTH_KEY);
    window.dispatchEvent(new Event('cellwise_auth_change'));
  },

  getRoleDefaultRoute(role: UserRole): string {
    switch (role) {
      case 'refurbisher':
        return '/refurbisher/dashboard';
      case 'second_life':
        return '/second-life/dashboard';
      case 'recycler':
        return '/recycler/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  },
};
