import React from "react";

const HomeTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Página Principal - Test</h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Bienvenido a Glastor</h2>
          <p className="text-lg">
            Esta es la página principal de prueba. Si puedes ver esto, el enrutamiento básico
            funciona.
          </p>
          <div className="mt-4">
            <a href="/servicios" className="text-blue-600 hover:text-blue-800">
              Ir a Servicios
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTest;
