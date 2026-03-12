import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { prisma } from "../prisma/client";
import { env } from "./env";
import jwt from "jsonwebtoken";

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (clientID && clientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          "http://localhost:4000/auth/google/callback",
      },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done,
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        const fullName = profile.displayName || email || "Google User";

        if (!email) {
          return done(new Error("Google account has no email"), undefined);
        }

        let user = await prisma.user.findFirst({
          where: {
            OR: [{ googleId: profile.id }, { email }],
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              password: null,
              fullName,
              googleId: profile.id,
            },
          });
        } else if (!user.googleId) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId: profile.id },
          });
        }

        const token = jwt.sign(
          { userId: user.id, role: user.role },
          env.jwtSecret,
          { expiresIn: "8h" },
        );

        return done(null, { user, token });
      } catch (err) {
        return done(err as Error, undefined);
      }
    },
    ),
  );
}

export default passport;

