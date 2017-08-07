const robotData = require('./robots.js')
const pgPromise = require('pg-promise')()
const robotDB = pgPromise({ database: 'robots' })

robotDB.task('seed-table-data', task => {
  console.log('DB seeded')
  robotData.forEach(robot => {
    const newRobot = {
      username: robot.username,
      name: robot.name,
      avatar: robot.avatar,
      email: robot.email,
      university: robot.university,
      job: robot.job,
      company: robot.company,
      phone: robot.phone,
      street_num: robot.address.street_num,
      street_name: robot.address.stret_name,
      city: robot.address.city,
      state_or_province: robot.address.state_or_province,
      postal_code: robot.address.postal_code,
      country: robot.address.country
    }
    robotDB
      .one(`INSERT INTO robots (username, name, avatar, email, university, job, company, phone, street_num,
        street_name, city, state_or_province, postal_code, country)
        VALUES($(username), $(name), $(avatar), $(email), $(university), $(job), $(company), $(phone),
        $(street_num), $(street_name), $(city), $(state_or_province), $(postal_code), $(country)) RETURNING id`,
        newRobot).then(newRobot => {
          console.log(newRobot)
        })
    })
    console.log('Successfully seeded the db!')
})
.catch(error => {
  console.log(error)
})
