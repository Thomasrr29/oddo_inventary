import * as xmlrpc from 'xmlrpc';
import { odooConfig } from './config';

/**
 * Cliente para interactuar con la API de Odoo usando XML-RPC
 *
 * Basado en la documentación oficial de Odoo:
 * https://www.odoo.com/documentation/16.0/developer/reference/external_api.html
 *
 * Equivalente en TypeScript del código Python de la documentación:
 * import xmlrpc.client
 * common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(url))
 * uid = common.authenticate(db, username, password, {})
 * models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(url))
 */

class OdooClient {
  private uid: number | null = null;
  private commonClient: xmlrpc.Client | null = null;
  private modelsClient: xmlrpc.Client | null = null;

  constructor() {
    // Inicializar los clientes XML-RPC
    const url = new URL(odooConfig.baseUrl);
    const isSecure = url.protocol === 'https:';

    // Cliente para autenticación (common)
    this.commonClient = isSecure
      ? xmlrpc.createSecureClient({
        host: url.hostname,
        port: url.port ? parseInt(url.port) : 443,
        path: '/xmlrpc/2/common'
      })
      : xmlrpc.createClient({
        host: url.hostname,
        port: url.port ? parseInt(url.port) : 80,
        path: '/xmlrpc/2/common'
      });

    // Cliente para llamadas a modelos (object)
    this.modelsClient = isSecure
      ? xmlrpc.createSecureClient({
        host: url.hostname,
        port: url.port ? parseInt(url.port) : 443,
        path: '/xmlrpc/2/object'
      })
      : xmlrpc.createClient({
        host: url.hostname,
        port: url.port ? parseInt(url.port) : 80,
        path: '/xmlrpc/2/object'
      });
  }

  /**
   * Autenticar con Odoo usando XML-RPC
   * Equivalente en Python: uid = common.authenticate(db, username, password, {})
   */
  async authenticate(): Promise<number | null> {
    try {
      if (!this.commonClient) {
        throw new Error('Common client not initialized');
      }

      console.log('Authenticating with Odoo...');
      console.log('Database:', odooConfig.database);
      console.log('Username:', odooConfig.username);
      console.log('Base URL:', odooConfig.baseUrl);

      // Llamada XML-RPC: common.authenticate(db, username, password, user_agent_env)
      // En Odoo 19+ se requiere el parámetro user_agent_env
      const uid = await new Promise<number | false>((resolve, reject) => {
        this.commonClient!.methodCall('authenticate', [
          odooConfig.database,
          odooConfig.username,
          odooConfig.password,
          {
            base_location: odooConfig.baseUrl,
            lang: 'es_ES',
            tz: 'America/Bogota'
          }
        ], (error: unknown, value: number | false) => {
          console.log('Auth response - Error:', error);
          console.log('Auth response - Value:', value);

          if (error) {
            reject(error);
          } else {
            resolve(value);
          }
        });
      });

      console.log('UID received:', uid, 'Type:', typeof uid);

      // En Odoo, uid puede ser false si falla la autenticación
      // pero puede ser un número válido (incluso 0 para casos especiales)
      if (uid === false || uid === null || uid === undefined) {
        throw new Error('Authentication failed: Invalid credentials - UID is false/null');
      }

      this.uid = uid;
      console.log('Authenticated successfully with uid:', this.uid);
      return this.uid;

    } catch (error) {
      console.error('Odoo authentication error:', error);
      this.uid = null;
      return null;
    }
  }

  /**
   * Ejecutar un método en un modelo de Odoo
   * Equivalente en Python: models.execute_kw(db, uid, password, model, method, args, kwargs)
   */
  private async executeKw(
    model: string,
    method: string,
    args: unknown[] = [],
    kwargs: Record<string, unknown> = {}
  ): Promise<unknown> {
    try {
      // Autenticar si no hay uid
      if (!this.uid) {
        await this.authenticate();
        if (!this.uid) {
          throw new Error('Authentication required');
        }
      }

      if (!this.modelsClient) {
        throw new Error('Models client not initialized');
      }

      // Llamada XML-RPC: models.execute_kw(db, uid, password, model, method, args, kwargs)
      return await new Promise((resolve, reject) => {
        const params: Array<string | number | unknown[] | Record<string, unknown>> = [
          odooConfig.database,
          this.uid as number,
          odooConfig.password,
          model,
          method,
          args
        ];

        // Solo agregar kwargs si tiene propiedades
        if (Object.keys(kwargs).length > 0) {
          params.push(kwargs);
        }

        this.modelsClient!.methodCall('execute_kw', params, (error: unknown, value: unknown) => {
          if (error) {
            reject(error);
          } else {
            resolve(value);
          }
        });
      });
    } catch (error) {
      console.error('Odoo execute_kw error:', error);
      throw error;
    }
  }

  /**
   * Buscar IDs de registros en Odoo
   * Equivalente en Python: models.execute_kw(db, uid, password, model, 'search', [domain])
   */
  async search(
    model: string,
    domain: unknown[] = [],
    options: {
      limit?: number;
      offset?: number;
      order?: string;
    } = {}
  ): Promise<number[]> {
    try {
      const result = await this.executeKw(model, 'search', [domain], options);
      return result as number[];
    } catch (error) {
      console.error('Odoo search error:', error);
      return [];
    }
  }

  /**
   * Contar registros en Odoo
   * Equivalente en Python: models.execute_kw(db, uid, password, model, 'search_count', [domain])
   */
  async searchCount(
    model: string,
    domain: unknown[] = []
  ): Promise<number> {
    try {
      const result = await this.executeKw(model, 'search_count', [domain]);
      return result as number;
    } catch (error) {
      console.error('Odoo search_count error:', error);
      return 0;
    }
  }

  /**
   * Leer registros de Odoo
   * Equivalente en Python: models.execute_kw(db, uid, password, model, 'read', [ids], {'fields': fields})
   */
  async read(
    model: string,
    ids: number[],
    fields: string[] = []
  ): Promise<unknown[]> {
    try {
      const kwargs = fields.length > 0 ? { fields } : {};
      const result = await this.executeKw(model, 'read', [ids], kwargs);
      return result as unknown[];
    } catch (error) {
      console.error('Odoo read error:', error);
      return [];
    }
  }

  /**
   * Buscar y leer registros en una sola llamada
   * Equivalente en Python: models.execute_kw(db, uid, password, model, 'search_read', [domain], kwargs)
   */
  async searchRead(
    model: string,
    domain: unknown[] = [],
    options: {
      fields?: string[];
      limit?: number;
      offset?: number;
      order?: string;
    } = {}
  ): Promise<unknown[]> {
    try {
      const result = await this.executeKw(model, 'search_read', [domain], options);
      return result as unknown[];
    } catch (error) {
      console.error('Odoo search_read error:', error);
      return [];
    }
  }

  /**
   * Crear un registro en Odoo
   * Equivalente en Python: models.execute_kw(db, uid, password, model, 'create', [values])
   */
  async create(model: string, values: Record<string, unknown>): Promise<number | null> {
    try {
      const result = await this.executeKw(model, 'create', [values]);
      return result as number;
    } catch (error) {
      console.error('Odoo create error:', error);
      return null;
    }
  }

  /**
   * Actualizar registros en Odoo
   * Equivalente en Python: models.execute_kw(db, uid, password, model, 'write', [[ids], values])
   */
  async update(model: string, ids: number[], values: Record<string, unknown>): Promise<boolean> {
    try {
      const result = await this.executeKw(model, 'write', [[ids], values]);
      return result as boolean;
    } catch (error) {
      console.error('Odoo update error:', error);
      return false;
    }
  }

  /**
   * Eliminar registros en Odoo
   * Equivalente en Python: models.execute_kw(db, uid, password, model, 'unlink', [[ids]])
   */
  async delete(model: string, ids: number[]): Promise<boolean> {
    try {
      const result = await this.executeKw(model, 'unlink', [[ids]]);
      return result as boolean;
    } catch (error) {
      console.error('Odoo delete error:', error);
      return false;
    }
  }

  /**
   * Llamada genérica a cualquier método de un modelo
   * Útil para métodos personalizados
   */
  async call(
    model: string,
    method: string,
    args: unknown[] = [],
    kwargs: Record<string, unknown> = {}
  ): Promise<unknown> {
    return this.executeKw(model, method, args, kwargs);
  }
}

// Exportar instancia singleton del cliente
export const odooClient = new OdooClient();
