import React from 'react';

const TestComponent: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>¡Componente de prueba!</h1>
      <p>Si puedes ver este mensaje, React está funcionando correctamente.</p>
      <a href="/tienda" style={{ color: 'blue', textDecoration: 'underline' }}>
        Ir a la tienda
      </a>
    </div>
  );
};

export default TestComponent;