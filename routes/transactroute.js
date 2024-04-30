const express = require("express");
const router = express.Router();
const {
  deposit,
  trade,
  joinTrade,
  allTrade,
  onetrade,
  approvedeposit,
  checkTrade,
  patch2,
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
router.patch("/update/:id", isAdmin, patch2);
router.patch("/one/:id", onetrade);
router.patch("/approvedepo/:id", isAdmin, approvedeposit);
// router.patch("/declinedepo/:id", isAdmin, declinedepo);
// router.patch("/approvedwith/:id", isAdmin, approvewithdraw);
// router.patch("/declinedwith/:id", isAdmin, declinewith);

module.exports = router;
