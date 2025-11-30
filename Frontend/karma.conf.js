// karma.conf.js
module.exports = function(config) {
  config.set({

    // 1. Frameworks: Jasmine es el marco de pruebas.
    frameworks: ['jasmine'],

    // 2. Archivos a cargar (Importante: deben estar en orden de dependencia)
    files: [
      // Cargamos la lógica pura primero (para que las pruebas la encuentren)
      'src/utils/*.logic.js',
      // Luego cargamos los archivos de pruebas (los que contienen las specs)
      'src/utils/*.logic.spec.js'
    ],

    // 3. Opciones de Reportería
    reporters: ['progress', 'kjhtml'], // 'kjhtml' para ver resultados en el navegador

    // 4. Servidores (puerto por defecto)
    port: 9876,

    // 5. Configuración de Navegadores (usamos Chrome para ver el reporte)
    browsers: ['Chrome'], 

    // 6. Otras configuraciones
    singleRun: true, // Ejecutar una sola vez y salir
    concurrency: Infinity
  })
}