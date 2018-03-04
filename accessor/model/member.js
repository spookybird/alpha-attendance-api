module.exports = {
  name: 'member',
  columns: {
    id: {
      type: 'string',
      length: 16,
      key: true,
    },
    password: {
      type: 'string',
      length: 255,
      notNull: true,
    },
    token: {
      type: 'string',
      length: 255,
    },
    client: {
      type: 'string',
      length: 64,
    },
    admin: {
      type: 'boolean',
      notNull: true,
    }
  },
}
