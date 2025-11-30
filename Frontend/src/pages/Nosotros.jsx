import React from 'react';

const Nosotros = () => {
    // En un componente de contenido estático, copiamos y ajustamos el HTML dentro del return.
    return (
        <main className="nosotros-main">
            <h1>Conéctate con el Campo: La Historia de HuertoHogar</h1>

            <section>
                <h2>Nuestra Historia</h2>
                <p>
                    HuertoHogar nació de la visión de conectar directamente a las familias chilenas con la frescura y calidad de los productos de nuestro campo. Con <strong>más de 6 años de experiencia</strong>, hemos crecido hasta operar en <strong>más de 9 puntos a lo largo del país</strong>. Nos dedicamos a ser el puente entre los agricultores locales y tu mesa, promoviendo un ciclo de consumo más saludable y sostenible.
                </p>
            </section>

            <section>
                <h2>Misión</h2>
                <p>
                    Nuestra misión es proporcionar productos frescos y de calidad directamente desde el campo hasta la puerta de nuestros clientes, garantizando la frescura y el sabor en cada entrega. Nos comprometemos a fomentar una conexión más cercana entre los consumidores y los agricultores locales, apoyando prácticas agrícolas sostenibles y promoviendo una alimentación saludable en todos los hogares chilenos.
                </p>
            </section>

            <section>
                <h2>Visión</h2>
                <p>
                    Nuestra visión es ser la tienda online líder en la distribución de productos frescos y naturales en Chile, reconocida por nuestra calidad excepcional, servicio al cliente y compromiso con la sostenibilidad. Aspiramos a expandir nuestra presencia a nivel nacional e internacional, estableciendo un nuevo estándar en la distribución de productos agrícolas directos del productor al consumidor.
                </p>
            </section>

            <section>
                <h2>Compromiso y Valores</h2>
                <p>En HuertoHogar nos regimos por principios que honran la tierra y la comunidad:</p>
                <p>• <strong>Sostenibilidad:</strong> Apoyamos prácticas agrícolas responsables y buscamos reducir nuestra huella de carbono.</p>
                <p>• <strong>Frescura Garantizada:</strong> Entregamos productos cosechados en su punto óptimo de madurez.</p>
                <p>• <strong>Comercio Justo Local:</strong> Valoramos y respetamos el trabajo de los agricultores chilenos.</p>
                <p>• <strong>Salud y Bienestar:</strong> Promovemos un estilo de vida saludable basado en alimentos naturales y nutritivos.</p>
            </section>

            <section>
                <h2>Nuestros Puntos de Distribución en Chile</h2>
                <p>Operamos en diversas regiones para asegurar la frescura y rapidez de la entrega. ¡Estamos cerca de ti!</p>

                <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                    <h3 style={{ color: 'var(--color-marron-titulo, #8B4513)' }}>Cubrimos las siguientes ciudades:</h3>
                    <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center' }}>
                        <li style={{ display: 'inline-block', margin: '0 10px' }}>Santiago</li>
                        <li style={{ display: 'inline-block', margin: '0 10px' }}>Puerto Montt</li>
                        <li style={{ display: 'inline-block', margin: '0 10px' }}>Villarica</li>
                        <li style={{ display: 'inline-block', margin: '0 10px' }}>Nacimiento</li>
                        <li style={{ display: 'inline-block', margin: '0 10px' }}>Viña del Mar</li>
                        <li style={{ display: 'inline-block', margin: '0 10px' }}>Valparaíso</li>
                        <li style={{ display: 'inline-block', margin: '0 10px' }}>Concepción</li>
                    </ul>
                </div>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    {/* El iframe se mantiene, pero la fuente debe ser una URL válida de Google Maps si deseas que funcione. 
                        Por ahora, mantenemos tu URL original. */}
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d198884.2882110292!2d-70.81223590518868!3d-33.47291122718712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c54117b11c97%3A0x6b48450f9a2b9a79!2sChile!5e0!3m2!1ses-419!2scl!4v1700000000000!5m2!1ses-419!2scl"
                        width="100%" 
                        height="450" 
                        style={{ border: 0, borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} 
                        allowFullScreen={true} // Propiedad en React es camelCase
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade" // Propiedad en React es camelCase
                        title="Mapa de Ubicaciones"
                    >
                    </iframe>
                </div>
            </section>

            <section className="final-nosotros">
                {/* Se asume que tienes una imagen llamada Monitos.png en tu carpeta img/ */}
                <img src="/img/Monitos.png" alt="Equipo de HuertoHogar y productos frescos" className="fotos-nosotros" /> 
                <h2 className="frase-final">¡Lleva la frescura y la salud del campo a tu hogar!</h2>
                <img src="/img/Logo.png" alt="Logo HuertoHogar" className="fotos-nosotros" />
                <p>
                    Descubre la calidad de nuestros productos. ¡Somos el sabor natural de Chile!
                </p>
            </section>
        </main>
    );
};

export default Nosotros;