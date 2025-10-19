import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      nav: {
        features: "Features",
        services: "Services",
        about: "About",
        pricing: "Pricing",
        faq: "FAQ",
      },
      hero: {
        title: "Glastor Solutions",
        subtitle:
          "Innovative technology solutions and premium tool distribution for professionals and businesses.",
        cta: {
          primary: "Request Free Quote",
          secondary: "View Product Catalog",
        },
        fullStackDev: {
          title: "Full Stack Development",
          description:
            "Python specialists, creating robust and scalable software solutions. From powerful APIs to comprehensive web applications.",
        },
        ecommerceDistribution: {
          title: "Ecommerce Distribution",
          description:
            "Official distributors of Makita and Bosch. Premium quality power tools for professionals.",
        },
        stats: {
          satisfaction: "4.9/5 Satisfied Customers",
          projects: "50+ Completed Projects",
        },
      },
      services: {
        title: "Advanced Technological Solutions",
        subtitle:
          "We drive business growth with cutting-edge technologies, intelligent automation, and scalable digital solutions that transform challenges into opportunities.",
        codeCollaboration: {
          title: "Code Collaboration",
          description:
            "Advanced development platforms with Git integration, automated CI/CD, and real-time collaboration tools that optimize team productivity and code quality.",
        },
        projectManagement: {
          title: "Project Management",
          description:
            "Intelligent project management systems with automated workflows, progress tracking, and resource optimization that ensure timely delivery and maximum efficiency.",
        },
        taskAutomation: {
          title: "Task Automation",
          description:
            "Smart automation solutions that eliminate repetitive processes, reduce operational costs, and allow teams to focus on high-value strategic activities.",
        },
      },
      about: {
        title: "About Company",
        description:
          "At Glastor, we transform the digital landscape since 2014. With headquarters in Girona and international presence, we have established ourselves as leaders in two strategic areas:",
        techDevelopment: {
          title: "Cutting-Edge Technological Development",
          description:
            "Our team of Python experts creates digital solutions that make a difference. We develop robust and scalable architectures that turn complex challenges into growth opportunities for our clients. Every line of code we write is designed to drive innovation and operational efficiency.",
        },
        premiumDistribution: {
          title: "Premium Professional Tools Distribution",
          description:
            "As official distributors of Makita and Bosch, we bring excellence to every project. Our e-commerce platform connects professionals and enthusiasts with the highest quality power tools, backed by our expertise in advanced logistics and personalized service.",
        },
      },
      features: {
        title: "Many Great Features",
        responsiveDesign: {
          title: "Responsive Design",
          description:
            "We create fluid web experiences that perfectly adapt to any device. Our automated solutions guarantee optimized interfaces from mobile to 4K screens, maximizing your audience reach and engagement.",
        },
        intuitiveUI: {
          title: "Intuitive User Interface",
          description:
            "We design intuitive interfaces that simplify complex processes through intelligent automation. Our web solutions prioritize user experience with fluid navigation and functionalities that anticipate business needs.",
        },
        aiInsights: {
          title: "AI-Powered Insights",
          description:
            "We power your web applications with advanced artificial intelligence that analyzes data in real-time. Our automated solutions transform complex information into actionable insights that drive strategic decisions and optimize business performance.",
        },
        featureList: [
          "Dark/Light theme",
          "Reviews",
          "Features",
          "Pricing",
          "Contact form",
          "Our team",
          "Responsive design",
          "Newsletter",
          "Minimalist",
        ],
      },
    },
  },
  es: {
    translation: {
      nav: {
        features: "Características",
        services: "Servicios",
        about: "Acerca de",
        pricing: "Precios",
        faq: "FAQ",
      },
      hero: {
        title: "Glastor Solutions",
        subtitle:
          "Soluciones tecnológicas innovadoras y distribución de herramientas premium para profesionales y empresas.",
        cta: {
          primary: "Solicitar Cotización Gratis",
          secondary: "Ver Catálogo de Productos",
        },
        fullStackDev: {
          title: "Desarrollo Full Stack",
          description:
            "Especialistas en Python, creando soluciones software robustas y escalables. Desde APIs potentes hasta aplicaciones web integrales.",
        },
        ecommerceDistribution: {
          title: "Distribución Ecommerce",
          description:
            "Distribuidores oficiales de Makita y Bosch. Herramientas eléctricas de primera calidad para profesionales.",
        },
        stats: {
          satisfaction: "4.9/5 Clientes Satisfechos",
          projects: "50+ Proyectos Completados",
        },
      },
      services: {
        title: "Soluciones Tecnológicas Avanzadas",
        subtitle:
          "Impulsamos el crecimiento empresarial con tecnologías de vanguardia, automatización inteligente y soluciones digitales escalables que transforman desafíos en oportunidades.",
        codeCollaboration: {
          title: "Colaboración de Código",
          description:
            "Plataformas de desarrollo avanzadas con integración Git, CI/CD automatizado y herramientas de colaboración en tiempo real que optimizan la productividad del equipo y la calidad del código.",
        },
        projectManagement: {
          title: "Gestión de Proyectos",
          description:
            "Sistemas inteligentes de gestión de proyectos con flujos de trabajo automatizados, seguimiento de progreso y optimización de recursos que garantizan entregas puntuales y máxima eficiencia.",
        },
        taskAutomation: {
          title: "Automatización de Tareas",
          description:
            "Soluciones de automatización inteligente que eliminan procesos repetitivos, reducen costos operativos y permiten que los equipos se enfoquen en actividades estratégicas de alto valor.",
        },
      },
      about: {
        title: "About Company",
        description:
          "En Glastor, transformamos el panorama digital desde 2014. Con sede central en Girona y presencia internacional, nos hemos consolidado como líderes en dos áreas estratégicas:",
        techDevelopment: {
          title: "Desarrollo Tecnológico de Vanguardia",
          description:
            "Nuestro equipo de expertos en Python crea soluciones digitales que marcan la diferencia. Desarrollamos arquitecturas robustas y escalables que convierten desafíos complejos en oportunidades de crecimiento para nuestros clientes. Cada línea de código que escribimos está diseñada para impulsar la innovación y la eficiencia operativa.",
        },
        premiumDistribution: {
          title: "Distribución Premium de Herramientas Profesionales",
          description:
            "Como distribuidores oficiales de Makita y Bosch, llevamos la excelencia a cada proyecto. Nuestra plataforma de comercio electrónico conecta a profesionales y entusiastas con herramientas eléctricas de la más alta calidad, respaldadas por nuestra experiencia en logística avanzada y atención personalizada.",
        },
      },
      features: {
        title: "Muchas Características Excelentes",
        responsiveDesign: {
          title: "Responsive Design",
          description:
            "Creamos experiencias web fluidas que se adaptan perfectamente a cualquier dispositivo. Nuestras soluciones automatizadas garantizan interfaces optimizadas desde móviles hasta pantallas 4K, maximizando el alcance y engagement de tu audiencia.",
        },
        intuitiveUI: {
          title: "Intuitive user interface",
          description:
            "Diseñamos interfaces intuitivas que simplifican procesos complejos mediante automatización inteligente. Nuestras soluciones web priorizan la experiencia del usuario con navegación fluida y funcionalidades que se anticipan a las necesidades del negocio.",
        },
        aiInsights: {
          title: "AI-Powered insights",
          description:
            "Potenciamos tus aplicaciones web con inteligencia artificial avanzada que analiza datos en tiempo real. Nuestras soluciones automatizadas transforman información compleja en insights accionables que impulsan decisiones estratégicas y optimizan el rendimiento empresarial.",
        },
        featureList: [
          "Tema Oscuro/Claro",
          "Reseñas",
          "Características",
          "Precios",
          "Formulario de contacto",
          "Nuestro equipo",
          "Diseño responsivo",
          "Newsletter",
          "Minimalista",
        ],
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "es", // idioma por defecto
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
