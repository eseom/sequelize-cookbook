/**
 * https://stackoverflow.com/questions/34497040/how-do-i-properly-map-attributes-of-relations-in-sequelize-js
 */

const Sequelize = require('sequelize')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './test.db',
  define: {
    underscored: true,
  }
})
const { DataTypes } = Sequelize

var Ingredient = sequelize.define('Ingredient', {
  name: Sequelize.STRING
}, {
    freezeTable: true
  })

var Recipe = sequelize.define('Recipe', {
  name: Sequelize.STRING
}, {
    freezeTable: true
  })

var RecipeIngredient = sequelize.define('RecipeIngredient', {
  amount: Sequelize.DOUBLE
})

Ingredient.belongsToMany(Recipe, {
  through: RecipeIngredient,
})

Recipe.belongsToMany(Ingredient, {
  through: RecipeIngredient,
  as: 'ir',
});

(async () => {
  await sequelize.sync({ force: true })

  const recipe = await Recipe.create({
    name: 'Carrots',
  })
  const ingredient = await Ingredient.create({
    name: 'carrot',
  })
  await recipe.addIr(ingredient, { through: { amount: 10 } })

  Recipe.find({
    include: [{
      model: Ingredient,
      as: 'ir',
      attributes: [
        [sequelize.literal('`ir->RecipeIngredient`.amount'), 'amount'],
      ],
    }],
  }).then(function (r) {
    const t = r.get({ plain: true })
    console.log(t)
  })
})()
  .catch((e) => {
    console.error(e)
  })
