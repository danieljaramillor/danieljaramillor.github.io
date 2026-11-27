# Elegí una pregunta. Salí con una prueba.

Guía de uso de los tres kits, las skills y las catorce herramientas. Revisada el 26 de noviembre de 2026. Es un recorrido propuesto: no describe instalaciones ni experimentos ya ejecutados.

## 1. Empezá por lo que querés averiguar

Contale al asistente: «Quiero [algo]. Me frena [esto]. Tengo [tiempo y recursos]. Quiero averiguar [pregunta]». El kit de negocio ayuda a encontrar a quién le sirve y qué mostrar; el personal ayuda a elegir una experiencia pequeña; el de automatización revisa tus conexiones y tareas repetidas. Podés pedir el setup completo de las herramientas, pero no hace falta ejecutar todos los simuladores para una primera prueba.

El asistente debe revisar las herramientas y skills que ya existen, preparar las que correspondan y comprobar qué quedó disponible. Si solo conversa, puede dejar instrucciones y borradores; no puede afirmar que una librería quedó instalada en ese chat.

## 2. Elegí por la tarea de hoy

| Herramienta | Qué le das | Qué te deja | Ejemplo y límite |
|---|---|---|---|
| MiroFish | Idea, hechos, supuestos y una pregunta delimitada. | Un escenario y, después de ejecutar con proveedores configurados, registros e informe. | Explorar dudas posibles sobre compartir una ruta. Las dudas son sintéticas: después hay que preguntarle a alguien real. |
| TinyTroupe | Perfiles definidos y una conversación o situación. | Conversaciones y análisis de personajes sintéticos. | Explorar qué información pedirían dos perfiles antes de una prueba. No son entrevistas ni clientes. |
| OASIS | Agentes, acciones, red/plataforma simulada y pocos pasos. | Interacciones registradas en una simulación y su base de datos. | Explorar cómo circularía una propuesta en una red simulada. No publica en redes reales ni predice conducta humana. |
| Notion | Pregunta, acciones, responsables y fechas. | Tablero o página con estado y evidencias. | Llevar tres entrevistas y la decisión pendiente. Una tarjeta marcada no demuestra que la entrevista ocurrió. |
| Tally | Pocas preguntas concretas y una invitación a probar. | Formulario y respuestas revisables. | Preguntar cuándo ocurrió por última vez un problema. Decir «me gusta» no equivale a usar o pagar. |
| Cal.com | Duración, disponibilidad, calendario y zona horaria. | Un enlace para reservar una conversación o prueba. | Ofrecer 15 minutos para observar una tarea. Reservar no demuestra asistencia. |
| Streamlit | Una función Python y datos ficticios. | Una app pequeña con entradas y resultados. | Comparar opciones de ruta de ejemplo. Que funcione no demuestra que alguien la necesite. |
| Gradio | Función y ejemplos de entradas/salidas. | Demo para probar un comportamiento. | Transformar un texto de muestra y revisar errores. Una API detrás puede cobrar aunque la interfaz sea local. |
| Replit | Usuario, una tarea, alcance y datos de ejemplo. | Proyecto y preview de un prototipo. | Una pantalla para reservar turno. Preview no equivale a despliegue público. |
| PostHog | Eventos definidos y proyecto elegido. | Eventos y pasos de un flujo observados. | Ver inicio y final de una tarea, excluyendo pruebas internas. Un clic no demuestra valor. |
| Playwright | Copia de prueba y criterios de funcionamiento. | Tests, aserciones y un resultado o error. | Revisar que se elige una ruta y aparece confirmación. No observa la experiencia de una persona nueva. |
| n8n | Fuente, condición, acción, destino y regla de parada. | Workflow y registro de ejecución. | Pasar una respuesta a una lista de pendientes. Necesita instancia disponible y flujo activado si querés repetición. |
| Make | Apps, campos, filtros y disparador/frecuencia. | Escenario e historial. | Preparar tareas a partir de respuestas de prueba. «Run once» puede escribir en apps reales. |
| Zapier | Evento, acción y registro de prueba. | Zap revisable e historial de acciones. | Preparar un borrador de seguimiento. Guardar un Zap no lo publica ni lo enciende. |

Preparación y fuentes: [simuladores](HERRAMIENTAS.md), [once opciones adicionales](ECOSISTEMA.md). Las cuentas, planes, credenciales y capacidades reales se comprueban al preparar cada herramienta.

## 3. De una idea de negocio a una señal real

**Ejemplo hipotético: compartir un trayecto de Normandía a la Universidad Icesi en Cali, un jueves antes de las siete.** [Guion de la beta 1A](BETA-1A.md).

1. Escribí qué querés averiguar: «¿Dos personas que ya hacen esta ruta quieren compartirla?». Separá hechos de supuestos.
2. Con brainstorming y user-research, prepará preguntas sobre la última vez que hicieron esa ruta. Si usás MiroFish o TinyTroupe, sus respuestas sirven para encontrar preguntas posibles, no para sumar participantes reales.
3. Con write-spec y frontend-design, armá una sola tarea: publicar una oferta de ejemplo o encontrar un puesto compatible con tu hora de recogida. Podés usar Streamlit, Gradio o Replit según el caso. Los tiempos y recorridos de la charla son ficticios.
4. Comprobá el flujo en una copia con datos de ejemplo. Después mostráselo a alguien que haga la ruta; con permiso, observá si puede completar la tarea y preguntá si le sirve.
5. Registrá qué ocurrió y qué dijo la persona. Design-critique y ux-copy ayudan a ajustar la pantalla; synthesize-research y validate-data ayudan a ordenar evidencia y sus límites. Si coordinan otro paso, anotá quién hará qué y cuándo. No coordines un viaje real solo por ejecutar esta demo.

El caso real E3 de Daniel es diferente: un contacto de un fundador permitió una beta gratuita en una empresa de transporte; construyeron con IA una primera versión en una semana y la probaron antes de salir al mercado y levantar capital. No se añaden cifras ni resultados no confirmados. Una empresa que acepta una beta gratis no valida por sí sola todo el mercado.

## 4. De un hobby aplazado a un primer intento

**Ejemplo hipotético: preparar pasta sin comprar una máquina.** El kit personal ayuda a distinguir qué falta aprender, qué recurso falta y qué respuesta te cuesta recibir, sin diagnosticar miedo. Elegí una receta compatible con los utensilios que tenés, poné un rato posible y probá una porción pequeña. Después registrá si la hiciste, qué disfrutaste y si querés repetir. El calendario y unas notas pueden ser suficientes; no hace falta encuesta, analítica ni simulación para decidir si disfrutás una primera cena.

## 5. De un pendiente repetido a tiempo recuperado

**Ejemplo hipotético: revisar una y otra vez un envío.**

1. El kit de automatización comprueba si puede leer el correo elegido y consultar el transportador. Un correo de despacho viejo no es rastreo actualizado.
2. Con tu alcance elegido, identifica el pedido, la fuente y el último estado con fecha. Si falta el transportador o el acceso, marca ese dato pendiente.
3. Propone una revisión programada o por evento si existe esa función. Primero probá una lectura; después decidís si activar la recurrencia. n8n, Make y Zapier son alternativas si la función nativa no alcanza; no hacen falta los tres.
4. Definí cuándo avisar, dónde, cómo evitar duplicados y cuándo parar: por ejemplo, al entregar o cancelar. Verificá identificador, estado, horario y zona horaria de lo creado, además de cómo pausarlo.
5. Medí minutos que usabas antes y revisión/mantenimiento después. Si no mejora tu vida, ajustá o detené la rutina.

Para correos, empezá con borradores de seguimiento y comprobá si ya hubo respuesta. Para reuniones, separá compromisos tuyos, promesas ajenas y propuestas por confirmar. Para calendario, proponé cambios antes de mover reuniones sin una instrucción concreta.

## Qué significa «listo»

- **Paquete descargado:** archivos presentes; falta comprobar carga e instalación.
- **Skill reconocida:** instrucciones disponibles; no implica que sus conectores estén autorizados.
- **Librería preparada:** versión/import o build comprobado; no implica simulación ni API operativa.
- **Prueba ejecutada:** resultado real guardado con condiciones y límites; los ejemplos y datos ficticios se mantienen separados.
- **Automatización activa:** recurso real, horario o disparador, destino y pausa comprobados. Una propuesta o un chat abierto no lo prueban.
- **Aprendizaje útil:** observaste algo que te permite seguir, ajustar o parar. Ninguna herramienta garantiza demanda, disfrute o ahorro.

Al copiar instrucciones no se conectan cuentas, publican prototipos, envían mensajes ni activan recurrencias. El asistente usa la autorización que ya diste y concreta contigo las decisiones que falten.
