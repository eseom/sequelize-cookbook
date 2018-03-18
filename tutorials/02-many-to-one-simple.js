/**
 * N:1
 * outer join based on "N" Side
 * 
 * LEFT side:: Project
 * RIGHT side: User
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

  Project.belongsTo(User)

  await sequelize.sync({ force: true })
  const project1 = await Project.create({
    name: 'project1',
  })
  const project2 = await Project.create({
    name: 'project2',
  })
  const user1 = await User.create({
    name: 'username1',
  })

  await project1.setUser(user1)
  await project2.setUser(user1)

  const projects = await Project.findAll({
    order: [['id', 'desc']],
    include: [{
      model: User,
    }],
  })

  console.log(projects.map(p => p.get({ plain: true })))
})()
  .catch((e) => {
    console.error(e)
  })
