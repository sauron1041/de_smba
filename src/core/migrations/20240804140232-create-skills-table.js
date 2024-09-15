exports.up = function (db, callback) {
  db.createTable('skill', {
    id: { type: 'int', notNull: true, autoIncrement: true, primaryKey: true },
    name: { type: 'string', length: 255, notNull: true },
    description: { type: 'text' },
    level: { type: 'int', notNull: true, defaultValue: 1 },
    category: { type: 'string', length: 255, notNull: true },
    status: { type: 'boolean', notNull: true, defaultValue: true },
    employee_id: { type: 'int' },
    user_id: { type: 'int' },
    created_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' },
    updated_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' }
  }, function (err) {
    if (err) {
      console.error('err create users table:', err);
      return callback(err);
    }
    console.log('users table created successfully');
    callback();
  });
};

exports.down = function (db, callback) {
  db.dropTable('users', function (err) {
    if (err) {
      console.error('err drop users table:', err);
      return callback(err);
    }
    console.log('users table dropped successfully');
    callback();
  });
};