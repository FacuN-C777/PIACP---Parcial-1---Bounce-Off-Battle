# Matriz de permisos

Completa esta matriz antes de habilitar acciones de un agente. Una accion no declarada debe considerarse prohibida hasta consultar.

| Accion                            | Estado                          | Alcance o justificacion                                                                            |
| --------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------- |
| Leer archivos del proyecto        | Permitida                       | Todo el repo: `src/`, `public/`, `vite/`, `docs/`, `GDD.md`, `README.md`, `Plan de Desarrollo.md`. |
| Buscar rutas y simbolos           | Permitida                       | Todo el repo.                                                                                      |
| Editar archivos previstos         | Permitida                       | `package.json`, `package-lock.json`, `GDD.md`, `docs/auditoria-repositorio.md`, `docs/especificacion.md`, `docs/plan.md`, `docs/matriz-permisos.md`, `docs/registro-intervencion.md`. Cualquier otro archivo requiere consulta previa. |
| Ejecutar scripts documentados     | Permitida                       | Solo `npm install` (fijar Phaser 4.2.1), `npm run build-nolog` y `npm run dev-nolog`. Se evitan `dev`/`build` porque ejecutan `log.js`. |
| Instalar dependencias             | Permitida (solo este caso)      | Exclusivamente para fijar la version de Phaser en 4.2.1. `npm audit fix` u otros cambios quedan fuera hasta consultar. |
| Usar red                          | Permitida (solo este caso)      | Exclusivamente el registro npm del `npm install` autorizado. NO ejecutar `log.js` ni acceder a otros sitios. |
| Publicar o subir cambios          | Prohibida                       | Para salvaguardar contra posibles errores, se decide que esto sea una acción puramente del usuario (git push y despliegue Vercel). |
| Acceder a secretos o credenciales | Prohibida                       | No corresponde al trabajo.                                                                         |

## Condiciones de detencion

- Antes de cualquier accion de red, instalacion o publicacion fuera de lo autorizado.
- Si aparece una decision de diseno del juego sin definir.
- Si hay archivos ajenos modificados o validaciones fallidas sin causa comprendida.
- Si el estudiante cambia el alcance o la version declarada.