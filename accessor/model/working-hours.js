const commonInfo = require('./common-info');

module.exports = {
  name: 'working_hours',
  columns: Object.assign({
    workPatternId: {
      type: 'string',
      length: 16,
      notNull: true,
      key: true,
      reference: {
        table: 'work_pattern',
        column: 'id',
      },
    },
    startTime: {
      type: 'time',
      key: true,
    },
    breakTime: {
      type: 'boolean',
    },
  }, commonInfo),
}
