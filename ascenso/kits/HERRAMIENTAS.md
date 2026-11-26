# Prepará las herramientas del kit

Guía revisada el 25 de noviembre de 2026. Entrada común: [AGENTS.md](https://danieljaramillor.com/ascenso/AGENTS.md). Catálogo legible por el asistente: [herramientas.json](herramientas.json).

Si pediste el setup completo y tu asistente tiene terminal, el recorrido prepara **MiroFish, TinyTroupe y OASIS**. Primero lee los repositorios y los archivos de instalación; después crea una carpeta independiente para cada uno, instala dependencias y hace las comprobaciones de abajo. No ejecuta simulaciones ni llama modelos por defecto. Si una herramienta necesita una clave para continuar, deja ese paso pendiente y sigue preparando las otras.

Si tu asistente solo conversa, puede acompañarte con las instrucciones y preparar el experimento, pero no afirmar que instaló estas librerías dentro del chat. Hace falta un entorno con archivos y terminal. Un conector de correo tampoco instala un simulador: son piezas distintas.

## 1. Revisá lo disponible

Desde la carpeta de trabajo elegida, comprobá:

```sh
git --version
node --version
npm --version
uv --version
```

Para completar las tres recetas hacen falta Git, Node con npm y uv. Si falta alguno, seguí su instalación oficial: [Git](https://git-scm.com/downloads/), [Node](https://nodejs.org/en/download) y [uv](https://docs.astral.sh/uv/getting-started/installation/). Elegí una versión mantenida de Node que cumpla los requisitos del repositorio. uv puede preparar Python 3.11 para los entornos indicados; registrá si lo descarga. Adaptá comandos y rutas al sistema operativo, sin cambiar configuraciones globales de otros proyectos. Las recetas siguientes usan macOS/Linux; en Windows, el ejecutable del entorno está en `.venv\Scripts\python.exe` en lugar de `.venv/bin/python`.

Creá una carpeta vacía `herramientas-ascenso` dentro del proyecto elegido. No clones encima de trabajo existente. Cada bloque comienza desde esa carpeta. Si el repositorio ya existe, comprobá su origen y estado antes de reutilizarlo; conservá cambios locales.

## 2. MiroFish

Es una interfaz para preparar y explorar escenarios con agentes. Requiere Node 18 o superior, Python 3.11 o 3.12 y uv. Su ejecución usa un proveedor compatible con el SDK de OpenAI y Zep Cloud. Revisá [README](https://github.com/666ghj/MiroFish/blob/main/README.md), [scripts npm](https://github.com/666ghj/MiroFish/blob/main/package.json) y [dependencias Python](https://github.com/666ghj/MiroFish/blob/main/backend/pyproject.toml) antes de ejecutar esta receta:

```sh
git clone https://github.com/666ghj/MiroFish.git mirofish
cd mirofish
git rev-parse HEAD
```

Guardá ese commit en el registro del setup. Leé los archivos anteriores y los scripts que invoquen. Después:

```sh
npm run setup
uv sync --project backend --python 3.11
npm run build
uv run --project backend python -c "import flask, openai, zep_cloud; print('Dependencias importables')"
uv run --project backend python -m compileall -q backend/app
```

El build y los imports comprueban preparación local; no prueban una simulación. El entorno Python queda en `backend/.venv`. Las dependencias exactas de OASIS incluidas aquí deben permanecer en este entorno.

Para usarlo después: copiá `.env.example` a `.env` solamente si no existe; completá localmente `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL_NAME` y `ZEP_API_KEY`, sin compartir valores en el chat. Verificá proveedor, cuota y presupuesto. Con esa configuración y una ejecución acordada, `npm run dev` inicia los servicios documentados en los puertos 3000 y 5001; comprobá que queden accesibles solo donde autorizaste. No cargues material privado sin decidir qué proveedor lo recibirá. [Configuración y arranque oficiales](https://github.com/666ghj/MiroFish/blob/main/README.md#-quick-start).

## 3. TinyTroupe

Permite preparar personas y conversaciones sintéticas. Requiere Python 3.10 o superior. Su proyecto recomienda instalar desde el repositorio, y documenta OpenAI o Azure OpenAI para los modelos. Revisá [instalación y configuración](https://github.com/microsoft/TinyTroupe/blob/main/README.md#installation) y [dependencias](https://github.com/microsoft/TinyTroupe/blob/main/pyproject.toml).

```sh
git clone https://github.com/microsoft/TinyTroupe.git tinytroupe
cd tinytroupe
git rev-parse HEAD
```

Registrá el commit; leé `pyproject.toml`, el README y la configuración antes de instalar:

```sh
uv venv --python 3.11 .venv
uv pip install --python .venv/bin/python -e .
.venv/bin/python -c "import tinytroupe; print('TinyTroupe importable')"
.venv/bin/python -m compileall -q tinytroupe
```

Este entorno pertenece solo a TinyTroupe. Un import correcto no acredita llamadas al modelo. Para ejecutarlas después, configurá `OPENAI_API_KEY` o las variables Azure que documenta el proyecto (`AZURE_OPENAI_KEY`, `AZURE_OPENAI_ENDPOINT`) mediante el entorno local o el gestor de secretos. Revisá `config.ini` y elegí un modelo que tu cuenta realmente admita. No ejecutes todos los notebooks ni la suite de pruebas como comprobación inicial: pueden llamar modelos y consumir saldo. Abrí un ejemplo acotado únicamente después de acordar propósito, tamaño y presupuesto. [Requisitos y modelos oficiales](https://github.com/microsoft/TinyTroupe/blob/main/README.md#pre-requisites).

## 4. OASIS

Es una librería para simular interacciones sociales. El `pyproject.toml` consultado admite Python desde 3.10 hasta antes de 3.15; esta receta usa 3.11. Revisá [README](https://github.com/camel-ai/oasis/blob/main/README.md#%EF%B8%8F-quick-start) y [dependencias](https://github.com/camel-ai/oasis/blob/main/pyproject.toml). Se instala desde una copia local revisada del repositorio oficial:

```sh
git clone https://github.com/camel-ai/oasis.git oasis
cd oasis
git rev-parse HEAD
```

Tras registrar el commit y revisar archivos:

```sh
uv venv --python 3.11 .venv
uv pip install --python .venv/bin/python -e .
.venv/bin/python -c "import oasis; print('OASIS importable')"
.venv/bin/python -m compileall -q oasis
```

No mezcles este entorno con MiroFish: pueden fijar versiones diferentes de sus dependencias. El ejemplo oficial usa `OPENAI_API_KEY`; configurala localmente si elegís ese proveedor. No ejecutes el ejemplo completo para comprobar la instalación: genera acciones de modelos y puede cobrar consumo. Además, usa una base de datos de ejemplo; elegí un archivo nuevo para una prueba posterior. Acordá pocos agentes, pocos pasos y un límite de consumo antes de simular. [Ejemplo y documentación oficiales](https://github.com/camel-ai/oasis#%EF%B8%8F-quick-start).

## 5. Comprobá qué quedó listo

El asistente debe devolver una tabla breve por herramienta:

| Campo | Qué debe mostrar |
|---|---|
| Fuente | Repositorio oficial y commit descargado |
| Entorno | Carpeta, Python y versiones instaladas relevantes |
| Preparación | Comando ejecutado y resultado real: pasó o error resumido |
| Credenciales | Configuradas, faltantes o no comprobadas; nunca sus valores |
| Ejecución | No iniciada, iniciada con comprobación, o bloqueada con motivo |
| Próximo paso | Una acción concreta para vos |

No presentes `preparado` como `funcionando con modelos`. Si un import falla por una dependencia nativa, investigá ese error y el requisito oficial para tu sistema; no saltees la prueba ni marques éxito. No instales componentes del sistema o servicios de pago como solución implícita. Si solo faltan credenciales, conservá las instalaciones comprobadas y señalá exactamente qué parte depende de ellas.

Antes de una primera simulación, prepará una pregunta, material de ejemplo sin datos privados, perfiles y supuestos visibles, presupuesto, tamaño y criterio de parada. Confirmá la ejecución concreta cuando implique consumo. Guardá el resultado real y sus límites. El paso siguiente es convertir una observación sintética en una pregunta o prueba con personas reales: ninguna de estas herramientas demuestra por sí sola demanda, disfrute, compras ni comportamiento humano futuro.

## Actualización y alcance de esta guía

Las instrucciones se contrastaron con las fuentes enlazadas; **estas herramientas no se instalaron ni ejecutaron al escribir esta guía**. El manifiesto no inventa un commit fijado: el asistente debe resolverlo al descargar y registrar el valor real. Volvé a leer README y archivos de instalación si cambiaron. Si hay una incompatibilidad, explicá el ajuste y comprobalo. No reemplaces silenciosamente un repositorio oficial por un fork o un paquete con nombre parecido.
