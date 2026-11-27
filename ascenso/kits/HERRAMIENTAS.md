# Prepará las herramientas del kit

Guía revisada el 26 de noviembre de 2026. Entrada común: [AGENTS.md](https://danieljaramillor.com/ascenso/AGENTS.md). Catálogo legible por el asistente: [herramientas.json](herramientas.json).

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

Para completar las tres recetas hacen falta Git, Node con npm y uv. Si falta alguno, seguí su instalación oficial: [Git](https://git-scm.com/downloads/), [Node](https://nodejs.org/en/download) y [uv](https://docs.astral.sh/uv/getting-started/installation/). Para MiroFish, usá Node 22.12 o superior en una versión mantenida compatible: su frontend usa Vite 7.3.6, cuyo requisito real es `^20.19.0 || >=22.12.0`. El mínimo 18 del README de MiroFish no alcanza para ese frontend. [Requisito publicado de Vite](https://registry.npmjs.org/vite/7.3.6). uv puede preparar Python 3.11 para los entornos indicados; registrá si lo descarga. Adaptá comandos y rutas al sistema operativo, sin cambiar configuraciones globales de otros proyectos. Las recetas siguientes usan macOS/Linux; en Windows, el ejecutable del entorno está en `.venv\Scripts\python.exe` en lugar de `.venv/bin/python`.

Creá una carpeta vacía `herramientas-ascenso` dentro del proyecto elegido. No clones encima de trabajo existente. Cada bloque comienza desde esa carpeta. Si el repositorio ya existe, comprobá su origen y estado antes de reutilizarlo; conservá cambios locales.

## 2. MiroFish

Es una interfaz para preparar y explorar escenarios con agentes. La receta usa Node 22.12 o superior compatible, Python 3.11 o 3.12 y uv. Su ejecución usa un proveedor compatible con el SDK de OpenAI y Zep Cloud. Revisá [README](https://github.com/666ghj/MiroFish/blob/main/README.md), [scripts npm](https://github.com/666ghj/MiroFish/blob/main/package.json) y [dependencias Python](https://github.com/666ghj/MiroFish/blob/main/backend/pyproject.toml) antes de ejecutar esta receta:

```sh
git clone https://github.com/666ghj/MiroFish.git mirofish
cd mirofish
git checkout --detach 7657031ac01184afe2cb220f5ee3545573b5e843
git rev-parse HEAD
```

Estas recetas fijan el commit revisado para poder repetir la preparación. Guardá ese commit en el registro del setup. Si querés otra versión, volvé a revisar dependencias y scripts antes de actualizar. Leé los archivos anteriores y los scripts que invoquen. Después:

```sh
npm run setup
uv sync --project backend --python 3.11
npm run build
uv run --project backend python -c "import flask, openai, zep_cloud; print('Dependencias importables')"
uv run --project backend python -m compileall -q backend/app
```

El build y los imports comprueban preparación local; no prueban una simulación. El entorno Python queda en `backend/.venv`. Las dependencias exactas de OASIS incluidas aquí deben permanecer en este entorno.

Para usarlo después: copiá `.env.example` a `.env` solamente si no existe; completá localmente `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL_NAME` y `ZEP_API_KEY`, sin compartir valores en el chat. Verificá proveedor, cuota y presupuesto. Con esa configuración, prepará el arranque local en dos terminales. El comando upstream `npm run dev` usa `--host` en el frontend y `0.0.0.0` en el backend: no lo presentes como limitado a localhost. Para una prueba local, desde la raíz del repo en la primera terminal: `FLASK_HOST=127.0.0.1 npm run backend`. En la segunda: `cd frontend` y después `npm exec -- vite --host 127.0.0.1 --port 3000`. Comprobá puertos 3000 y 5001 y el acceso real. Estos son comandos adaptados a loopback a partir de [backend/run.py](https://github.com/666ghj/MiroFish/blob/7657031ac01184afe2cb220f5ee3545573b5e843/backend/run.py) y [frontend/package.json](https://github.com/666ghj/MiroFish/blob/7657031ac01184afe2cb220f5ee3545573b5e843/frontend/package.json); no se ejecutaron en esta auditoría. No cargues material privado sin decidir qué proveedor lo recibirá. [Configuración y arranque oficiales](https://github.com/666ghj/MiroFish/blob/main/README.md#-quick-start).

## 3. TinyTroupe

Permite preparar personas y conversaciones sintéticas. Requiere Python 3.10 o superior. Su proyecto recomienda instalar desde el repositorio, y documenta OpenAI o Azure OpenAI para los modelos. Revisá [instalación y configuración](https://github.com/microsoft/TinyTroupe/blob/main/README.md#installation) y [dependencias](https://github.com/microsoft/TinyTroupe/blob/main/pyproject.toml).

```sh
git clone https://github.com/microsoft/TinyTroupe.git tinytroupe
cd tinytroupe
git checkout --detach 7ce8be378a37ee73f9745d6781452712318afa04
git rev-parse HEAD
```

Registrá el commit; leé `pyproject.toml`, el README y la configuración antes de instalar:

```sh
uv venv --python 3.11 .venv
uv pip install --python .venv/bin/python -e .
.venv/bin/python -c "from importlib.metadata import version; print('TinyTroupe instalado:', version('tinytroupe'))"
.venv/bin/python -m compileall -q tinytroupe
```

Este entorno pertenece solo a TinyTroupe. Metadata verifica presencia y versión; compileall verifica sintaxis. Todavía no demuestran que el import completo funcione. En el [archivo de inicialización revisado](https://github.com/microsoft/TinyTroupe/blob/7ce8be378a37ee73f9745d6781452712318afa04/tinytroupe/__init__.py), `import tinytroupe` lee e imprime configuración, inicia logging y crea la configuración de embeddings de OpenAI o Azure. Puede requerir una clave aun antes de simular. Cuando el entorno y las credenciales locales estén listos, probá el import completo sin publicar su configuración en el chat. Un import correcto tampoco acredita llamadas al modelo. Para ejecutarlas después, configurá `OPENAI_API_KEY` o las variables Azure que documenta el proyecto (`AZURE_OPENAI_KEY`, `AZURE_OPENAI_ENDPOINT`) mediante el entorno local o el gestor de secretos. Revisá `config.ini` y elegí un modelo que tu cuenta realmente admita. No ejecutes todos los notebooks ni la suite de pruebas como comprobación inicial: pueden llamar modelos y consumir saldo. Abrí un ejemplo acotado únicamente después de acordar propósito, tamaño y presupuesto. [Requisitos y modelos oficiales](https://github.com/microsoft/TinyTroupe/blob/main/README.md#pre-requisites).

## 4. OASIS

Es una librería para simular interacciones sociales. El `pyproject.toml` consultado admite Python desde 3.10 hasta antes de 3.15; esta receta usa 3.11. Revisá [README](https://github.com/camel-ai/oasis/blob/main/README.md#%EF%B8%8F-quick-start) y [dependencias](https://github.com/camel-ai/oasis/blob/main/pyproject.toml). Se instala desde una copia local revisada del repositorio oficial:

```sh
git clone https://github.com/camel-ai/oasis.git oasis
cd oasis
git checkout --detach 2ebf95cc615a9468d97c8dc8eef4ec97a0cec884
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

Las instrucciones se contrastaron con las fuentes enlazadas; **estas herramientas no se instalaron ni ejecutaron al escribir esta guía**. El manifiesto conserva los tres commits revisados y los comandos para seleccionarlos; registrá `git rev-parse HEAD` para comprobar que coinciden. Si elegís actualizar, revisá y registrá la nueva versión antes de ejecutar. Volvé a leer README y archivos de instalación si cambiaron. Si hay una incompatibilidad, explicá el ajuste y comprobalo. No reemplaces silenciosamente un repositorio oficial por un fork o un paquete con nombre parecido.

## Qué podés hacer con el resultado

MiroFish ayuda a preparar un escenario y revisar un informe; TinyTroupe permite conversaciones con perfiles sintéticos; OASIS sirve para estudiar interacciones de muchos agentes en una plataforma simulada. Elegí según la pregunta, sin asumir que necesitás ejecutar los tres. Los ejemplos, las salidas esperadas y cómo pasar de ellos a una prueba real están en [USOS.md](USOS.md). La instalación base sigue dejando las tres herramientas preparadas cuando pedís el setup completo y el entorno lo permite.

Comprobación de esta edición: se revisaron los README, archivos de dependencias y scripts de los commits fijados en `herramientas.json`; también el requisito oficial de Node de Vite 7.3.6. No se importaron herramientas locales ni se ejecutaron simulaciones: instalar sus dependencias pesadas no era necesario para detectar y corregir estos requisitos.
