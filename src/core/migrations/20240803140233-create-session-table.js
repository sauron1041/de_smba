exports.up = function (db, callback) {
  db.createTable('session', {
    id: { type: 'int', notNull: true, autoIncrement: true, primaryKey: true },
    name: { type: 'string', length: 255, notNull: true },
    service_id: { type: 'int', notNull: true },
    customer_id: { type: 'int', notNull: true },
    staff_id: { type: 'int', notNull: true },
    status: { type: 'boolean', notNull: true, defaultValue: true },
    user_id: { type: 'int' },
    created_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' },
    updated_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' }
  }, function (err) {
    if (err) {
      console.error('err create session table:', err);
      return callback(err);
    }
    console.log('session table created successfully');
    callback();
  });
};

exports.down = function (db, callback) {
  db.dropTable('session', function (err) {
    if (err) {
      console.error('err drop session table:', err);
      return callback(err);
    }
    console.log('session table dropped successfully');
    callback();
  });
};