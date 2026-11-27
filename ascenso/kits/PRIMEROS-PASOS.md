# Empezá con el kit que te sirve

| Si querés… | Elegí | Qué podés llevarte hoy |
|---|---|---|
| Comprobar si una idea de negocio le sirve a alguien | **Negocio** | Una pregunta, la prueba más chica y una señal que podés observar con una persona real. |
| Intentar un hobby o algo que venís aplazando | **Personal** | Una primera experiencia con lo que ya tenés y un momento para probarla. |
| Recuperar tiempo de una tarea que repetís | **Automatización** | Un diagnóstico de conexiones, hasta tres opciones y un plan para probar una. |

## Elegí dónde usarlo

**Para la experiencia completa en ChatGPT**, usá un plan pago compatible y abrí **Work** si tu cuenta lo tiene habilitado. Comprobá qué skills, archivos, conexiones y programación podés usar en ese espacio. La disponibilidad cambia según el plan, el dispositivo y los permisos del espacio de trabajo. [Ayuda oficial de ChatGPT Work y Codex](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex).

Un **chat de solo texto** sirve para ordenar una idea, pensar preguntas y preparar un plan. Para instalar librerías, leer tus apps o programar tareas de verdad, necesitás un entorno con esas funciones y acceso a las fuentes. Si usás Claude, Gemini, Codex o Claude Code, seguí la ruta de tu plataforma más abajo.

## Probá el pedido en una conversación

1. Abrí [el selector de Ascenso](https://danieljaramillor.com/ascenso/#kits), elegí el kit y seleccioná tu asistente.
2. Copiá el pedido, pegalo y envialo. Si ya abriste el ZIP, podés pegar las instrucciones de `ascenso-negocio/SKILL.md`, `ascenso-vida/SKILL.md` o `ascenso-automatizacion/SKILL.md`.
3. Contale una situación concreta. Por ejemplo, «Quiero hacer pasta fresca el sábado. Tengo 40 minutos y todavía no sé si necesito máquina». Elegí una primera acción y acordá qué vas a mirar después.

## Guardalo para volver a usarlo

| Dónde lo usás | Camino de guardado | Cómo comprobás que quedó listo |
|---|---|---|
| Codex o Claude Code en un proyecto | Seguí el pedido de instalación o ejecutá el instalador Python desde el ZIP descomprimido. | Confirmá que el asistente muestra la skill en el proyecto y probala con un ejemplo. |
| Claude web | Descargá el ZIP individual del kit desde el selector. Importalo desde Personalizar → Skills si tu cuenta tiene habilitada la función. | Buscá el nombre en Skills y revisá que esté habilitada. |
| Gemini web o Mac | Descargá el archivo de la skill como `SKILL.md`. Importalo desde Personalizar → Skills si aparece en tu cuenta. | Revisá que la skill aparezca y se pueda usar en un chat. |
| ChatGPT u otro asistente | En ChatGPT Work usá las funciones habilitadas en tu cuenta. Si solo tenés chat, pegá el pedido para preparar el plan. | Verificá que podés volver a seleccionar las instrucciones guardadas. |

En Codex o Claude Code, cada ZIP de proyecto incluye los tres kits, **27 skills** y las guías de **14 herramientas**. El selector determina qué pedís instalar. Para instalar solo un kit, elegí su nombre con `--kit negocio`, `--kit vida` o `--kit automatizacion`. Para el paquete completo usá `--kit todos --biblioteca --externas`. El destino se elige con `--assistant codex` o `--assistant claude-code`. [Guía para el asistente](https://danieljaramillor.com/ascenso/AGENTS.md).

Desde la carpeta descomprimida, este ejemplo revisa los destinos del kit personal en Codex. Reemplazá la ruta entre comillas por la de tu proyecto. Si está bien, repetí el comando sin `--dry-run`.

```sh
python3 instalar_kits.py --kit vida --assistant codex --proyecto "/ruta/a/mi proyecto" --dry-run
```

El ZIP de proyecto lleva las instrucciones, sus recursos y las licencias. Los archivos para importar en Claude web y Gemini corresponden a un kit a la vez. Las herramientas externas, sus cuentas y sus conexiones tienen su propio setup. Consultá [qué hace cada herramienta](USOS.md), [cómo preparar los simuladores](HERRAMIENTAS.md) y [cómo preparar las otras herramientas](ECOSISTEMA.md).

Una primera instalación está lista cuando el asistente reconoce el kit y podés empezar un caso de ejemplo. Para una automatización, primero probá la rutina con datos de muestra. Si después la activás, comprobá el horario o disparador y cómo pausarla.


## Cuando la primera respuesta esté lista

Pedí que termine con cuatro cosas: **qué harías, qué necesitás, cómo se comprueba y qué esperarías aprender**. Para negocio, [ensayá cómo observar el corredor Normandía → Icesi](BETA-1A.md). Para un hobby, anotá cuándo harías el primer intento y qué te gustaría decidir después. Para una automatización, pedí distinguir lo que se comprobó con una fuente de lo que queda preparado para activar.
