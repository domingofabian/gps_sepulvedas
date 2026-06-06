# Compilar APK para Android

## Opción 1: Usar GitHub Actions (Recomendado - Automático)

1. **Sube el código a GitHub** (si no lo has hecho ya)
2. **El workflow se ejecutará automáticamente** cuando hagas push
3. **Descarga el APK** desde:
   - Actions → Build APK → Artifacts → app-debug.apk

### Pasos:
```bash
git add .
git commit -m "Build APK"
git push
```

Luego ve a: `https://github.com/tu-usuario/gps/actions`
- El build comenzará automáticamente
- Espera a que termine (5-10 minutos)
- Descarga el APK en la sección "Artifacts"

---

## Opción 2: Compilar Localmente (Si quieres compilar en tu PC)

**Requisito:** Instalar **Java 21 LTS**

### Pasos:

1. **Descarga Java 21:**
   - Ir a: https://adoptium.net/
   - Descargar: `Eclipse Adoptium JDK 21 LTS (Windows x64)`
   - Instalar en: `C:\Program Files\Eclipse Adoptium\jdk-21.0.x+x`

2. **Establecer JAVA_HOME en PowerShell:**
```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.x+x"
```

3. **Compilar APK:**
```powershell
cd "d:\imagenes docker\gps v.2\gps"
npm run build
npx capacitor copy android
cd android
.\gradlew.bat assembleDebug
```

4. **El APK se generará en:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

5. **Instalar en tu celular:**
```powershell
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Opción 3: Instalar APK Manualmente en Android

1. **Copia el APK a tu celular**
2. **En Android:**
   - Abre el Administrador de archivos
   - Navega a la carpeta con el APK
   - Toca el archivo .apk
   - Instala

**Nota:** Posiblemente necesites:
- Habilitar "Instalar de fuentes desconocidas" en Configuración > Seguridad

---

## Archivos generados

- **APK Debug:** `android/app/build/outputs/apk/debug/app-debug.apk` (~50-100 MB)
- **APK Release:** (después de firmar) para Google Play Store

---

¿Cuál opción prefieres?
