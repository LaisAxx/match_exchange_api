import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const filePath = path.resolve(__dirname, '../common/docs/swagger.yaml');
const swaggerDocument = yaml.load(fs.readFileSync(filePath, 'utf8')) as object;

export { swaggerUi, swaggerDocument };
