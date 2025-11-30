import React from 'react';
import RecommendedProducts from '../components/products/RecommendedProducts'; // Crearemos este componente

const Home = () => {
    return (
        <main>
            <section>
                <h2>¡Descubre la frescura del campo con HuertoHogar!</h2>
                <p>Conéctate con la naturaleza y lleva lo mejor de frutas, verduras y productos orgánicos frescos
                    directamente a tu mesa. Con más de 6 años de experiencia, garantizamos calidad del campo a tu hogar.
                    ¡Únete a un estilo de vida saludable y sostenible!
                </p>
            </section>

            <section>
                <h2>Nuestra Cosecha Recomendada de la Semana</h2>
                {/* Aquí renderizamos el componente que se encargará de obtener y mostrar los productos */}
                <RecommendedProducts />
            </section>
        </main>
    );
}

export default Home;