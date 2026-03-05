import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "GubaeTech API",
    version: "1.0.0",
    description:
      "API documentation for GubaeTech – ASTU Gibi Gubae Internal Management System.",
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Local dev server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

export const swaggerOptions: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: ["./src/routes/**/*.ts", "./src/controllers/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);

