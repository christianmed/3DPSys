# Especificación: Gestión Avanzada de Perfiles de Filamentos y Optimización UX de Tarjetas

**Feature:** `feature/material-profiles-management-and-card-ux`  
**Fecha:** 2026-09-27  
**Estado:** Aprobado para implementación  

## 1. Contexto y Objetivos

### Problema actual identificado:
1. **Fricción innecesaria:** Los filamentos se muestran en tarjetas estáticas que saturan el espacio visual. Agregar un nuevo filamento exige abrir un modal superpuesto con clics adicionales.
2. **Imposibilidad de editar o eliminar:** Los perfiles cargados no pueden editarse (ej. si sube el precio o el flete) ni borrarse si se agotan o fueron agregados por error.
3. **Falta de clonación/copia:** Es muy común que un taller compre varias bobinas de la misma marca y precio variando únicamente el color o el flete de esa compra. Obligar al usuario a escribir todo desde cero es ineficiente.
4. **Inconsistencias de diseño:** Mezcla de radios de borde (*píldoras* vs *cuadrados*) que rompen la coherencia visual.

### Objetivos:
- Reemplazar la cuadrícula estática por un **selector desplegable (Select) fluido** con vista de perfil activo.
- Permitir **Edición, Eliminación y Duplicación ("Copiar perfil")** directa de cualquier filamento.
- Formulario integrado en línea (*inline expandable*), eliminando el modal intrusivo.
- Unificar la escala de radios de esquinas en todo el sistema (`rounded-xl` y `rounded-lg`).

---

## 2. Alcance (Scope)

### In-Scope:
- Componente `MaterialSelector.tsx` rediseñado:
  - Selector desplegable de bobinas guardadas.
  - Botones de acción: ➕ Nuevo, ✏️ Editar, 📋 Copiar perfil, 🗑️ Eliminar.
  - Desglose transparente en vivo del flete prorrateado.
  - Formulario integrado (*inline*) para alta/edición/copia sin modal.
- Métodos en `CalculatorForm.tsx` y `page.tsx` para `handleUpdateMaterial` y `handleDeleteMaterial`.
- Persistencia completa en `localStorage` mediante `storageService`.
- Pruebas unitarias de integración del cálculo y almacenamiento.

### Out-of-Scope:
- Resina SLA/DLP (reservada para la fase 2 ya acordada con el usuario).
- Sincronización remota con Supabase (preparado a nivel de arquitectura, despliegue posterior).

---

## 3. Criterios de Aceptación (BDD)

### Escenario 1: Selección rápida de filamento existente
- **Given** que el usuario tiene 3 bobinas registradas (PLA, PETG, ABS).
- **When** abre el desplegable de filamentos y selecciona "PETG Sunlu Blanco".
- **Then** el costo por gramo y el desglose de precio se actualizan en tiempo real sin recargar ni abrir modales.

### Escenario 2: Copiar/Duplicar un perfil para crear una variante
- **Given** que está seleccionado "PLA eSun Negro" ($22.50 bobina, $0.83 flete).
- **When** el usuario pulsa el botón "Copiar".
- **Then** se abre el formulario integrado con todos los campos precargados, sugiriendo el nombre "PLA eSun Copia", permitiéndole modificar únicamente el color (ej. "Rojo") y guardar.

### Escenario 3: Edición y eliminación de un perfil
- **Given** un filamento guardado con flete desactualizado.
- **When** el usuario pulsa "Editar", modifica el flete a $8.00 y guarda.
- **Then** el perfil se actualiza en el almacenamiento local y recalcula el costo por gramo en la cotización activa.
- **When** pulsa "Eliminar" y confirma.
- **Then** el perfil se retira del listado y se selecciona automáticamente el primer perfil disponible.
