const express = require('express');
const Department = require('../models/departmentModel');

const router = express.Router();

// 부서 인증 로그인 API
router.post('/auth', async (req, res) => {
  const { departmentName, password } = req.body;

  try {
    const department = await Department.findOne({ name: departmentName });
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    if (department.password === password) {
      return res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 부서 등록 API
router.post('/register', async (req, res) => {
  const { departmentName, password } = req.body;

  if (!departmentName || !password) {
    return res.status(400).json({ success: false, message: 'Both department name and password are required' });
  }

  try {
    const existingDepartment = await Department.findOne({ name: departmentName });
    if (existingDepartment) {
      return res.status(409).json({ success: false, message: 'Department name already exists' });
    }

    const newDepartment = new Department({ name: departmentName, password });
    await newDepartment.save();

    return res.status(201).json({ success: true, message: 'Department registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 부서 비밀번호 변경 API
router.put('/update-password', async (req, res) => {
  const { departmentName, oldPassword, newPassword } = req.body;

  if (!departmentName || !oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const department = await Department.findOne({ name: departmentName });
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    if (department.password !== oldPassword) {
      return res.status(401).json({ success: false, message: 'Old password is incorrect' });
    }

    department.password = newPassword;
    await department.save();

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error during password update:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 부서 삭제 API
router.delete('/delete', async (req, res) => {
  const { departmentName } = req.body;

  if (!departmentName) {
    return res.status(400).json({ success: false, message: 'Department name is required' });
  }

  try {
    const department = await Department.findOneAndDelete({ name: departmentName });
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    return res.status(200).json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error during department deletion:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
