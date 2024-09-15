exports.up = function (db, callback) {
  db.createTable('service_skills', {
    id: { type: 'int', notNull: true, autoIncrement: true, primaryKey: true },
    service_id: { type: 'int', notNull: true },
    skill_id: { type: 'int', notNull: true },
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