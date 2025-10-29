import React from 'react';
import { Link } from 'react-router-dom';

const Blogs = () => {
    // Copiamos la estructura de la sección <main> y ajustamos las rutas y sintaxis.
    return (
        <main className="blogs-main">
            <h1>BLOG DE HUERTOHOGAR: Vida Saludable y Conciencia Ambiental</h1>

            <section className="blog-item">
                <div className="blog-text">
                    <h2>El Impacto Positivo de Elegir Productos de Temporada</h2>
                    <p>Descubre cómo tu elección de frutas y verduras frescas y de temporada reduce la huella de carbono y apoya la economía de los agricultores locales. ¡Comer sano es cuidar el planeta!</p>
                    {/* Usamos Link para navegar al detalle, asumiendo una ruta genérica para blogs */}
                    <Link to="/blogs/detalle/1" className="btn-primary">Leer artículo completo</Link>
                </div>
                <div className="blog-img">
                    {/* Ruta de imagen ajustada */}
                    <img src="/img/premio-organico.jpg" alt="Agricultura Sostenible" />
                </div>
            </section>

            <section className="blog-item">
                <div className="blog-text">
                    <h2>3 Recetas Rápidas y Saludables con Espinacas y Quinua</h2>
                    <p>Aprende a incorporar súper alimentos como las espinacas y la quinua orgánica en tus comidas diarias. Te mostramos trucos sencillos para conservar la frescura de tus vegetales por más tiempo.</p>
                    {/* Usamos Link para navegar al detalle */}
                    <Link to="/blogs/detalle/2" className="btn-primary">Ver recetas y tips</Link>
                </div>
                <div className="blog-img">
                    {/* Ruta de imagen ajustada */}
                    <img src="/img/frutas.jpg" alt="Tips de Conservación y Cocina" />
                </div>
            </section>

            {/* NOTA: Si tienes más blogs (detalle-blog3.html, detalle-blog4.html), deberás replicar la <section> anterior para cada uno y cambiar el ID en el Link. */}

        </main>
    );
};

export default Blogs;