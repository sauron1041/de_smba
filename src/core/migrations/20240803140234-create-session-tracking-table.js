exports.up = function (db, callback) {
  db.createTable('session_tracking', {
    id: { type: 'int', notNull: true, autoIncrement: true, primaryKey: true },
    customer_id: { type: 'int', notNull: true },
    session_id: { type: 'string', length: 255, notNull: true },
    process: { type: 'int', defaultValue: 1, comment: '1: bắt đầu, 2: đang xử lý, 3: hoàn thành' },
    note: { type: 'text' },
    branch_id: { type: 'int', notNull: true },
    status: { type: 'boolean', notNull: true, defaultValue: true },
    user_id: { type: 'int' },
    created_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' },
    updated_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' }
  }, function (err) {
    if (err) {
      console.error('err create session_tracking table:', err);
      return callback(err);
    }
    console.log('session_tracking table created successfully');
    callback();
  });
};

exports.down = function (db, callback) {
  db.dropTable('session_tracking', function (err) {
    if (err) {
      console.error('err drop session_tracking table:', err);
      return callback(err);
    }
    console.log('session_tracking table dropped successfully');
    callback();
  });
};