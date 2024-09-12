exports.up = function (db, callback) {
  db.createTable('appointment', {
    id: { type: 'int', notNull: true, autoIncrement: true, primaryKey: true },
    date: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' },
    time: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' },
    status: { type: 'boolean', notNull: true, defaultValue: true },
    customer_id: { type: 'int', notNull: true },
    staff_id: { type: 'int', notNull: true },
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