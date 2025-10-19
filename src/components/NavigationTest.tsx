// Test component para verificar navegación
import React from 'react';

const NavigationTest: React.FC = () => {
  return (
    <div style={{ padding: '20px', margin: '20px', backgroundColor: '#f0f0f0' }}>
      <h2>Test de Navegación</h2>
      <p>Si puedes ver este componente, significa que AboutCinematic se está renderizando.</p>
      <div id="nuestros-numeros-test" style={{ 
        height: '200px', 
        backgroundColor: '#4FC08D', 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        margin: '20px 0'
      }}>
        <h3>SECCIÓN: NUESTROS NÚMEROS (TEST)</h3>
      </div>
      <p>Elemento con ID: nuestros-numeros-test creado para pruebas</p>
    </div>
  );
};

export default NavigationTest;