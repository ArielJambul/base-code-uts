const Joi = require('joi');

// Skema User BARU: Hapus 'age', tambah 'password'
const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(), // TAMBAHKAN INI
  // age: Joi.number().integer().min(1).max(150).required(), // HAPUS INI
  role: Joi.string().valid('admin', 'user', 'moderator').optional()
});

// Skema Update BARU: Hapus 'age'
const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  // age: Joi.number().integer().min(1).max(150).optional(), // HAPUS INI
  role: Joi.string().valid('admin', 'user', 'moderator').optional()
}).min(1); // At least one field must be provided

// Skema Login BARU: Ubah 'username' menjadi 'name'
const loginSchema = Joi.object({
  name: Joi.string().required(), // UBAH DARI 'username'
  password: Joi.string().required()
});

// Validation middleware for creating users (sekarang untuk registrasi)
const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      message: error.details[0].message,
      details: error.details
    });
  }
  
  next();
};

// Validation middleware for updating users
const validateUserUpdate = (req, res, next) => {
  const { error } = userUpdateSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      message: error.details[0].message,
      details: error.details
    });
  }
  
  next();
};

// Middleware baru untuk login
const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: 'Validation error', message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateUser,
  validateUserUpdate,
  // Hapus validateRegister
  validateLogin     // Ekspor validateLogin
};