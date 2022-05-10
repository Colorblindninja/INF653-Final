const express = require("express");
const router = express();
const statesController = require("../../controllers/statesController");

router.route("/").get(statesController.getStates);

router.route("/:state").get(statesController.getState);
router.route("/:state/capital").get(statesController.getCapital);
router.route("/:state/nickname").get(statesController.getNickname);
router.route("/:state/population").get(statesController.getPopulation);
router.route("/:state/admission").get(statesController.getAdmission);


router.route("/:state/funfact").get(statesController.getRandomFunFact)
  .post(statesController.createfunFact)
  .patch(statesController.updatefunFact)
  .delete(statesController.deletefunFact);


module.exports = router;
