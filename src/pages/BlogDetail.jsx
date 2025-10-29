import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/BlogData'; // Importamos la nueva fuente de datos

const BlogDetail = () => {
    const { blogId } = useParams(); // Obtenemos el ID del blog de la URL
    const post = BLOG_POSTS[blogId];

    if (!post) {
        return (
            <main className="detalle-blog-main" style={{ padding: '50px', textAlign: 'center' }}>
                <h1>Artículo de blog no encontrado.</h1>
                <Link to="/blogs" className="btn-primary">Volver al Blog</Link>
            </main>
        );
    }

    // El contenido HTML completo se inyecta de forma segura desde nuestra fuente de datos
    return (
        <main className="detalle-blog-main">
            <h1>{post.title}</h1>
            <img 
                src={`/${post.image}`} // La ruta se ajusta para la carpeta public/img/
                alt={post.title} 
                className="detalle-img" 
            />
            
            {/* ⚠️ Usamos dangerouslySetInnerHTML para renderizar el HTML que extrajimos de tus archivos. 
                Es seguro porque la fuente es interna. */}
            <div dangerouslySetInnerHTML={{ __html: post.contentHTML }} />
            
            <Link to="/blogs" className="btn-primary">Volver al Blog</Link>
        </main>
    );
};

export default BlogDetail;