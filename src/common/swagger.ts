import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Match Exchange API',
      version: '1.0.0',
      description: 'API de matching de ordens BTC/USD',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/**/*.ts'],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
