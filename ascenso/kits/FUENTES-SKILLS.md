# Skills oficiales de apoyo

Este catálogo acompaña los tres kits Ascenso. Incluye doce carpetas completas de skills oficiales, con recursos y licencias. Son copias de fuentes fijadas, no funciones ejecutadas ni conexiones instaladas. El punto de entrada para preparar el entorno sigue siendo `AGENTS.md`; este documento aporta fuentes y compatibilidad.

## Qué incluye

| Skill | Para qué sirve | Licencia | Fuente |
|---|---|---|---|
| product-brainstorming | Explorar problemas y cuestionar supuestos antes de elegir una solución. | [Apache-2.0](https://github.com/anthropics/knowledge-work-plugins/blob/5e504ae11498f2b8daa30d86b7dab97b2ecd8092/product-management/LICENSE) | [Fuente fijada](https://github.com/anthropics/knowledge-work-plugins/tree/5e504ae11498f2b8daa30d86b7dab97b2ecd8092/product-management/skills/product-brainstorming) |
| write-spec | Convertir una idea en alcance, criterios y una especificación revisable. | [Apache-2.0](https://github.com/anthropics/knowledge-work-plugins/blob/5e504ae11498f2b8daa30d86b7dab97b2ecd8092/product-management/LICENSE) | [Fuente fijada](https://github.com/anthropics/knowledge-work-plugins/tree/5e504ae11498f2b8daa30d86b7dab97b2ecd8092/product-management/skills/write-spec) |
| synthesize-research | Ordenar entrevistas, encuestas y feedback para reconocer temas y límites. | [Apache-2.0](https://github.com/anthropics/knowledge-work-plugins/blob/5e504ae11498f2b8daa30d86b7dab97b2ecd8092/product-management/LICENSE) | [Fuente fijada](https://github.com/anthropics/knowledge-work-plugins/tree/5e504ae11498f2b8daa30d86b7dab97b2ecd8092/product-management/skills/synthesize-research) |
| user-research | Preparar entrevistas y pruebas con participantes reales. | [Apache-2.0](https://github.com/anthropics/knowledge-work-plugins/blob/5e504ae11498f2b8daa30d86b7dab97b2ecd8092/LICENSE) | [Fuente fijada](https://github.com/anthropics/knowledge-work-plugins/tree/5e504ae11498f2b8daa30d86b7dab97b2ecd8092/design/skills/user-research) |
| ux-copy | Mejorar instrucciones, botones, estados vacíos y errores. | [Apache-2.0](https://github.com/anthropics/knowledge-work-plugins/blob/5e504ae11498f2b8daa30d86b7dab97b2ecd8092/LICENSE) | [Fuente fijada](https://github.com/anthropics/knowledge-work-plugins/tree/5e504ae11498f2b8daa30d86b7dab97b2ecd8092/design/skills/ux-copy) |
| design-critique | Revisar usabilidad, jerarquía visual y consistencia de una interfaz. | [Apache-2.0](https://github.com/anthropics/knowledge-work-plugins/blob/5e504ae11498f2b8daa30d86b7dab97b2ecd8092/LICENSE) | [Fuente fijada](https://github.com/anthropics/knowledge-work-plugins/tree/5e504ae11498f2b8daa30d86b7dab97b2ecd8092/design/skills/design-critique) |
| explore-data | Perfilar datos y encontrar nulos, duplicados y patrones antes de analizar. | [Apache-2.0](https://github.com/anthropics/knowledge-work-plugins/blob/5e504ae11498f2b8daa30d86b7dab97b2ecd8092/data/LICENSE) | [Fuente fijada](https://github.com/anthropics/knowledge-work-plugins/tree/5e504ae11498f2b8daa30d86b7dab97b2ecd8092/data/skills/explore-data) |
| validate-data | Revisar metodología, cálculos y evidencia antes de compartir conclusiones. | [Apache-2.0](https://github.com/anthropics/knowledge-work-plugins/blob/5e504ae11498f2b8daa30d86b7dab97b2ecd8092/data/LICENSE) | [Fuente fijada](https://github.com/anthropics/knowledge-work-plugins/tree/5e504ae11498f2b8daa30d86b7dab97b2ecd8092/data/skills/validate-data) |
| frontend-design | Crear interfaces con una dirección visual deliberada y propia. | [Apache-2.0](https://github.com/anthropics/skills/blob/e4bb5d960d87126ff3b3a8af1a104b7db67560ba/skills/frontend-design/LICENSE.txt) | [Fuente fijada](https://github.com/anthropics/skills/tree/e4bb5d960d87126ff3b3a8af1a104b7db67560ba/skills/frontend-design) |
| skill-creator | Crear, mejorar y evaluar instrucciones reutilizables. | [Apache-2.0](https://github.com/anthropics/skills/blob/e4bb5d960d87126ff3b3a8af1a104b7db67560ba/skills/skill-creator/LICENSE.txt) | [Fuente fijada](https://github.com/anthropics/skills/tree/e4bb5d960d87126ff3b3a8af1a104b7db67560ba/skills/skill-creator) |
| jupyter-notebook | Preparar cuadernos reproducibles de experimentos y análisis. | [Apache-2.0](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/jupyter-notebook/LICENSE.txt) | [Fuente fijada](https://github.com/openai/skills/tree/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/jupyter-notebook) |
| notion-knowledge-capture | Guardar conversaciones, decisiones y aprendizajes en páginas de Notion. | [MIT](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/notion-knowledge-capture/LICENSE.txt) | [Fuente fijada](https://github.com/openai/skills/tree/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/notion-knowledge-capture) |

Los nombres, repositorios, commits, rutas exactas, enlaces a SKILL.md, cambios y límites por componente están en `skills-externas.json`. Cada carpeta `externas/<nombre>/` conserva recursos y contiene `ORIGEN.md` con procedencia. Frontend-design y skill-creator tienen Apache 2.0 en estas versiones oficiales; no se asumió una licencia a partir del nombre.

## Instalar conservando contexto

1. Usá la carpeta completa de la skill seleccionada; no copies únicamente SKILL.md si incluye referencias, plantillas o scripts.
2. Revisá ORIGEN.md, la licencia y los archivos antes de ejecutar cualquier helper. La copia incluida en el kit no ejecuta esos archivos.
3. Con Codex, copiá la carpeta a `.agents/skills/<nombre>/` dentro del proyecto elegido. Con Claude Code, a `.claude/skills/<nombre>/`. Conservá versiones distintas existentes. En otros asistentes, comprobá el formato de carga real o usá sus instrucciones en la conversación; no anuncies una instalación que no puedas verificar.
4. Comprobá que el asistente reconoce el nombre y puede resolver sus referencias. Las herramientas que cada skill describe requieren capacidades y permisos propios. Notion necesita una conexión autorizada; Jupyter necesita su entorno si vas a ejecutar cuadernos. Skill-creator contiene pasos específicos de Claude que no deben prometerse en otros asistentes.
5. No configures cuentas, cobros ni servicios persistentes como efecto implícito de cargar una skill. Prepará y comprobá cada componente según la guía común.

## Usar directamente la fuente oficial

También podés descargar el repositorio oficial en el commit indicado y conservar la carpeta de la skill con su contexto. No uses una rama cambiante como si fuera el commit revisado. Conservá licencias y avisos al redistribuir y señalá adaptaciones.

El instalador oficial de Codex admite `--repo`, `--ref`, `--path` y `--dest`, y rechaza destinos existentes. Ejemplo para las dos carpetas de Anthropic:

```sh
python3 scripts/install-skill-from-github.py \
  --repo anthropics/skills \
  --ref e4bb5d960d87126ff3b3a8af1a104b7db67560ba \
  --path skills/frontend-design skills/skill-creator \
  --dest /ruta/proyecto/.agents/skills
```

Ese script pertenece al skill-installer oficial de Codex; no forma parte de estas doce skills. Localizalo en tu entorno antes de usar el ejemplo. No lo ejecutamos para preparar este catálogo.

**Cuidado con Knowledge Work:** el instalador aplana las carpetas. Varias skills enlazan `../../CONNECTORS.md`, que vive fuera de su carpeta original. Copiar solo esa carpeta desde GitHub rompería el enlace. En este paquete se conservó el documento correspondiente como `references/CONNECTORS.md` y se adaptó exclusivamente ese enlace en SKILL.md. El cambio se declara en ORIGEN.md. Si instalás la fuente original, conservá su estructura o resolvé ese contexto antes de darla por lista.

## Límites de la revisión

Se verificaron fuentes públicas oficiales, commits, existencia de SKILL.md, recursos y licencias. No se ejecutaron scripts upstream, cuadernos, evaluaciones ni servicios externos, ni se instaló nada en la cuenta de Daniel. El empaquetado no confirma compatibilidad funcional universal. No reemplaza una prueba mínima posterior en el asistente elegido.
