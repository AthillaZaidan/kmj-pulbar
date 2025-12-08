import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { supabase } from "@/lib/supabase"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false

      try {
        // Check if user exists in database
        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email)
          .single()

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Error fetching user:", fetchError)
          return false
        }

        // Determine role - admin if email is athillazaidanstudy@gmail.com
        const role = user.email === "athillazaidanstudy@gmail.com" ? "admin" : "user"

        if (!existingUser) {
          // Create new user - use email as ID for consistency
          const { error: insertError } = await supabase.from("users").insert({
            id: user.email,
            email: user.email,
            name: user.name || null,
            image: user.image || null,
            role: role,
          })

          if (insertError) {
            console.error("Error creating user:", insertError)
            return false
          }
        } else {
          // Update existing user info
          const { error: updateError } = await supabase
            .from("users")
            .update({
              name: user.name || null,
              image: user.image || null,
              role: role,
            })
            .eq("email", user.email)

          if (updateError) {
            console.error("Error updating user:", updateError)
          }
        }

        return true
      } catch (error) {
        console.error("SignIn callback error:", error)
        return false
      }
    },
    async session({ session, token }) {
      if (session.user && token.email) {
        session.user.id = token.email

        // Fetch user role from database
        try {
          const { data: userData } = await supabase
            .from("users")
            .select("role")
            .eq("email", token.email)
            .single()

          if (userData) {
            session.user.role = userData.role as "user" | "admin"
          }
        } catch (error) {
          console.error("Error fetching user role:", error)
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
