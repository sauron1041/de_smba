exports.up = function (db, callback) {
  db.createTable('appointment', {
    id: { type: 'int', notNull: true, autoIncrement: true, primaryKey: true },
    date: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' },
    time: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' },
    status: { type: 'int', notNull: true, defaultValue: 1, comment: '1: chờ xác nhận, 2: đã xác nhận, 3: đã hủy' },
    customer_id: { type: 'int' },
    employee_id: { type: 'int' },
    service_id: { type: 'int', notNull: true },
    note: { type: 'text' },
    reminder_sent: { type: 'boolean', notNull: true, defaultValue: false },
    branch_id: { type: 'int', notNull: true },
    user_id: { type: 'int' },
    created_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' },
    updated_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' }
  }, function (err) {
    if (err) {
      console.error('err create appointment table:', err);
      return callback(err);
    }
    console.log('appointment table created successfully');
    callback();
  });
};

exports.down = function (db, callback) {
  db.dropTable('appointment', function (err) {
    if (err) {
      console.error('err drop appointment table:', err);
      return callback(err);
    }
    console.log('appointment table dropped successfully');
    callback();
  });
};