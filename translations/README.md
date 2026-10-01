# English translations

All 13 essays from danieljaramillor.substack.com, translated from Colombian Spanish into English. Each file starts with the English title and subtitle, the original title and link, and a translator's note wherever a title or joke needed a different solution in English.

| # | English title | Original | File |
|---|---|---|---|
| 1 | Two Years Ago Today | Hace 2 Años Hoy | `en/01-two-years-ago-today.md` |
| 2 | The Architecture of Accumulation | La Arquitectura de la Acumulación | `en/02-the-architecture-of-accumulation.md` |
| 3 | Headstrong | Muy llevado de su parecer | `en/03-headstrong.md` |
| 4 | Don't Make Me Choose | No me pidan que elija | `en/04-dont-make-me-choose.md` |
| 5 | Talk Is Cheap | Opinar es gratis | `en/05-talk-is-cheap.md` |
| 6 | I'll Take Care of It | Yo me encargo | `en/06-ill-take-care-of-it.md` |
| 7 | Dancing Without Choreography | Bailar sin coreografía | `en/07-dancing-without-choreography.md` |
| 8 | Under the Rock | Debajo de la roca | `en/08-under-the-rock.md` |
| 9 | Permission to Stop | Permiso para parar | `en/09-permission-to-stop.md` |
| 10 | Pants a Size Too Big | Pantalones grandes | `en/10-pants-a-size-too-big.md` |
| 11 | Making Hard Look Easy | Hacer fácil lo difícil | `en/11-making-hard-look-easy.md` |
| 12 | Seventeen Steps | Diecisiete escalones | `en/12-seventeen-steps.md` |
| 13 | Small Change | Que Pena | `en/13-small-change.md` |

## How the tricky bits were handled

- **Titles keep their meaning, not their words.** *Opinar es gratis* became "Talk Is Cheap", which fits the essay's argument about what knowing costs. *Muy llevado de su parecer* became "Headstrong", which carries the same mix of criticism and backhanded compliment. *Que pena* became "Small Change", because the essay is about *qué pena* as the small coin of apology.
- **Colombian words with no English twin stay in Spanish, with a short explanation the first time they appear:** *obra negra* (bare brick, unfinished construction), *tinto de olla*, and *qué pena*.
- **The wordplay was rebuilt in English where it could be.** *Perdonar* = *per* + *donare* lines up with English *for-give*. The *poena* → *pena* etymology also gives English *pain*, *penalty* and *penance*. "Should have" stands in for *el hubiera*.
- **Caleño voice.** *Ve*, *necio* and *qué más ve* became "hey", "a bad friend" and "what's up?", so the register stays casual.
- **Quotes originally in English (Carrey, Bourdain, Musashi, Gandalf, Hawke) appear once, in English.** The Spanish versions were dropped because they'd only repeat the quote.
- **Two small source glitches were cleaned up:**
  - A section header in *Opinar es gratis* that had been pasted in twice.
  - The "eight days off" line in *Permiso para parar*, which was missing its first half.

## Getting them onto Substack

Substack has no official API for writing posts, so there are three routes:

1. **Cowork with Chrome (recommended).** Have Cowork open the Substack editor and create each essay as a *draft*: title, subtitle and body pasted from these files. Nothing gets published or emailed until you press the button yourself. It's the safest route because you review every post in Substack's own preview.
2. **Codex (or any script) using the unofficial `python-substack` library.** It can create drafts from Markdown, but it logs in with your session cookie and isn't sanctioned by Substack. It works, but it's brittle and against the spirit of their terms. Only worth it if you want to repeat this for every future essay.
3. **By hand.** Open each `.md` file in a Markdown preview, copy the rendered text and paste it into the Substack editor. That's about two minutes per essay.

Before publishing, decide where they live:

- **Same publication, new "English" section (recommended).** Substack sections let readers choose which language they get emailed. Spanish subscribers aren't flooded, and English readers can subscribe to just that section.
- **A separate English publication.** This is cleaner for discovery, but it splits your subscribers.

Whichever you choose, publish the back catalogue **"web only" (no email)**, so subscribers don't get 13 emails in one day. After that, send new essays in both languages as they come out.
