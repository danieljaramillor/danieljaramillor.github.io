"""Instala las skills de este paquete en un proyecto, sin red ni dependencias."""
from pathlib import Path
import argparse, shutil, json, re, hashlib

def install(source, project, kit, dry_run=False, biblioteca=False, assistant="codex", externas=False):
    source=Path(source).resolve(); project=Path(project).resolve()
    if not project.is_dir(): raise ValueError('La carpeta del proyecto no existe.')
    if kit not in ('negocio','vida','automatizacion','ambos','todos'): raise ValueError('Kit desconocido.')
    names=['ascenso-negocio','ascenso-vida','ascenso-automatizacion'] if kit=='todos' else ['ascenso-negocio','ascenso-vida'] if kit=='ambos' else ['ascenso-'+kit]
    if assistant not in ("codex", "claude-code"): raise ValueError("Asistente no compatible con instalación en archivos.")
    catalog=json.loads((source/'catalogo-skills.json').read_text()) if (source/'catalogo-skills.json').is_file() else {'skills':[]}
    entries={s['name']:s for s in catalog['skills']}
    if biblioteca:
        names += [name for name in entries if name not in ('ascenso-negocio','ascenso-vida','ascenso-automatizacion')]
    external_names=set()
    if externas:
        external_catalog=json.loads((source/'skills-externas.json').read_text())
        for entry in external_catalog['skills']:
            entries[entry['name']]=entry; external_names.add(entry['name'])
            if entry['name'] not in names: names.append(entry['name'])
    results=[]
    operations=[]
    for name in names:
        if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',name): raise ValueError('Nombre de skill inválido.')
        entry=entries.get(name)
        src=source/entry['path'] if entry else source/name/'SKILL.md'
        if source not in src.resolve().parents: raise ValueError('La fuente sale del paquete.')
        if not src.is_file(): raise ValueError('Falta '+str(src))
        if entry and entry.get('sha256') and hashlib.sha256(src.read_bytes()).hexdigest()!=entry['sha256']: raise ValueError('El contenido no coincide con el manifiesto: '+name)
        target=project/('.claude' if assistant=='claude-code' else '.agents')/'skills'/name/'SKILL.md'
        if project not in target.resolve().parents:
            raise ValueError('El destino sale del proyecto por un enlace simbólico. No se escribió nada.')
        sources=sorted(src.parent.rglob('*')) if name in external_names else [src]
        for file in sources:
            if file.is_dir(): continue
            if source not in file.resolve().parents: raise ValueError('Un recurso sale del paquete.')
            dest=target.parent/file.relative_to(src.parent)
            if project not in dest.resolve().parents: raise ValueError('Un recurso sale del proyecto.')
            if dest.exists() and dest.read_bytes()!=file.read_bytes():
                raise ValueError('Ya hay una versión distinta en '+str(dest)+'. No se sobrescribió.')
            operations.append((file,dest))
        results.append(str(target))
    if not dry_run:
        for src,dest in operations:
            dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(src,dest)
    return results

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--proyecto',default='.',help='Carpeta de proyecto elegida por vos')
    parser.add_argument('--kit',choices=['negocio','vida','automatizacion','ambos','todos'],default='ambos')
    parser.add_argument('--externas',action='store_true',help='Sumar skills públicas con sus recursos y licencias')
    parser.add_argument('--biblioteca',action='store_true',help='Sumar producto, diseño, frontend y datos')
    parser.add_argument('--assistant',choices=['codex','claude-code'],default='codex')
    parser.add_argument('--dry-run',action='store_true',help='Mostrar destinos sin escribir')
    args=parser.parse_args()
    for target in install(Path(__file__).resolve().parent,args.proyecto,args.kit,args.dry_run,args.biblioteca,args.assistant,args.externas): print(('Revisar: ' if args.dry_run else 'Instalado: ')+target)
