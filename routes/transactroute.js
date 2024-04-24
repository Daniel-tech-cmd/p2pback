const express = require("express");
const router = express.Router();
const {
  deposit,
  trade,
  joinTrade,
  allTrade,
  approvedeposit,
  checkTrade,
} = require("../controllers/transact");
const { isAdmin, auth } = require("../middleware/auth");
router.patch("/deposit/:id", deposit);
router.patch("/trade/:id", auth, trade);
router.patch("/jointrade/:id", auth, joinTrade);
router.patch("/checktrade/:id", auth, checkTrade);
// router.patch("/withdraw/:id", withdraw);
// router.patch("/invest/:id", invest);
// router.patch("/reinvest/:id", reinvest);
// router.patch("/support", support);

router.get("/all", isAdmin, allTrade);
router.patch("/approvedepo/:id", isAdmin, approvedeposit);
// router.patch("/declinedepo/:id", isAdmin, declinedepo);
// router.patch("/approvedwith/:id", isAdmin, approvewithdraw);
// router.patch("/declinedwith/:id", isAdmin, declinewith);

module.exports = router;
