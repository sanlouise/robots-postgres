const robotData = require('./robots.js');
const pgPromise = require('pg-promise')();
const robotDB = pgPromise({ database: 'robots' });

console.log(robotData);

robotDB.none(`DROP TABLE IF EXISTS robots`)
  .then(() => (
    robotDB.none(`CREATE TABLE robots (
      "id" SERIAL primary key,
      "username" varchar(30) NOT NULL,
      "name" varchar(40) NOT NULL,
      "avatar" varchar(100),
      "email" varchar(60),
      "university" varchar(100),
      "job" varchar(40),
      "company" varchar(70),
      "phone" varchar(25),
      "street_num" varchar(30),
      "street_name" varchar(60),
      "city" varchar(30),
      "state_or_province" varchar(40),
      "postal_code" varchar(20),
      "country" varchar(70));`)

  )).then(() => {
    console.log('DB seeded')
    console.log(robotData[0])
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
        street_name: robot.address.street_name,
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
          newRobot)
          .then(newRobot => {
            console.log(newRobot)
          })
      })
      console.log('Successfully seeded the db!')
    .catch(error => {
      console.log(error)
    })

});
