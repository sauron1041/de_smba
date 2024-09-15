exports.up = function (db, callback) {
  db.createTable('service_package', {
    id: { type: 'int', notNull: true, autoIncrement: true, primaryKey: true },
    name: { type: 'string', length: 255, notNull: true },
    status: { type: 'boolean', notNull: true, defaultValue: true },
    user_id: { type: 'int' },
    created_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' },
    updated_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' }
  }, function (err) {
    if (err) {
      console.error('err create service_package table:', err);
      return callback(err);
    }
    console.log('service_package table created successfully');
    callback();
  });
};

exports.down = function (db, callback) {
  db.dropTable('service_package', function (err) {
    if (err) {
      console.error('err drop service_package table:', err);
      return callback(err);
    }
    console.log('service_package table dropped successfully');
    callback();
  });
};