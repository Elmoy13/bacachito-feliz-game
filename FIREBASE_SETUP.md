# 🍾 Bacachito Feliz - Sistema de Partidas

## Cambios Implementados

### 1. ✅ Título del Navegador
- Cambiado de "Lovable" a **"Bacachito Feliz"**
- Actualizado en `index.html`

### 2. ✅ Logotipo
- Logo SVG agregado en la página de inicio (Landing)
- Diseño de botella feliz con animación
- Se puede personalizar con tu propia imagen guardándola en `public/logo.png`

### 3. ✅ Sistema de Guardado en Firebase
Cada vez que alguien inicia una partida, se guarda automáticamente:
- **Nombres de los jugadores**
- **Modo de juego seleccionado**
- **Fecha y hora de inicio**
- **ID único de la sesión**

### 4. ✅ Página de Partidas
Nueva ruta `/sessions` para ver el historial completo de partidas

## Cómo Ver las Partidas

### Opción 1: Desde la App
1. Ve a http://localhost:8080/
2. Haz clic en el botón **"Ver Partidas"**
3. Verás todas las sesiones con:
   - Modo de juego
   - Lista de jugadores
   - Fecha y hora
   - ID de la sesión

### Opción 2: Directamente en Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Abre tu proyecto: `qlosino-6f549`
3. En el menú lateral, haz clic en **"Firestore Database"**
4. Busca la colección **"gameSessions"**
5. Ahí verás todos los documentos con la información de cada partida:
   ```
   gameSessions/
   ├── [sessionId1]
   │   ├── players: ["Juan", "María", "Pedro"]
   │   ├── gameMode: "Clásico"
   │   └── startedAt: Timestamp
   ├── [sessionId2]
   │   ├── players: ["Ana", "Luis"]
   │   ├── gameMode: "Intenso"
   │   └── startedAt: Timestamp
   ```

## Estructura de Datos en Firebase

Cada sesión se guarda con este formato:

```typescript
{
  players: string[];        // ["Jugador1", "Jugador2", ...]
  gameMode: string;         // Nombre del modo de juego
  startedAt: Timestamp;     // Fecha/hora de inicio
}
```

## Próximas Mejoras Sugeridas

- 📊 Agregar estadísticas (jugador más activo, modo más popular)
- ⏱️ Guardar duración de las partidas
- 🏆 Sistema de puntuación
- 📱 Notificaciones cuando alguien inicia una partida
- 🔐 Autenticación de usuarios

## Tecnologías Usadas

- **Firebase Firestore** - Base de datos NoSQL
- **React 18** - UI
- **TypeScript** - Type safety
- **Framer Motion** - Animaciones
- **Sonner** - Notificaciones toast

---

¡Disfruta tu juego Bacachito Feliz! 🍾🎉
