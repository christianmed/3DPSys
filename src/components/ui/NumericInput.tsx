"use client";

import React, { useState, useEffect } from "react";

export interface NumericInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  isInteger?: boolean;
}

/**
 * NumericInput evita el clásico problema de React donde un valor 0 se queda pegado
 * al borrar o se concatena a la izquierda (ej. "05" al presionar "5").
 * - Muestra placeholder cuando el valor es 0.
 * - Al enfocar un campo con 0 o hacer foco, permite escribir directamente.
 * - Al borrar con Backspace, el campo queda limpio en blanco (mostrando el placeholder) y reporta 0.
 * - Permite escribir decimales fluidamente (ej. "0.", "0.04").
 */
export function NumericInput({
  value,
  onChange,
  placeholder = "0",
  className = "",
  isInteger = false,
  min,
  max,
  step,
  onFocus,
  onBlur,
  ...props
}: NumericInputProps) {
  // Estado local para permitir que el usuario teclee "." o borre sin que React lo fuerce a "0" inmediatamente
  const [localValue, setLocalValue] = useState<string>(() =>
    value === 0 ? "" : String(value)
  );
  const [isFocused, setIsFocused] = useState(false);

  // Sincronizar desde fuera si cambia externamente y el usuario no está editando activamente
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value === 0 ? "" : String(value));
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalValue(raw);

    if (raw === "" || raw === "-") {
      onChange(0);
      return;
    }

    const parsed = isInteger ? parseInt(raw, 10) : parseFloat(raw);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (value === 0) {
      setLocalValue("");
    } else {
      // Seleccionar el contenido para que el usuario pueda sobrescribir de inmediato
      e.target.select();
    }
    if (onFocus) onFocus(e);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (localValue === "" || isNaN(parseFloat(localValue))) {
      setLocalValue("");
      onChange(0);
    } else {
      const parsed = isInteger ? parseInt(localValue, 10) : parseFloat(localValue);
      // Limpiar ceros redundantes a la izquierda como "05" -> "5"
      setLocalValue(parsed === 0 ? "" : String(parsed));
      onChange(parsed);
    }
    if (onBlur) onBlur(e);
  };

  return (
    <input
      type="number"
      value={localValue}
      onChange={handleChange}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
      placeholder={placeholder}
      className={className}
      min={min}
      max={max}
      step={step}
      {...props}
    />
  );
}
