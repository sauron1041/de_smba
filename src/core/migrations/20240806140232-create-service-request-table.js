exports.up = function (db, callback) {
  db.createTable('service_request', {
    id: { type: 'int', notNull: true, autoIncrement: true, primaryKey: true },
    customer_id: { type: 'int', notNull: true },
    employee_id: { type: 'int', notNull: true },
    service_id: { type: 'int', notNull: true },
    branch_id: { type: 'int', notNull: true },
    status: { type: 'int', notNull: true, defaultValue: 1 },
    check_in_time: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' },
    serving_at: { type: 'timestamp' },
    completed_at: { type: 'timestamp' },
    user_id: { type: 'int', notNull: true },
    updated_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' }
  }, function (err) {
    if (err) {
      console.error('err create service_request table:', err);
      return callback(err);
    }
    console.log('service_request table created successfully');
    callback();
  });
};

exports.down = function (db, callback) {
  db.dropTable('service_request', function (err) {
    if (err) {
      console.error('err drop service_request table:', err);
      return callback(err);
    }
    console.log('service_request table dropped successfully');
    callback();
  });
};