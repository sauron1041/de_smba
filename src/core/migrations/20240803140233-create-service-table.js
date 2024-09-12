exports.up = function (db, callback) {
  db.createTable('service', {
    id: { type: 'int', notNull: true, autoIncrement: true, primaryKey: true },
    name: { type: 'string', length: 255, notNull: true },
    description: { type: 'text' },
    price: { type: 'int', notNull: true },
    status: { type: 'boolean', notNull: true, defaultValue: true },
    branch_id: { type: 'int', notNull: true },
    total_sessions: { type: 'int', notNull: true },
    user_id: { type: 'int' },
    created_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' },
    updated_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' }
  }, function (err) {
    if (err) {
      console.error('err create service table:', err);
      return callback(err);
    }
    console.log('service table created successfully');
    callback();
  });
};

exports.down = function (db, callback) {
  db.dropTable('service', function (err) {
    if (err) {
      console.error('err drop service table:', err);
      return callback(err);
    }
    console.log('service table dropped successfully');
    callback();
  });
};