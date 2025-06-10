import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await dbConnect();

        // Find user by email
        const user = await User.findOne({ email: credentials.email });
        
        if (!user) {
          throw new Error("No account found with this email");
        }

        // Verify password
        const isPasswordMatch = await bcryptjs.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordMatch) {
          throw new Error("Invalid password");
        }

        // Return user object without sensitive information
        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          accountNumber: user.accountNumber,
        };
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accountNumber = user.accountNumber;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.accountNumber = token.accountNumber as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
