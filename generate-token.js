const authService = require('./services/auth-service/src/services/auth.service');
const token = authService.signAccess({ userId: 130230, email: 'admin@studycafe.in', role: 'super_admin' });
console.log(token);
