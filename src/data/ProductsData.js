// src/data/ProductsData.js

export const PRODUCTOS = [
    // Frutas Frescas (FR) - Categoría: frutas-frescas
    { id: "FR001", nombre: "Manzanas Fuji", precio: 1200, imagen: "img/Manzanas Fuji.jpg", descripcion: "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres. Se distinguen por su textura firme y su sabor equilibrado entre dulce y ácido.", categoria: "frutas-frescas", stock: 150, origen: "Valle del Maule" },
    { id: "FR002", nombre: "Naranjas Valencia", precio: 1000, imagen: "img/Naranjas Valencia.jpg", descripcion: "Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes. Cultivadas en condiciones climáticas óptimas que aseguran su dulzura y jugosidad.", categoria: "frutas-frescas", stock: 200, origen: "Región de Coquimbo" },
    { id: "FR003", nombre: "Plátanos Cavendish", precio: 800, imagen: "img/Plátanos Cavendish.jpg", descripcion: "Plátanos maduros y dulces, perfectos para el desayuno o como snack energético. Estos plátanos son ricos en potasio y vitaminas, ideales para mantener una dieta equilibrada.", categoria: "frutas-frescas", stock: 250, origen: "Importación Justa" },

    // Verduras Orgánicas (VR) - Categoría: verduras-organicas
    { id: "VR001", nombre: "Zanahorias Orgánicas", precio: 900, imagen: "img/Zanahorias Orgánicas.jpg", descripcion: "Zanahorias crujientes cultivadas sin pesticidas en la Región de O'Higgins. Excelente fuente de vitamina A y fibra, ideales para ensaladas, jugos o como snack saludable.", categoria: "verduras-organicas", stock: 100, origen: "Región de O'Higgins" },
    { id: "VR002", nombre: "Espinacas Frescas", precio: 700, imagen: "img/Espinacas Frescas.jpg", descripcion: "Espinacas frescas y nutritivas (bolsa de 500g), cultivadas bajo prácticas orgánicas que garantizan su calidad y valor nutricional, perfectas para ensaladas y batidos verdes.", categoria: "verduras-organicas", stock: 80, origen: "Productores Locales" },
    { id: "VR003", nombre: "Pimientos Tricolores", precio: 1500, imagen: "img/Pimientos Tricolores.jpg", descripcion: "Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos. Ricos en antioxidantes y vitaminas, añaden un toque vibrante y saludable a cualquier receta.", categoria: "verduras-organicas", stock: 120, origen: "Central de Abastos" },

    // Productos Orgánicos (PO) - Categoría: productos-organicos
    { id: "PO001", nombre: "Miel Orgánica", precio: 5000, imagen: "img/Miel Orgánica.jpg", descripcion: "Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes y con un sabor inigualable, perfecta para endulzar de manera natural tus comidas y bebidas. (Frasco 500g)", categoria: "productos-organicos", stock: 50, origen: "Colmenares del Sur" },
    { id: "PO002", nombre: "Quinua Orgánica", precio: 3800, imagen: "img/Quinua Orgánica.jpg", descripcion: "Grano andino altamente nutritivo, procesado responsablemente para mantener sus beneficios saludables. Estos productos son perfectos para quienes buscan opciones alimenticias que aporten bienestar.", categoria: "productos-organicos", stock: 75, origen: "Altiplano Chileno" },

    // Productos Lácteos (PL) - Categoría: lacteos
    { id: "PL001", nombre: "Leche Entera de Campo", precio: 1800, imagen: "img/Leche Entera.jpg", descripcion: "Leche fresca de campo que conserva su frescura y sabor auténtico. Proviene de granjas locales dedicadas a la producción responsable y de calidad. Rica en calcio y nutrientes esenciales.", categoria: "lacteos", stock: 90, origen: "Granja de Los Lagos" }
];

export const CUPONES = {
    "CAMPO10": { tipo: "percent", valor: 10 } 
};