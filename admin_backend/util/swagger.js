import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Admin Backend - API',
      version: '1.0.0',
      description: 'API documentation for the DLS Ticket Booking System Admin Backend',
    },
    servers: [
      {
        url: process.env.ADMIN_BACKEND,
        description: 'Local Dev Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      BearerAuth: [],
    }],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

export default specs; 