# ANTIOLVIDO

MVP de aplicación para registrar y consultar averías de producción.

## Funcionalidad actual

- Pantalla inicial: AVERÍA / HISTORIAL.
- Filtros: MODELO, ZONA, ESTACIÓN y TIPO DE AVERÍA.
- Resultados en tiempo real mientras se rellenan los filtros.
- Si la combinación completa no existe, aparece SOLUCIÓN.
- Guardado de nuevas averías en `localStorage`.
- Historial de todas las averías del navegador.
- Incluye datos de ejemplo para B10 / 2015 / 5145 / ROBOT.

## Ejecutar

```bash
npm install
npm run dev
```

Para producción:

```bash
npm run build
npm run preview
```

## Siguiente evolución recomendada

1. Sustituir `localStorage` por PostgreSQL para compartir las averías entre todos los puestos.
2. Añadir usuarios/operarios y fecha/hora.
3. Permitir varias averías con la misma combinación de filtros.
4. Añadir fotos, adjuntos y pasos de solución.
5. Añadir búsqueda libre y filtros avanzados en HISTORIAL.


## v2
- Portada con el logo STELLANTIS suministrado.
- Historial con filtros previos por MODELO y SECCIÓN.
- El historial no muestra todos los defectos hasta seleccionar al menos un filtro.
