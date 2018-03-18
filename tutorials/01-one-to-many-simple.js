/**
 * 1:N
 * outer join based on "1" Side
 * 
 * LEFT side: User
 * RIGHT side:: Project
 */

const Sequelize = require('sequelize');

(async () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './test.db',
    define: {
      underscored: true,
    }
  })
  const { STRING } = Sequelize.DataTypes

  const User = sequelize.define('users', { name: STRING })

  const Project = sequelize.define('projects', { name: STRING })

  User.hasMany(Project)

  await sequelize.sync({ force: true })
  await User.create({
    name: 'username1',
    projects: [{
      name: 'project1'
    }, {
      name: 'project2'
    }]
  },
    {
      include: [Project]
    })

  const user = await User.find({
    order: [['id', 'desc']],
    include: [{
      model: Project,
    }],
  })

  console.log(user.get({ plain: true }))
})()
  .catch((e) => {
    console.error(e)
  });
