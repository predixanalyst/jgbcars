import { createClient } from "@supabase/supabase-js";

// Estas dos claves son públicas por diseño (la "publishable key" de Supabase
// está pensada para usarse en el navegador, igual que la "publishable key"
// de Stripe). El acceso real se controla con las políticas RLS de las tablas.
const SUPABASE_URL = "https://sruapqzpqdmaajqrekkw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_waNvT5RnrpbiY1FuTa2huw_mxEep3xA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// La base de datos usa nombres de columna en minúsculas sin acentos
// (anio, fcompra, fventa, colorexterior, colorinterior). La app usa los
// nombres con acentos/mayúsculas de siempre. Estas funciones traducen
// entre un formato y otro para que el resto del código no cambie.

export function dbRowToVehicle(row) {
  return {
    id: row.id,
    marca: row.marca,
    modelo: row.modelo,
    matricula: row.matricula,
    vin: row.vin,
    año: row.anio,
    km: row.km,
    compra: row.compra,
    gastos: row.gastos,
    venta: row.venta,
    estado: row.estado,
    proveedor: row.proveedor,
    cliente: row.cliente,
    fCompra: row.fcompra,
    fVenta: row.fventa,
    cambio: row.cambio,
    tag: row.tag,
    foto: row.foto,
    fotos: row.fotos || (row.foto ? [row.foto] : []),
    combustible: row.combustible,
    potencia: row.potencia,
    traccion: row.traccion,
    colorExterior: row.colorexterior,
    colorInterior: row.colorinterior,
  };
}

export function vehicleToDbRow(v) {
  return {
    id: v.id,
    marca: v.marca,
    modelo: v.modelo,
    matricula: v.matricula,
    vin: v.vin,
    anio: v.año,
    km: v.km,
    compra: v.compra,
    gastos: v.gastos,
    venta: v.venta,
    estado: v.estado,
    proveedor: v.proveedor,
    cliente: v.cliente,
    fcompra: v.fCompra,
    fventa: v.fVenta || null,
    cambio: v.cambio,
    tag: v.tag,
    foto: (v.fotos && v.fotos[0]) || v.foto || null,
    fotos: v.fotos || [],
    combustible: v.combustible,
    potencia: v.potencia,
    traccion: v.traccion,
    colorexterior: v.colorExterior,
    colorinterior: v.colorInterior,
  };
}
