import type { OdooApiConfig } from '@/types/api';

// Configuración de la API de Odoo
export const odooConfig: OdooApiConfig = {
  baseUrl: process.env.ODOO_BASE_URL || 'https://your-odoo-instance.com',
  database: process.env.ODOO_DATABASE || '',
  username: process.env.ODOO_USERNAME || '',
  password: process.env.ODOO_PASSWORD || '',
};

// Validar que las variables de entorno estén configuradas
export function validateOdooConfig(): boolean {
  const requiredVars = ['ODOO_BASE_URL', 'ODOO_DATABASE', 'ODOO_USERNAME', 'ODOO_PASSWORD'];
  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    console.warn(
      `Missing Odoo configuration: ${missing.join(', ')}. ` +
      'Please set these environment variables.'
    );
    return false;
  }

  return true;
}
