import pdfplumber
import json
import hashlib
import re
import os
from datetime import datetime
from typing import List, Dict, Any

# ============================================================
# CONFIGURACIÓN - AJUSTA SEGÚN SEA NECESARIO
# ============================================================

RUTA_PDF = "Ensayos Discursos - Anacleto Gonzalez Flores.pdf"
CARPETA_SALIDA = "ensayos_extraidos"
AUTOR_DEFAULT = "beato-anacleto-gonzalez-flores"
CATEGORIA_DEFAULT = "ensayos-y-discursos"

# ============================================================
# TUS ENSAYOS CON LOS RANGOS DE PÁGINAS
# ============================================================

ensayos = [
    {
        "titulo": "EL VERDADERO SENTIDO DE LA VIDA",
        "fecha": "1916-08-26",
        "pagina_inicio": 3,
        "pagina_fin": 9,
        "resumen": "Una profunda reflexión sobre el propósito existencial del ser humano y su relación con lo divino."
    },
    {
        "titulo": "LA ARISTOCRACIA DEL TALENTO",
        "fecha": "1916-08-26",
        "pagina_inicio": 10,
        "pagina_fin": 18,
        "resumen": "El talento como nueva nobleza en la sociedad moderna y su responsabilidad moral."
    },
    {
        "titulo": "EL ARTE Y LA CIVILIZACION",
        "fecha": "1916-08-26",
        "pagina_inicio": 19,
        "pagina_fin": 26,
        "resumen": "La relación intrínseca entre la expresión artística y el progreso de la civilización."
    },
    {
        "titulo": "LA LITERATURA Y LA CIVILIZACION",
        "fecha": "1916-08-26",
        "pagina_inicio": 27,
        "pagina_fin": 32,
        "resumen": "La literatura como espejo de la sociedad y motor del desarrollo civilizatorio."
    },
    {
        "titulo": "LA MISION DE LA MUJER",
        "fecha": "1916-08-26",
        "pagina_inicio": 33,
        "pagina_fin": 40,
        "resumen": "El rol fundamental de la mujer en la sociedad y su misión trascendente en la historia."
    }
]

# ============================================================
# FUNCIONES DE CONVERSIÓN A LEXICAL
# ============================================================

def generar_slug(titulo: str) -> str:
    """Genera un slug amigable para URL desde el título"""
    slug = titulo.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    slug = slug.strip('-')
    return slug

def texto_a_nodos_lexical(texto: str) -> Dict[str, Any]:
    """
    Convierte texto plano a la estructura de nodos de Lexical.
    Detecta párrafos automáticamente.
    """
    if not texto or not texto.strip():
        return {
            "root": {
                "children": [
                    {
                        "type": "paragraph",
                        "children": [
                            {"text": "", "type": "text"}
                        ]
                    }
                ],
                "type": "root",
                "format": "",
                "indent": 0,
                "version": 1
            }
        }
    
    # Dividir en párrafos (por saltos de línea dobles)
    parrafos = re.split(r'\n\s*\n', texto.strip())
    
    children = []
    for parrafo in parrafos:
        parrafo_limpio = parrafo.strip()
        if not parrafo_limpio:
            continue
        
        # Limpiar caracteres especiales que puedan romper JSON
        parrafo_limpio = parrafo_limpio.replace('"', '\\"').replace('\n', ' ')
        
        nodo_parrafo = {
            "type": "paragraph",
            "children": [
                {
                    "text": parrafo_limpio,
                    "type": "text"
                }
            ]
        }
        children.append(nodo_parrafo)
    
    if not children:
        children.append({
            "type": "paragraph",
            "children": [
                {"text": "", "type": "text"}
            ]
        })
    
    return {
        "root": {
            "children": children,
            "type": "root",
            "format": "",
            "indent": 0,
            "version": 1
        }
    }

def extraer_resumen_automatico(texto: str, max_chars: int = 200) -> str:
    """Extrae un resumen automático de las primeras líneas si no se proporciona"""
    lineas = texto.strip().split('\n')
    for linea in lineas:
        linea_limpia = linea.strip()
        if linea_limpia and len(linea_limpia) > 20:
            if len(linea_limpia) > max_chars:
                return linea_limpia[:max_chars] + "..."
            return linea_limpia
    return ""

# ============================================================
# EXTRACCIÓN Y CONVERSIÓN DE ENSAYOS
# ============================================================

def extraer_y_convertir_ensayos(pdf_path: str, ensayos_list: List[Dict]) -> List[Dict]:
    """
    Extrae los ensayos del PDF y los convierte al formato Payload CMS.
    """
    ensayos_payload = []
    
    # Verificar que el PDF existe
    if not os.path.exists(pdf_path):
        print(f"❌ ERROR: No se encuentra el PDF: {pdf_path}")
        print("   Verifica que el archivo esté en la misma carpeta que este script.")
        return []
    
    with pdfplumber.open(pdf_path) as pdf:
        total_paginas = len(pdf.pages)
        print(f"📄 PDF: {os.path.basename(pdf_path)}")
        print(f"📊 Total de páginas: {total_paginas}\n")
        print("=" * 80)
        
        for idx, ensayo in enumerate(ensayos_list, 1):
            titulo = ensayo["titulo"]
            fecha = ensayo["fecha"]
            start = ensayo["pagina_inicio"] - 1  # Índice 0
            end = ensayo["pagina_fin"] - 1
            
            print(f"\n📖 Ensayo {idx}: {titulo}")
            print(f"   📍 Páginas: {ensayo['pagina_inicio']}-{ensayo['pagina_fin']}")
            
            # Validar rango de páginas
            if start < 0 or end >= total_paginas or start > end:
                print(f"   ⚠️  Rango inválido, saltando...")
                continue
            
            # Extraer texto del PDF
            texto_completo = ""
            for pagina_num in range(start, end + 1):
                pagina = pdf.pages[pagina_num]
                texto = pagina.extract_text()
                if texto:
                    texto_completo += texto + "\n\n"
            
            # Limpiar texto
            texto_completo = re.sub(r'\n\s*\n', '\n\n', texto_completo.strip())
            
            # Generar slug
            slug = generar_slug(titulo)
            
            # Obtener resumen
            resumen = ensayo.get("resumen")
            if not resumen:
                resumen = extraer_resumen_automatico(texto_completo)
            
            # Convertir a Lexical
            contenido_lexical = texto_a_nodos_lexical(texto_completo)
            
            # Construir el payload final para el CMS
            payload_ensayo = {
                "titulo": titulo,
                "slug": slug,
                "categoria": CATEGORIA_DEFAULT,
                "autor": [AUTOR_DEFAULT],
                "contenido": contenido_lexical,
                "resumen": resumen,
                "fechaPublicacion": f"{fecha}T00:00:00.000Z"
            }
            
            ensayos_payload.append(payload_ensayo)
            
            # Guardar también como TXT para respaldo
            os.makedirs(CARPETA_SALIDA, exist_ok=True)
            nombre_archivo = f"{slug}_{fecha}.txt"
            ruta_archivo = os.path.join(CARPETA_SALIDA, nombre_archivo)
            with open(ruta_archivo, "w", encoding="utf-8") as f:
                f.write(texto_completo)
            
            print(f"   ✅ Convertido a Lexical ({len(texto_completo):,} caracteres)")
            print(f"   🔑 Slug: {slug}")
            print(f"   📝 Resumen: {resumen[:80]}..." if len(resumen) > 80 else f"   📝 Resumen: {resumen}")
            print(f"   💾 Archivo: {nombre_archivo}")
    
    return ensayos_payload

# ============================================================
# GENERACIÓN DE PAYLOAD COMPLETO
# ============================================================

def generar_payload_completo(ensayos_payload: List[Dict]) -> Dict:
    """
    Genera el payload completo con metadatos
    """
    return {
        "metadata": {
            "version": "1.0",
            "fecha_generacion": datetime.now().isoformat(),
            "total_ensayos": len(ensayos_payload),
            "autor_default": AUTOR_DEFAULT,
            "categoria_default": CATEGORIA_DEFAULT,
            "pdf_fuente": RUTA_PDF
        },
        "ensayos": ensayos_payload
    }

# ============================================================
# FUNCIONES DE INYECCIÓN
# ============================================================

def inyectar_payload(payload: Dict, metodo: str = "json", url: str = None, token: str = None):
    """
    Inyecta el payload en el website según el método elegido
    """
    
    if metodo == "json":
        # Guardar como JSON
        with open("payload_ensayos_completo.json", "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
        print(f"\n📦 Payload JSON guardado: payload_ensayos_completo.json")
        print(f"   Tamaño: {os.path.getsize('payload_ensayos_completo.json') / 1024:.2f} KB")
        return True
    
    elif metodo == "api" and url:
        # Enviar por API
        import requests
        headers = {"Content-Type": "application/json"}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        
        print(f"\n🚀 Enviando a API: {url}")
        exitosos = 0
        try:
            for ensayo in payload["ensayos"]:
                response = requests.post(url, json=ensayo, headers=headers, timeout=30)
                if response.status_code in [200, 201]:
                    exitosos += 1
                    print(f"   ✅ {ensayo['titulo']}: Status {response.status_code}")
                else:
                    print(f"   ❌ {ensayo['titulo']}: Status {response.status_code}")
                    print(f"      Error: {response.text[:100]}")
            print(f"\n📊 Inyección completada: {exitosos}/{len(payload['ensayos'])} exitosos")
            return True
        except Exception as e:
            print(f"   ❌ Error de conexión: {e}")
            return False
    
    elif metodo == "individually":
        # Guardar cada ensayo como JSON individual
        os.makedirs("ensayos_json", exist_ok=True)
        for ensayo in payload["ensayos"]:
            nombre = f"ensayos_json/{ensayo['slug']}.json"
            with open(nombre, "w", encoding="utf-8") as f:
                json.dump(ensayo, f, ensure_ascii=False, indent=2)
            print(f"   💾 Guardado: {nombre}")
        print(f"\n📊 Total: {len(payload['ensayos'])} archivos JSON generados")
        return True
    
    else:
        print("⚠️  Método de inyección no reconocido")
        print("   Opciones disponibles: 'json', 'api', 'individually'")
        return False

# ============================================================
# EJECUCIÓN PRINCIPAL
# ============================================================

if __name__ == "__main__":
    print("=" * 80)
    print("📚 GENERADOR DE PAYLOAD PARA PAYLOAD CMS")
    print("   Ensayos de Anacleto González Flores - 1916")
    print("=" * 80)
    
    # 1. Extraer y convertir ensayos
    ensayos_convertidos = extraer_y_convertir_ensayos(RUTA_PDF, ensayos)
    
    if not ensayos_convertidos:
        print("\n❌ No se pudo procesar ningún ensayo. Verifica el PDF y los rangos.")
        exit(1)
    
    # 2. Generar payload completo
    payload_completo = generar_payload_completo(ensayos_convertidos)
    
    print("\n" + "=" * 80)
    print("📊 RESUMEN DE CONVERSIÓN")
    print("=" * 80)
    print(f"✅ Ensayos procesados: {len(ensayos_convertidos)}")
    print(f"✅ Todos convertidos al formato Lexical")
    print(f"✅ Slugs generados automáticamente")
    print(f"✅ Autor asignado: {AUTOR_DEFAULT}")
    print(f"✅ Categoría asignada: {CATEGORIA_DEFAULT}")
    
    # 3. Inyectar payload - ELIGE TU MÉTODO
    print("\n" + "=" * 80)
    print("🚀 MÉTODOS DE INYECCIÓN DISPONIBLES")
    print("=" * 80)
    print("  1. 'json'     - Guardar como JSON completo")
    print("  2. 'individually' - Guardar cada ensayo como JSON independiente")
    print("  3. 'api'      - Enviar directamente a una API")
    print("=" * 80)
    
    # Por defecto: Guardar como JSON
    inyectar_payload(payload_completo, metodo="json")
    
    # Ejemplo de cómo usar otros métodos (descomentar para usar):
    # inyectar_payload(payload_completo, metodo="individually")
    
    # inyectar_payload(
    #     payload_completo, 
    #     metodo="api", 
    #     url="https://tusitio.com/api/ensayos",
    #     token="tu_api_token_aqui"
    # )
    
    print("\n" + "=" * 80)
    print("✅ PROCESO COMPLETADO EXITOSAMENTE")
    print("=" * 80)
    print(f"📁 Archivos TXT (respaldo): {CARPETA_SALIDA}/")
    print(f"📦 Payload JSON: payload_ensayos_completo.json")
    print("\n💡 PRÓXIMOS PASOS:")
    print("   1. Revisa el archivo payload_ensayos_completo.json")
    print("   2. Verifica que el contenido sea correcto")
    print("   3. Usa el método de inyección que prefieras")
    print("   4. Si usas API, configura la URL y token en el script")