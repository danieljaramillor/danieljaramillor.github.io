# Ascenso · Guía común para preparar todos los kits

Entrada pública: https://danieljaramillor.com/ascenso/AGENTS.md

Ayudá a la persona a probar una idea o recuperar tiempo. Conservá su asistente y su proyecto. Este documento coordina un paquete; no sustituye las instrucciones AGENTS.md que ya tenga el proyecto. No lo copies encima de ellas.

## Empezá por el entorno

Identificá asistente, acceso a archivos/terminal/red, funciones de skills y conexiones. Mostrá un plan breve y avanzá con lo autorizado: preparar este paquete permite instalar sus instrucciones en el proyecto elegido; no implica publicar, contactar personas, conceder acceso, activar automatizaciones ni consumir APIs de pago. No pidas confirmaciones repetidas para pasos ya autorizados.

Si solo hay chat, leé el kit y las skills pertinentes como instrucciones en la conversación; no anuncies instalación local. Si no podés abrir enlaces, usá el pedido autocontenido que trajo la persona y explicá cómo adjuntar el paquete. En ChatGPT, Claude, Gemini u otro, verificá si la cuenta permite skills, Gems o instrucciones de proyecto; guiá el guardado que deba hacer la persona y comprobá el resultado.

## Descargar y comprobar el paquete completo

- Paquete: https://danieljaramillor.com/ascenso/kit-completo.zip
- Manifiesto de paquetes y SHA-256: https://danieljaramillor.com/ascenso/kits/manifest.json
- Catálogo de skills, rutas y SHA-256: https://danieljaramillor.com/ascenso/kits/catalogo-skills.json
- Catálogo de herramientas: https://danieljaramillor.com/ascenso/kits/herramientas.json
- Instalación detallada de herramientas: https://danieljaramillor.com/ascenso/kits/HERRAMIENTAS.md

Descargá el ZIP, compará su SHA-256 con el manifiesto y revisá los archivos antes de ejecutar el instalador. Descomprimí en una carpeta nueva. Revisá cada ruta del ZIP y rechazá rutas absolutas, `..` o enlaces que salgan de esa carpeta. El manifiesto detecta errores de descarga; no es una firma independiente del sitio.

## Instalar las 27 skills

El paquete incluye 15 skills originales Ascenso y 12 públicas de Anthropic, OpenAI y Notion Labs con recursos, licencias y revisión fijada. Las 12 públicas y sus necesidades están en `kits/FUENTES-SKILLS.md`.

| Skill | Para qué se usa | Archivo dentro del paquete |
| --- | --- | --- |
| ascenso-negocio | Problema, supuestos y prueba con gente real | ascenso-negocio/SKILL.md |
| ascenso-vida | Experiencia personal y hobbies | ascenso-vida/SKILL.md |
| ascenso-automatizacion | Conexiones, diagnóstico y automatizaciones verificables | ascenso-automatizacion/SKILL.md |
| ascenso-producto | Preguntas, prioridades, alcance y decisiones de producto | biblioteca/ascenso-producto/SKILL.md |
| ascenso-diseno | Recorrido, interfaz, accesibilidad y prueba de uso | biblioteca/ascenso-diseno/SKILL.md |
| ascenso-frontend | Prototipo responsive y comportamiento comprobable | biblioteca/ascenso-frontend/SKILL.md |
| ascenso-datos | Fuentes, métricas y análisis de resultados | biblioteca/ascenso-datos/SKILL.md |
| ascenso-investigacion | Fuentes y supuestos antes de construir | biblioteca/ascenso-investigacion/SKILL.md |
| ascenso-entrevistas | Conversaciones neutrales con personas reales | biblioteca/ascenso-entrevistas/SKILL.md |
| ascenso-experimentos | Hipótesis, prueba y decisión previa | biblioteca/ascenso-experimentos/SKILL.md |
| ascenso-mensaje | Explicar una oferta sin inventar promesas | biblioteca/ascenso-mensaje/SKILL.md |
| ascenso-simulaciones | Preparar escenarios y contrastarlos afuera | biblioteca/ascenso-simulaciones/SKILL.md |
| ascenso-accountability | Compromisos, evidencia y revisión | biblioteca/ascenso-accountability/SKILL.md |
| ascenso-integraciones | Conectores, eventos y flujos reales | biblioteca/ascenso-integraciones/SKILL.md |
| ascenso-verificacion | Comprobar recorrido, resultados y afirmaciones | biblioteca/ascenso-verificacion/SKILL.md |

Las skills de apoyo son instrucciones originales de Ascenso, incluidas completas; no son copias ni instalaciones oficiales de plugins comerciales. No requieren librerías. El catálogo es la lista vigente: instalá todas si se pidió el paquete completo, y cargá solo las relevantes para cada tarea.

Desde la carpeta descomprimida, con Codex y Python:

```sh
python3 instalar_kits.py --kit todos --biblioteca --externas --assistant codex --proyecto /ruta/al/proyecto --dry-run
python3 instalar_kits.py --kit todos --biblioteca --externas --assistant codex --proyecto /ruta/al/proyecto
```

El instalador escribe las instrucciones y, para las skills externas, todos sus recursos y licencias dentro de `.agents/skills/<nombre>/`. No ejecuta sus scripts. Conserva archivos diferentes existentes y rechaza destinos que salgan del proyecto por enlaces simbólicos. Revisá los destinos del dry-run antes de escribir. En Claude Code, copiá todas las skills a `.claude/skills/<nombre>/SKILL.md` o usá el mismo instalador con `--assistant claude-code` tras revisar esa versión. El pedido simple puede preferir copia de texto sin ejecutar Python. No cambies configuración global ni otros proyectos. Comprobá que cada archivo coincide con su origen y que el asistente lo reconoce; si hace falta recargar, indicá ese paso.

## Preparar MiroFish, TinyTroupe y OASIS

Seguí `kits/HERRAMIENTAS.md` y el catálogo. Prepará las tres cuando la persona pida el entorno completo y haya terminal, red y espacio; si pidió solo usar un kit, no conviertas esas herramientas en requisito para empezar. Mostrá progreso por herramienta. Leé documentación y dependencias de su fuente oficial, elegí una revisión concreta y registrala; usá entornos separados y conservá los archivos existentes. No ejecutes una instalación de origen desconocido ni un script que no revisaste.

Cada herramienta puede tener requisitos distintos de Python, Node y servicios de modelo. Una suscripción de chat no prueba que haya una API habilitada. Pedí configurar credenciales en el gestor o archivo local que corresponda, nunca en el chat ni dentro del paquete. Preparar dependencias y probar imports no autoriza simulaciones de pago. No abras un servicio local a internet ni levantes procesos persistentes por instalar.

Terminá lo que no requiera credenciales y marcá el resto como pendiente, sin bloquear todo el paquete. No confundas descargar un repositorio, instalar dependencias, arrancar un servicio y ejecutar una simulación. Una salida sintética sirve para preparar hipótesis, no demuestra demanda ni comportamiento de personas reales.

## Usar las skills juntas

- Negocio: negocio + producto para elegir la pregunta; diseño y frontend si hace falta prototipo; datos para leer la prueba.
- Vida: vida para elegir la experiencia; producto solo si ayuda a acotar, sin convertir el hobby en empresa. Diseño, frontend o datos son opcionales.
- Automatización: automatizacion para conexiones y rutina; producto para priorizar por esfuerzo y ahorro medido; datos para verificar resultados; diseño/frontend solo si hace falta interfaz.
- Simulaciones: primero pregunta y materiales; luego herramienta apropiada, hipótesis y objeciones; después cambiá la prueba y contrastá con gente real. No corras tres simuladores porque estén instalados.

## Acompañar hasta la siguiente prueba

Usá ascenso-accountability para convertir el plan en un compromiso verificable: una acción, una fecha con zona horaria, un criterio observable y un momento de revisión. La persona puede elegir un amigo, colega o el propio asistente como acompañante. Prepará el mensaje para compartir; mandarlo requiere una instrucción concreta y destinatario. Un asistente solo puede volver solo si existe y se creó una tarea o agente real. Si no, dejá el pedido de regreso y una alternativa manual clara.

Guardá, dentro del espacio elegido y si hay archivos, un registro breve con pregunta, supuestos, prueba, responsable, fecha, evidencia, decisión y siguiente paso. En un chat, dejá ese bloque para copiar. El propósito es volver con lo que pasó; si no hubo prueba, reducí el paso o revisá el obstáculo sin inventar progreso ni convertir el hobby en obligación.

## Más herramientas y skills de otras fuentes

- Ecosistema por etapa: https://danieljaramillor.com/ascenso/kits/ECOSISTEMA.md y https://danieljaramillor.com/ascenso/kits/ecosistema.json.
- Skills públicas verificadas: https://danieljaramillor.com/ascenso/kits/FUENTES-SKILLS.md y https://danieljaramillor.com/ascenso/kits/skills-externas.json.

La biblioteca original viene completa en el ZIP. Las doce skills externas se incluyen con sus carpetas completas, licencias y ORIGEN.md; revisá su fuente, revisión, modificaciones de rutas y compatibilidad. Instalar instrucciones no instala todos los plugins ni conecta las cuentas que mencionan. Si ya hay una skill equivalente instalada, usala sin duplicarla. Para nuevas herramientas, elegí por la necesidad, no por el tamaño del catálogo. Primero una ruta mínima que permita aprender; prepará el resto si la persona pidió explícitamente el entorno completo. SaaS, cuentas y conectores se configuran en su interfaz nativa, no se instalan con pip.

## Entrega al terminar

Mostrá una tabla por componente: instalado y comprobado / preparado sin ejecutar / pendiente / no compatible. Agregá ruta o revisión, prueba realizada y siguiente paso concreto. No afirmes que algo está funcionando sin comprobarlo. Decí cómo invocar el kit elegido y proponé una primera acción corta; guardá el estado técnico local sin secretos para poder continuar.
