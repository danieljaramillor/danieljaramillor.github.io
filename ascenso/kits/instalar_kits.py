"""Instala las skills de este paquete en un proyecto, sin red ni dependencias."""
from pathlib import Path
import argparse, shutil

def install(source, project, kit, dry_run=False):
    source=Path(source).resolve(); project=Path(project).resolve()
    if not project.is_dir(): raise ValueError('La carpeta del proyecto no existe.')
    if kit not in ('negocio','vida','automatizacion','ambos','todos'): raise ValueError('Kit desconocido.')
    names=['ascenso-negocio','ascenso-vida','ascenso-automatizacion'] if kit=='todos' else ['ascenso-negocio','ascenso-vida'] if kit=='ambos' else ['ascenso-'+kit]
    results=[]
    for name in names:
        src=source/name/'SKILL.md'
        if not src.is_file(): raise ValueError('Falta '+str(src))
        target=project/'.agents'/'skills'/name/'SKILL.md'
        if project not in target.resolve().parents:
            raise ValueError('El destino sale del proyecto por un enlace simbólico. No se escribió nada.')
        if target.exists() and target.read_bytes()!=src.read_bytes():
            raise ValueError('Ya hay una skill distinta en '+str(target)+'. No se sobrescribió.')
        results.append(str(target))
    if not dry_run:
        for name,target in zip(names,results):
            dest=Path(target);dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(source/name/'SKILL.md',dest)
    return results

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--proyecto',default='.',help='Carpeta de proyecto elegida por vos')
    parser.add_argument('--kit',choices=['negocio','vida','automatizacion','ambos','todos'],default='ambos')
    parser.add_argument('--dry-run',action='store_true',help='Mostrar destinos sin escribir')
    args=parser.parse_args()
    for target in install(Path(__file__).resolve().parent,args.proyecto,args.kit,args.dry_run): print(('Revisar: ' if args.dry_run else 'Instalado: ')+target)
