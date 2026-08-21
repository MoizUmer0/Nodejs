const express = require("express")
const {handleGetAllUsers,handleGetUserById,
      handleUpdateUserById,handelDeleteUserById,
      handleCreateNewUser } = require('../controllers/user')
const router = express.Router()


router.route("/") 
    .get(handleGetAllUsers)
    .post(handleCreateNewUser)
router.route("/:id")
    .get(handleGetUserById)
    .patch(handleUpdateUserById) 
    .delete(handelDeleteUserById)

  module.exports = router


