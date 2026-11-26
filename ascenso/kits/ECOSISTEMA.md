# Más herramientas para pasar de la idea a la prueba

Catálogo revisado el 25 de noviembre de 2026. Son **11 opciones adicionales** a MiroFish, TinyTroupe y OASIS. El [catálogo estructurado](ecosistema.json) permite que tu asistente elija según la tarea y sus capacidades. Estas opciones cumplen funciones diferentes: un formulario consigue respuestas; un simulador genera posibilidades; un tablero ayuda a cumplir acuerdos; una automatización repite un proceso.

## Empezá con el camino más corto

- **Una idea de negocio:** una pregunta concreta → una conversación o formulario → una prueba con una persona → una decisión basada en lo que hizo. Tally o Cal.com ayudan si reducen trabajo; no son requisitos.
- **Algo personal o un hobby:** una primera acción → un momento posible en tu calendario → una nota sobre si lo hiciste y si querés repetir. Podés usar las apps que ya tenés.
- **Una app:** elegí Streamlit, Gradio o Replit según el tipo de prototipo; hacé una sola tarea entendible. Observá a alguien real antes de ampliar funciones.
- **Un compromiso que se te olvida:** responsable + próxima acción + fecha + señal de avance. Empezá con tu calendario y correo; un tablero compartido puede ayudar si el equipo ya lo usa.
- **Una rutina repetida:** hacela una vez de forma manual, medí el tiempo y evaluá una función nativa de tu asistente. Si falta un motor de ejecución, elegí uno entre n8n, Make y Zapier.

Instalar todo este catálogo suele agregar trabajo antes de aprender algo. El setup prepara lo que elijas y pueda verificar. Un servicio con cuenta no se instala como una skill dentro de una conversación; una librería local requiere archivos y terminal. Conectar más apps solo ayuda cuando aportan contexto útil a la prueba.

## Elegí por el paso que estás dando

### Elegir qué vas a probar y quién se compromete

| Herramienta | Para qué sirve en esta prueba | Cómo se prepara | Primera comprobación |
|---|---|---|---|
| [Notion](https://www.notion.com/help/guides/getting-started-with-projects-and-tasks) | Anotar hipótesis, pruebas, responsables y fechas en un tablero compartido. | Abrí un espacio existente o creá una página de proyecto. | Comprobá una tarea ficticia con responsable, fecha y estado. |

### Conseguir respuestas y encuentros reales

| Herramienta | Para qué sirve en esta prueba | Cómo se prepara | Primera comprobación |
|---|---|---|---|
| [Tally](https://tally.so/help/create-a-form) | Publicar un formulario breve para recoger interés, disponibilidad y experiencias. | Creá un formulario con pocas preguntas y una explicación de para qué usarás las respuestas. | Comprobá que la respuesta ficticia aparece y se distingue de las reales. |
| [Cal.com](https://cal.com/help/event-types/event-types) | Conseguir una cita real para entrevistar o probar un prototipo. | Para empezar rápido, usá la cuenta alojada; no hace falta autoalojar. | Revisá el enlace como visitante. |

### Poner una versión pequeña en manos de alguien

| Herramienta | Para qué sirve en esta prueba | Cómo se prepara | Primera comprobación |
|---|---|---|---|
| [Streamlit](https://docs.streamlit.io/get-started/installation) | Crear una app pequeña en Python para probar un flujo con datos, filtros o resultados. | Elegí un proyecto y un entorno Python aislado compatible con la documentación actual. Comando de referencia: `python -m pip install streamlit` en un entorno revisado. | Importá streamlit desde el entorno. |
| [Gradio](https://github.com/gradio-app/gradio#installation) | Convertir una función Python o un modelo en una interfaz que alguien pueda probar. | Prepará un entorno Python aislado compatible. Comando de referencia: `python -m pip install --upgrade gradio` en un entorno revisado. | Importá gradio. |
| [Replit](https://docs.replit.com/features/agent/overview) | Preparar una app desde una descripción y refinarla con pruebas. | Creá un proyecto y describí usuario, tarea, datos ficticios y qué querés observar. | Completá el flujo en preview. |

### Ver qué funciona y dónde se pierde la gente

| Herramienta | Para qué sirve en esta prueba | Cómo se prepara | Primera comprobación |
|---|---|---|---|
| [PostHog](https://posthog.com/docs/product-analytics/installation) | Ver eventos y pasos de un flujo para detectar dónde se abandona. | Definí dos o tres eventos necesarios antes de instrumentar. | Generá un evento ficticio identificado como prueba. |
| [Playwright](https://playwright.dev/docs/intro) | Comprobar que una web deja completar el flujo antes de invitar participantes. | Usá un proyecto de pruebas separado o revisá los cambios al proyecto existente. Comando de referencia: `npm init playwright@latest` en un entorno revisado. | Revisá el test antes de correrlo: completar un formulario puede escribir datos. |

### Repetir una tarea con control y seguimiento

| Herramienta | Para qué sirve en esta prueba | Cómo se prepara | Primera comprobación |
|---|---|---|---|
| [n8n](https://docs.n8n.io/deploy/host-n8n/install-options/install-using-docker-compose.md) | Encadenar datos, condiciones y acciones en un flujo repetible. | Elegí n8n Cloud o autoalojamiento si podés operar el servidor. | Comprobá una ejecución controlada y su historial. |
| [Make](https://help.make.com/create-your-first-scenario) | Unir apps con un escenario visual y una frecuencia o disparador. | Creá un escenario y conectá solo las apps de la rutina elegida. | Una ejecución manual puede producir efectos reales: elegí destino de prueba. |
| [Zapier](https://help.zapier.com/hc/en-us/articles/8496309697421-What-is-a-Zap) | Conectar un evento con acciones para dar seguimiento a una prueba o rutina. | Elegí un trigger y una acción, y autorizá las apps necesarias. | Los tests de acciones pueden escribir en las apps: usá destino de prueba. |

## Lo que tu asistente debe dejarte claro

**Preparado** significa que existe el borrador, la configuración o la instalación y pasó una comprobación identificable. **Activo** significa que se verificó la publicación o ejecución real. **Aprendido** significa que tenés una observación que sirve para decidir: son tres estados distintos.

Para una instalación local, revisá la documentación actual, dependencias y cambios al proyecto; usá un entorno separado cuando corresponda. Para una cuenta o conexión, completá la autorización nativa y los pasos que requieran tu participación. Configurá secretos localmente o en su almacén, sin pegarlos en el chat. El catálogo no contiene versiones inventadas ni afirma que estos servicios estén conectados.

Antes de probar un flujo, revisá sus efectos: un botón “Test” puede enviar información o crear registros reales. En [Zapier, los tests de acciones pueden escribir en la app conectada](https://help.zapier.com/hc/en-us/articles/18811411817741-Test-Zap-steps). Usá destinos de prueba y registros ficticios identificables. No reutilices automáticamente una base de producción para una demo.

Antes de activar recurrencia, dejá definidos el evento o frecuencia, zona horaria, información permitida, resultado, destino, responsable, regla para evitar duplicados y cómo se pausa. Verificá una ejecución y su identificador o historial. Si una credencial o un permiso falta, marcá esa parte pendiente; un chat abierto no sustituye un servidor. Para n8n autoalojado necesitás operar la instancia; Make y Zapier ejecutan los flujos activados en sus servicios, bajo las condiciones reales de tu cuenta. [n8n](https://docs.n8n.io/deploy/host-n8n/install-options/install-using-docker-compose.md), [Make](https://help.make.com/schedule-a-scenario), [Zapier](https://help.zapier.com/hc/en-us/articles/8496309697421-What-is-a-Zap).

Elegí una revisión corta: ¿se hizo la prueba?, ¿qué viste?, ¿qué sigue? Un calendario con una cita no demuestra asistencia; un clic no demuestra valor; una encuesta favorable no demuestra una compra. Si el proceso ya no aporta aprendizaje o ahorro, detenelo. Revisá antes cualquier cambio de plan, consumo de APIs, publicación o invitación de otras personas.

## Detalles útiles antes de elegir

- Streamlit publica un paso `streamlit skills` para preparar sus instrucciones oficiales en agentes compatibles; el asistente debe comprobar compatibilidad y qué quedó instalado. [Instalación oficial](https://docs.streamlit.io/get-started/installation).
- PostHog permite controlar autocaptura, datos sensibles y otras opciones de recolección. Definí solo los eventos que necesitás y revisá esos controles antes de recoger datos. [Controles oficiales](https://posthog.com/docs/privacy/data-collection).
- Playwright comprueba el funcionamiento de un flujo, incluso con emulación móvil. Eso no equivale a una prueba con una persona ni con un teléfono físico. [Documentación oficial](https://playwright.dev/docs/intro).
- Las opciones Next Gen y MCP de Zapier tienen disponibilidad y planes específicos; revisá tu cuenta antes de prometer instalación desde cualquier asistente. [Guía oficial](https://help.zapier.com/hc/en-us/articles/48391476448141-Get-started-with-Next-Gen-Zaps).
- La guía antigua de Docker de n8n remite a Docker Compose. Seguí la documentación actual en lugar de copiar una receta antigua sin revisarla. [Instalación vigente](https://docs.n8n.io/deploy/host-n8n/install-options/install-using-docker-compose.md).

Este documento y su JSON son un catálogo investigado. Al elaborarlos no se instalaron herramientas, crearon cuentas ni activaron servicios. El JSON incluye por herramienta pasos, credenciales requeridas, entorno de ejecución, comprobación, límites de evidencia, costos a revisar y cómo detenerla.
