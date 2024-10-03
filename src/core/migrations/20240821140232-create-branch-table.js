exports.up = function (db, callback) {
  db.createTable('branch', {
    id: { type: 'int', notNull: true, autoIncrement: true, primaryKey: true },
    name: { type: 'string', length: 255, notNull: true },
    status: { type: 'boolean', defaultValue: true },
    address: { type: 'string', length: 255 },
    phone: { type: 'string', length: 255 },
    email: { type: 'string', length: 255 },
    created_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' },
    updated_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' }
  }, function (err) {
    if (err) {
      console.error('err create branch table:', err);
      return callback(err);
    }
    console.log('branch table created successfully');
    callback();
  });
};

exports.down = function (db, callback) {
  db.dropTable('branch', function (err) {
    if (err) {
      console.error('err drop branch table:', err);
      return callback(err);
    }
    console.log('branch table dropped successfully');
    callback();
  });
};