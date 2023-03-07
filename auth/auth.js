const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const UserModel = require("../model/model");

const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      mobile_noField: "mobile_no",
      passwordField: "password",
      roleField: "role",
    },
    async (email, mobile_no, password, role, done) => {
      const existUser = await UserModel.findOne({ email, mobile_no });
      if (existUser) {
        res.json({ success: false, data: "This Email already exist" });
      } else {
        try {
          const user = await UserModel.create({
            email,
            mobile_no,
            password,
            role,
          });

          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    }
  )
);

passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });

       

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: "TOP_SECRET",
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token"),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
