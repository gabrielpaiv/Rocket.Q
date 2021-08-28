const { open } = require('sqlite')
const Database = require('../db/config')
module.exports = {
  async create(req, res) {
    const db = await Database()
    let pass = req.body.password
    let isRoom = true
    while (isRoom) {
      let roomId = ''
      for (var i = 0; i < 6; i++) {
        roomId += Math.floor(Math.random() * 10)
      }
      const roomsExistIds = await db.all(`SELECT id FROM rooms`)

      isRoom = roomsExistIds.some(roomExistId => {
        roomExistId === roomId
      })

      if (!isRoom) {
        await db.run(`INSERT INTO rooms(
          id,
          pass
        ) VALUES(
          ${parseInt(roomId)},
          ${pass}
        )`)
        isRoom = false
        await db.close()
        res.redirect(`/room/${roomId}`)
      }
    }
  },
  async open(req, res) {
    const roomId = req.params.room
    const db = await Database()

    const questions = await db.all(
      `SELECT * FROM questions WHERE room = ${roomId} and readed = 0`
    )
    const questionsReaded = await db.all(
      `SELECT * FROM questions WHERE room = ${roomId} and readed = 1`
    )
    let isQuestions =
      questions.length == 0 && questionsReaded.length == 0 ? false : true
    res.render('room', {
      roomId: roomId,
      questions: questions,
      questionsReaded: questionsReaded,
      isQuestions: isQuestions
    })
  },
  enter(req, res) {
    const roomId = req.body.roomId
    res.redirect(`/room/${roomId}`)
  }
}
