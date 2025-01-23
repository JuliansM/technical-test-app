# Phone Validator Application

Este es un proyecto de Angular que permite validar números de teléfono y gestionar un historial de validaciones. Incluye un servicio para realizar validaciones mediante una API, un componente para interactuar con la aplicación, y pruebas unitarias.

---

## Tabla de Contenidos

- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Ejecución del proyecto](#ejecución-del-proyecto)
- [Ejecución de pruebas](#ejecución-de-pruebas)
- [Estructura principal del proyecto](#estructura-principal-del-proyecto)

---

## Requisitos Previos

Antes de empezar, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (v20.18.0 o superior recomendado)
- [Angular CLI](https://angular.io/cli) (v19.1.3 o superior recomendado)
- [Git](https://git-scm.com/)

Verifica que las herramientas estén instaladas correctamente ejecutando los siguientes comandos:

```bash
node -v
npm -v
ng version
```

## Instalación
### 1. Clonar el repositorio
```
git clone https://github.com/JuliansM/technical-test-app.git
cd technical-test-app
```
### 2. Instalar las dependencias
Ejecuta el siguiente comando para instalar todas las dependencias necesarias:
```
npm install
```
## Ejecución del proyecto
Para ejecutar el proyecto en modo de desarrollo, utiliza el siguiente comando:
```
ng serve
```

## Ejecución de pruebas
El proyecto incluye pruebas unitarias utilizando el framework de pruebas Jasmine y el ejecutor Karma.

### - Ejecutar todas las pruebas unitarias 
```
ng test
```
Esto abrirá un navegador y ejecutará las pruebas, mostrando los resultados.

### - Verificar la cobertura de pruebas
```
ng test --code-coverage
```
El informe de cobertura se generará en la carpeta coverage/. Para visualizarlo, abre el archivo index.html en un navegador:
```
open coverage/index.html
```

## Estructura principal del proyecto
```
src/
├── app/
│   ├── components/
│   │   ├── phone-validator/
│   │   │   ├── phone-validator.component.ts
│   │   │   ├── phone-validator.component.html
│   │   │   ├── phone-validator.component.scss
│   │   │   └── phone-validator.component.spec.ts
│   ├── services/
│   │   ├── phone.service.ts
│   │   ├── notification.service.ts
│   │   └── phone.service.spec.ts
│   ├── models/
│   │   └── phone-validation.interface.ts
│   └── shared/
│       ├── constants.ts
│       └── confirmation-dialog/
│           ├── confirmation-dialog.component.ts
│           ├── confirmation-dialog.component.html
│           ├── confirmation-dialog.component.scss
│           └── confirmation-dialog.component.spec.ts
├── environments/
├── index.html
└── main.ts
└── styles.css
```



