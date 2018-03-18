/**
 * 1:N
 * outer join based on "1" Side with filters
 * 
 * LEFT side: Artist
 * RIGHT side:: Album
 * http://www.sqlitetutorial.net/sqlite-sample-database/
 * 
 * 
 * Artist has several Albums. This is an example of querying or
 * agreegating an Album based on an Artist.
 */

const Sequelize = require('sequelize')
const Table = require('easy-table')

const { INTEGER, STRING } = Sequelize.DataTypes
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './chinook.db',
})

const Artist = sequelize.define('artists', {
  ArtistId: {
    type: INTEGER,
    primaryKey: true,
  },
  Name: STRING(120),
},
  {
    timestamps: false,
  })

const Album = sequelize.define('albums', {
  AlbumId: {
    type: INTEGER,
    primaryKey: true,
  },
  Title: STRING,
},
  {
    timestamps: false,
  })
Album.prototype.toString = () => {
  return '12341234'
}

Artist.hasMany(Album, { foreignKey: 'ArtistId' });

(async () => {
  const artists = await Artist.findAll({
    attributes: [
      'ArtistId',
      'Name',
      [sequelize.fn('COUNT', Sequelize.col('albums.AlbumId')), 'count'],
    ],
    order: [['ArtistId', 'desc']],
    include: [{
      model: Album,
    }],
    group: 'artists.ArtistId',
    having: {
      count: {
        [Sequelize.Op.gt]: 0,
      },
    },
    limit: 10,
    subQuery: false, // https://github.com/sequelize/sequelize/issues/6073
  })

  const t = new Table()

  artists.forEach(function (artist) {
    const data = artist.get({ plain: true })
    Object.keys(data).forEach((k) => {
      t.cell(k, data[k].toString())
    })
    t.newRow()
  })

  console.log(t.toString())

})()
  .catch((e) => {
    console.error(e)
  });
