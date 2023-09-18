export const swaggerOpptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Backend Docs',
            description: "Documentación relacionada a los Carts y Products y la ejecución de sus respectivos endpoints"
        }
    },
    apis: ['src/docs/**/*.yaml']
}