const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/google",passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/twitter", passport.authenticate("twitter", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {failureRedirect: "/login",successRedirect: "/auth/success",}));

router.get(
  "/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),(req, res) => {res.redirect("/");});

router.get("/success", (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Não autenticado" });

  res.json({
    message: "Login bem-sucedido",
    //user: req.user
  });
});

module.exports = router;
