exports.up = function (db, callback) {
  db.createTable('customer_queue', {
    id: { type: 'int', notNull: true, autoIncrement: true, primaryKey: true },
    customer_id: { type: 'int', notNull: true },
    check_in_time: { type: 'timestamp', notNull: true },
    status: { type: 'int', defaultValue: 1 },
    service_id: { type: 'int', notNull: true },
    user_id: { type: 'int', notNull: true },
    created_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' },
    updated_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' }
    // status: 'waiting' | 'serving' | 'completed';
  }, function (err) {
    if (err) {
      console.error('err create customer_queue table:', err);
      return callback(err);
    }
    console.log('customer_queue table created successfully');
    callback();
  });
};

exports.down = function (db, callback) {
  db.dropTable('customer_queue', function (err) {
    if (err) {
      console.error('err drop customer_queue table:', err);
      return callback(err);
    }
    console.log('customer_queue table dropped successfully');
    callback();
  });
};