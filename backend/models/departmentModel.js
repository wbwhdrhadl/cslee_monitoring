const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // 부서 이름은 고유해야 함
  password: { type: String, required: true },
});

const Department = mongoose.model('Department', departmentSchema, 'departmentDB');

module.exports = Department;
