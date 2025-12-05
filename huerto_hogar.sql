-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-12-2025 a las 05:44:14
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `huerto_hogar`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `boletas`
--

CREATE TABLE `boletas` (
  `id` bigint(20) NOT NULL,
  `detalle_productos` varchar(5000) DEFAULT NULL,
  `estado` varchar(255) NOT NULL,
  `fecha_compra` datetime(6) NOT NULL,
  `total` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `boletas`
--

INSERT INTO `boletas` (`id`, `detalle_productos`, `estado`, `fecha_compra`, `total`, `user_id`) VALUES
(1, '[{\"id\":1,\"nombre\":\"Manzanas Fuji\",\"precio\":1200,\"imagen\":\"img/Manzanas Fuji.jpg\",\"qty\":3},{\"id\":3,\"nombre\":\"Plátanos Cavendish\",\"precio\":800,\"imagen\":\"img/Plátanos Cavendish.jpg\",\"qty\":4}]', 'Pendiente', '2025-12-03 01:30:36.000000', 6120, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contactos`
--

CREATE TABLE `contactos` (
  `id` bigint(20) NOT NULL,
  `asunto` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `fecha_envio` datetime(6) DEFAULT NULL,
  `mensaje` varchar(1000) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `id` bigint(20) NOT NULL,
  `categoria` varchar(255) DEFAULT NULL,
  `codigo` varchar(255) DEFAULT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `origen` varchar(255) DEFAULT NULL,
  `precio` int(11) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`id`, `categoria`, `codigo`, `descripcion`, `imagen`, `nombre`, `origen`, `precio`, `stock`) VALUES
(1, 'frutas-frescas', 'FR001', 'Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres. Se distinguen por su textura firme y su sabor equilibrado entre dulce y ácido.', 'img/Manzanas Fuji.jpg', 'Manzanas Fuji', 'Valle del Maule', 1200, 150),
(2, 'frutas-frescas', 'FR002', 'Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes. Cultivadas en condiciones climáticas óptimas que aseguran su dulzura y jugosidad.', 'img/Naranjas Valencia.jpg', 'Naranjas Valencia', 'Región de Coquimbo', 1000, 200),
(3, 'frutas-frescas', 'FR003', 'Plátanos maduros y dulces, perfectos para el desayuno o como snack energético. Estos plátanos son ricos en potasio y vitaminas, ideales para mantener una dieta equilibrada.', 'img/Plátanos Cavendish.jpg', 'Plátanos Cavendish', 'Importación Justa', 800, 250),
(4, 'verduras-organicas', 'VR001', 'Zanahorias crujientes cultivadas sin pesticidas en la Región de O\'Higgins. Excelente fuente de vitamina A y fibra, ideales para ensaladas, jugos o como snack saludable.', 'img/Zanahorias Orgánicas.jpg', 'Zanahorias Orgánicas', 'Región de O\'Higgins', 900, 100),
(5, 'verduras-organicas', 'VR002', 'Espinacas frescas y nutritivas (bolsa de 500g), cultivadas bajo prácticas orgánicas que garantizan su calidad y valor nutricional, perfectas para ensaladas y batidos verdes.', 'img/Espinacas Frescas.jpg', 'Espinacas Frescas', 'Productores Locales', 700, 80),
(6, 'verduras-organicas', 'VR003', 'Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos. Ricos en antioxidantes y vitaminas, añaden un toque vibrante y saludable a cualquier receta.', 'img/Pimientos Tricolores.jpg', 'Pimientos Tricolores', 'Central de Abastos', 1500, 120),
(7, 'productos-organicos', 'PO001', 'Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes y con un sabor inigualable, perfecta para endulzar de manera natural tus comidas y bebidas. (Frasco 500g)', 'img/Miel Orgánica.jpg', 'Miel Orgánica', 'Colmenares del Sur', 5000, 50),
(8, 'productos-organicos', 'PO002', 'Grano andino altamente nutritivo, procesado responsablemente para mantener sus beneficios saludables. Estos productos son perfectos para quienes buscan opciones alimenticias que aporten bienestar.', 'img/Quinua Orgánica.jpg', 'Quinua Orgánica', 'Altiplano Chileno', 3800, 75),
(9, 'lacteos', 'PL001', 'Leche fresca de campo que conserva su frescura y sabor auténtico. Proviene de granjas locales dedicadas a la producción responsable y de calidad. Rica en calcio y nutrientes esenciales.', 'img/Leche Entera.jpg', 'Leche Entera de Campo', 'Granja de Los Lagos', 1800, 90);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `comuna` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `region` varchar(255) NOT NULL,
  `rol` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `rut` varchar(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `comuna`, `contrasena`, `correo`, `nombre`, `region`, `rol`, `direccion`, `rut`) VALUES
(1, 'Providencia', '$2a$10$seo8wEgBaB0D04X7iGyz/uJ/.jdRPiG0ndoIjgwo6GdTUZxqn0WvO', 'mauricio@profesor.duoc.cl', 'Mauricio González', 'Santiago', 'administrador', NULL, ''),
(3, 'Santiago', '$2a$10$zVKbBMiraY8CHyp.NRiEPONto/qB8LQ8IYYMGsQSTmSEi90wLhM7W', 'sergio@gmail.com', 'sergio', 'Santiago', 'cliente', NULL, ''),
(5, 'Santiago', '$2a$10$AbPfntX2B1c9c3cFD9hhguELiCMdAH9vumUg4vG4qthzme.co8Yzy', 'suazo@gmail.com', 'pele suazo', 'Santiago', 'cliente', 'el roble 500', '15873489-4');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `boletas`
--
ALTER TABLE `boletas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `contactos`
--
ALTER TABLE `contactos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKglp83g62hbf9v7i6cibudd0p6` (`codigo`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKqs4hlsdf7l1k1u4on057c0949` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `boletas`
--
ALTER TABLE `boletas`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `contactos`
--
ALTER TABLE `contactos`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
