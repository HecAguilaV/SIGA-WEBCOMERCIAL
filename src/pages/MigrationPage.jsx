import React from 'react';
import { RocketLaunch, Wrench, Clock, ArrowLeft, PaperPlaneTilt } from 'phosphor-react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css'; // Reutilizamos base de estilos

const MigrationPage = () => {
    return (
        <div className="migration-container" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #03045e 0%, #0077b6 50%, #00b4d8 100%)',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Elementos Decorativos de Fondo */}
            <div style={{
                position: 'absolute',
                width: '500px',
                height: '500px',
                background: 'rgba(72, 202, 228, 0.1)',
                borderRadius: '50%',
                top: '-100px',
                right: '-100px',
                filter: 'blur(80px)'
            }}></div>
            <div style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                background: 'rgba(0, 180, 216, 0.15)',
                borderRadius: '50%',
                bottom: '-50px',
                left: '-50px',
                filter: 'blur(60px)'
            }}></div>

            <div className="glass-card" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '3rem',
                maxWidth: '700px',
                width: '100%',
                textAlign: 'center',
                color: 'white',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                zIndex: 1,
                animation: 'fadeInUp 0.8s ease-out'
            }}>
                <div className="icon-wrapper" style={{
                    display: 'inline-flex',
                    padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    marginBottom: '2rem',
                    boxShadow: '0 0 30px rgba(72, 202, 228, 0.3)'
                }}>
                    <RocketLaunch size={48} weight="duotone" color="#90e0ef" />
                </div>

                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    marginBottom: '1rem',
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(to right, #fff, #90e0ef)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Estamos Evolucionando
                </h1>

                <p style={{
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '2.5rem'
                }}>
                    ¡Hola! Estamos moviendo el cerebro de <strong>SIGA</strong> a una nueva y más potente infraestructura 
                    para garantizar que tu negocio nunca se detenga. Este es un proceso planificado para ofrecerte 
                    mayor velocidad y estabilidad.
                </p>

                <div className="status-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '3rem'
                }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <Clock size={24} weight="bold" color="#4cc9f0" style={{ marginBottom: '10px' }} />
                        <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', opacity: 0.6 }}>Estado</div>
                        <div style={{ fontWeight: '600' }}>En Progreso</div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <Wrench size={24} weight="bold" color="#4cc9f0" style={{ marginBottom: '10px' }} />
                        <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', opacity: 0.6 }}>Actividad</div>
                        <div style={{ fontWeight: '600' }}>Migración API</div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <PaperPlaneTilt size={24} weight="bold" color="#4cc9f0" style={{ marginBottom: '10px' }} />
                        <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', opacity: 0.6 }}>Prioridad</div>
                        <div style={{ fontWeight: '600' }}>Alta Disponibilidad</div>
                    </div>
                </div>

                <div className="actions" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Link to="/" style={{
                        textDecoration: 'none',
                        color: 'white',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        opacity: 0.7,
                        transition: 'opacity 0.3s'
                    }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
                        <ArrowLeft size={18} /> Volver a la Landing
                    </Link>
                    
                    <div style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        borderRadius: '12px',
                        background: 'rgba(72, 202, 228, 0.1)',
                        fontSize: '0.9rem',
                        fontStyle: 'italic',
                        color: '#90e0ef'
                    }}>
                        "No gestiones tu inventario, gestiona tu tiempo." - {`> Un Soñador con Poca RAM 👨🏻‍💻`}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .glass-card:hover {
                    border-color: rgba(255, 255, 255, 0.2);
                    transform: translateY(-5px);
                    transition: all 0.5s ease;
                }
            `}</style>
        </div>
    );
};

export default MigrationPage;
