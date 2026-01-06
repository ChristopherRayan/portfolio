import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt', maxAge: 600 },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = (credentials.email as string).trim().toLowerCase();
        const password = (credentials.password as string).trim();

        const adminEmail = (process.env.ADMIN_EMAIL || '').replace(/['"]+/g, '').trim().toLowerCase();
        const adminPasswordHash = (process.env.ADMIN_PASSWORD_HASH || '').replace(/['"]+/g, '').trim();

        console.log(`🔐 [Auth Attempt] Email: ${email}`);

        // --- 1. Admin Verification ---
        if (adminEmail && adminPasswordHash && email === adminEmail) {
          const isValid = await bcrypt.compare(password, adminPasswordHash);
          
          if (isValid) {
            console.log(`✅ [Auth] Admin login successful: ${adminEmail}`);
            return { id: 'admin', email: adminEmail, name: 'Admin', role: 'admin' };
          } else {
            console.log(`❌ [Auth] Admin password mismatch for: ${adminEmail}`);
            return null; 
          }
        }

        // --- 2. Database User Verification ---
        try {
          await dbConnect();
          const user = await User.findOne({ email });
          if (user && await bcrypt.compare(password, user.passwordHash)) {
            console.log(`✅ [Auth] User login successful: ${email}`);
            return { id: user._id.toString(), email: user.email, name: user.name };
          }
        } catch (error) {
          console.error('Auth error:', error);
        }

        return null;
      },
    }),
  ],
});
