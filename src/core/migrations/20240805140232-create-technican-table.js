exports.up = function (db, callback) {
  db.createTable('available_employee', {
    id: { type: 'int', notNull: true, autoIncrement: true, primaryKey: true },
    employee_id: { type: 'int' },
    is_available: { type: 'boolean', notNull: true, defaultValue: true },
    created_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' },
    updated_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' }
  }, function (err) {
    if (err) {
      console.error('err create available_employee table:', err);
      return callback(err);
    }
    console.log('available_employee table created successfully');
    callback();
  });
};

exports.down = function (db, callback) {
  db.dropTable('available_employee', function (err) {
    if (err) {
      console.error('err drop available_employee table:', err);
      return callback(err);
    }
    console.log('available_employee table dropped successfully');
    callback();
  });
};