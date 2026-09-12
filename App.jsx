import React, { useState, useMemo } from "react";
import { supabase, dbRowToVehicle, vehicleToDbRow } from "./supabaseClient.js";
import {
  Car, Users, FileText, CheckSquare, Folder, Wrench, Calendar as CalendarIcon,
  MessageSquare, User, Settings, LogOut, LayoutDashboard, Search, Filter,
  Plus, X, Menu, Bell, ChevronRight, Phone, Mail, MapPin, Clock, TrendingUp,
  TrendingDown, ShieldCheck, Zap, Eye, EyeOff, Download, Trash2, Pencil,
  ArrowRight, BadgeCheck, Building2, ChevronDown, Calculator as CalcIcon,
  StickyNote, Send, ArrowLeftRight, Percent, Landmark, CircleDollarSign,
  SlidersHorizontal, Gauge, Cog, Printer,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

/* ============================================================
   TOKENS
   ============================================================ */
const C = {
  bg: "#0B0C0F",
  surface: "#15171B",
  surface2: "#1C1F24",
  border: "#2A2D33",
  ink: "#F4F5F7",
  muted: "#9298A2",
  mutedDim: "#5C616B",
  accent: "#C7A24C",
  accentDim: "#8A733A",
  success: "#4C9A6A",
  danger: "#C1554A",
  warn: "#D98E3F",
};

const LOGO_SRC = "data:image/png;base64,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";

const fmtEUR = (n) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const fmtEUR2 = (n) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);
const fmtDate = (d) => new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });

/* ============================================================
   FONTS / GLOBAL STYLE
   ============================================================ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
    .jgb-root { font-family: 'Manrope', sans-serif; background:${C.bg}; color:${C.ink}; }
    .jgb-root h1, .jgb-root h2, .jgb-root h3, .jgb-root .jgb-display { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.02em; font-weight: 700; }
    .jgb-scroll::-webkit-scrollbar { width: 6px; height:6px; }
    .jgb-scroll::-webkit-scrollbar-thumb { background:${C.border}; border-radius:4px; }
    .jgb-fade { animation: jgbFade .5s ease both; }
    @keyframes jgbFade { from { opacity:0; transform: translateY(6px);} to {opacity:1; transform:translateY(0);} }
    .jgb-btn { transition: all .18s ease; }
    .jgb-btn:hover { transform: translateY(-1px); }
    .jgb-row:hover { background:${C.surface2}; }
    input, select, textarea { font-family:'Manrope',sans-serif; }
    input::placeholder, textarea::placeholder { color:${C.mutedDim}; }
    @media (prefers-reduced-motion: reduce) { .jgb-fade, .jgb-btn { animation:none!important; transition:none!important; } }
    .jgb-stock-grid { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:24px; }
    @media (max-width: 640px) { .jgb-stock-grid { grid-template-columns: 1fr; } }
    @media print {
      body * { visibility: hidden; }
      .jgb-print-sheet, .jgb-print-sheet * { visibility: visible; }
      .jgb-print-sheet { position:absolute; top:0; left:0; width:100%; padding:32px; background:#fff; color:#111; }
      .jgb-print-toolbar { display:none !important; }
      .jgb-printable-page, .jgb-printable-page * { visibility: visible; }
      .jgb-printable-page {
        position: absolute; top:0; left:0; width:100%; padding:24px;
        background:#fff !important; color:#111 !important;
      }
      .jgb-printable-page * {
        background:#fff !important; background-color:#fff !important; color:#111 !important;
        border-color:#ccc !important; box-shadow:none !important; text-shadow:none !important;
      }
      .no-print, .jgb-printable-page button, .jgb-printable-page input, .jgb-printable-page select { display:none !important; }
      .jgb-printable-page .jgb-scroll { overflow: visible !important; max-height: none !important; }
    }
  `}</style>
);

/* ============================================================
   DEMO DATA
   ============================================================ */
const WORKERS = [
  { id: "u1", username: "admin", password: "admin123", name: "Marta Solà", role: "Administrador", cargo: "Dirección General", email: "marta@jgbcars.com", phone: "+34 611 222 333" },
  { id: "u2", username: "gerente", password: "gerente123", name: "Pol Ferrer", role: "Gerente", cargo: "Gerente de Operaciones", email: "pol@jgbcars.com", phone: "+34 622 333 444" },
  { id: "u3", username: "trabajador", password: "trabajador123", name: "Laia Nogué", role: "Trabajador", cargo: "Gestión y Atención al Cliente", email: "laia@jgbcars.com", phone: "+34 633 444 555" },
];

const VEHICLES = [
  { id: "V-001", marca: "BMW", modelo: "Serie 3 320d", matricula: "—", vin: "WBA8E9C50JK123456", año: 2021, km: 42000, compra: 21500, venta: 25900, estado: "Disponible", proveedor: "Mobile.de - Múnich", cliente: "—", fCompra: "2026-07-02" , cambio: "Automático", tag: "IVA deducible", foto: null, combustible: "Diésel", potencia: 190, traccion: "Trasera", colorExterior: "Negro Zafiro", colorInterior: "Negro", gastos: 3870},
  { id: "V-002", marca: "Audi", modelo: "A4 Avant 2.0 TDI", matricula: "—", vin: "WAUZZZ8V5MA112233", año: 2020, km: 61000, compra: 18900, venta: 22500, estado: "En preparación", proveedor: "Mobile.de - Stuttgart", cliente: "—", fCompra: "2026-07-15" , cambio: "Automático", tag: null, foto: null, combustible: "Diésel", potencia: 190, traccion: "Delantera", colorExterior: "Gris Nardo", colorInterior: "Negro", gastos: 3400},
  { id: "V-003", marca: "Volkswagen", modelo: "Golf 8 GTI", matricula: "—", vin: "WVWZZZCDZLW445566", año: 2022, km: 18000, compra: 27800, venta: 32900, estado: "Reservado", proveedor: "Mobile.de - Colonia", cliente: "Marc Vidal", fCompra: "2026-06-20" , cambio: "Manual", tag: "Nacional", foto: null, combustible: "Gasolina", potencia: 245, traccion: "Delantera", colorExterior: "Blanco Pure", colorInterior: "Negro/Rojo", gastos: 5000},
  { id: "V-004", marca: "Mercedes-Benz", modelo: "C220d AMG Line", matricula: "9832 KLM", vin: "WDD2050421F778899", año: 2020, km: 55000, compra: 24200, venta: 28500, estado: "Vendido", proveedor: "Mobile.de - Hamburgo", cliente: "Núria Camps", fCompra: "2026-05-10", fVenta: "2026-06-02" , cambio: "Automático", tag: null, foto: null, combustible: "Diésel", potencia: 194, traccion: "Trasera", colorExterior: "Gris Selenita", colorInterior: "Negro", gastos: 4360},
  { id: "V-005", marca: "Škoda", modelo: "Octavia Combi", matricula: "—", vin: "TMBJJ7NE0N0112233", año: 2021, km: 39000, compra: 15800, venta: 18900, estado: "Disponible", proveedor: "Mobile.de - Berlín", cliente: "—", fCompra: "2026-08-01" , cambio: "Automático", tag: "IVA deducible", foto: null, combustible: "Diésel", potencia: 150, traccion: "Delantera", colorExterior: "Azul Race", colorInterior: "Beige", gastos: 2840},
  { id: "V-006", marca: "SEAT", modelo: "León ST FR", matricula: "—", vin: "VSSZZZKHZLR667788", año: 2021, km: 33000, compra: 16200, venta: 19500, estado: "Pendiente de documentación", proveedor: "Mobile.de - Fráncfort", cliente: "—", fCompra: "2026-08-05" , cambio: "Manual", tag: null, foto: null, combustible: "Gasolina", potencia: 150, traccion: "Delantera", colorExterior: "Rojo Deseo", colorInterior: "Negro", gastos: 2920},
  { id: "V-007", marca: "BMW", modelo: "X1 sDrive18d", matricula: "1245 BXT", vin: "WBAHY910X0K990011", año: 2019, km: 68000, compra: 19900, venta: 23900, estado: "Vendido", proveedor: "Mobile.de - Düsseldorf", cliente: "Jordi Puig", fCompra: "2026-04-12", fVenta: "2026-05-20" , cambio: "Automático", tag: "Nacional", foto: null, combustible: "Diésel", potencia: 150, traccion: "Delantera", colorExterior: "Blanco Alpine", colorInterior: "Negro", gastos: 3580},
  { id: "V-008", marca: "Audi", modelo: "Q3 35 TDI", matricula: "—", vin: "WAUZZZF3XL1002233", año: 2022, km: 21000, compra: 26900, venta: 31200, estado: "En reparación", proveedor: "Mobile.de - Múnich", cliente: "—", fCompra: "2026-08-12" , cambio: "Automático", tag: "IVA deducible", foto: null, combustible: "Diésel", potencia: 150, traccion: "Delantera", colorExterior: "Gris Daytona", colorInterior: "Negro", gastos: 4840},
  { id: "V-009", marca: "Mercedes-Benz", modelo: "CLA 200d", matricula: "—", vin: "WDD1176421N556677", año: 2020, km: 47000, compra: 20300, venta: 24200, estado: "Disponible", proveedor: "Mobile.de - Hannover", cliente: "—", fCompra: "2026-08-18" , cambio: "Automático", tag: null, foto: null, combustible: "Diésel", potencia: 150, traccion: "Delantera", colorExterior: "Blanco Polar", colorInterior: "Negro", gastos: 3650},
  { id: "V-010", marca: "Volkswagen", modelo: "Tiguan 2.0 TDI 4Motion", matricula: "3390 GTP", vin: "WVGZZZ5NZLW778899", año: 2021, km: 52000, compra: 23100, venta: 27400, estado: "Vendido", proveedor: "Mobile.de - Bremen", cliente: "Anna Ribas", fCompra: "2026-03-22", fVenta: "2026-04-30" , cambio: "Automático", tag: "Nacional", foto: null, combustible: "Diésel", potencia: 190, traccion: "4x4 (4Motion)", colorExterior: "Gris Indium", colorInterior: "Negro", gastos: 4160},
];

const CLIENTS = [
  { id: "C-01", nombre: "Marc", apellidos: "Vidal Roca", empresa: "—", nif: "45123456A", telefono: "+34 611 987 654", email: "marc.vidal@gmail.com", direccion: "Sabadell, Barcelona", vehiculos: ["V-003"], notas: "Interesado en financiación a 60 meses." },
  { id: "C-02", nombre: "Núria", apellidos: "Camps Solé", empresa: "—", nif: "43876543B", telefono: "+34 622 876 543", email: "nuria.camps@gmail.com", direccion: "Terrassa, Barcelona", vehiculos: ["V-004"], notas: "Cliente recurrente, segunda compra." },
  { id: "C-03", nombre: "Jordi", apellidos: "Puig Martí", empresa: "Puig Transports SL", nif: "B67234512", telefono: "+34 633 765 432", email: "jordi@puigtransports.com", direccion: "Mollet del Vallès, Barcelona", vehiculos: ["V-007"], notas: "Compra para flota de empresa." },
  { id: "C-04", nombre: "Anna", apellidos: "Ribas Font", empresa: "—", nif: "39654321C", telefono: "+34 644 654 321", email: "anna.ribas@gmail.com", direccion: "Rubí, Barcelona", vehiculos: ["V-010"], notas: "Pagó al contado." },
  { id: "C-05", nombre: "David", apellidos: "Serra Vall", empresa: "Serra Reformas", nif: "B29887766", telefono: "+34 655 543 210", email: "david@serrareformas.com", direccion: "Sant Cugat, Barcelona", vehiculos: [], notas: "Pendiente de tasación de su vehículo actual." },
  { id: "C-06", nombre: "Laura", apellidos: "Montes Pi", empresa: "—", nif: "38221199D", telefono: "+34 666 112 233", email: "laura.montes@gmail.com", direccion: "Barcelona", vehiculos: [], notas: "Solicitó info sobre Škoda Octavia." },
];

const INVOICES = [
  { id: "F-2026-001", fecha: "2026-05-04", cliente: "Núria Camps Solé", nif: "43876543B", concepto: "Venta Mercedes C220d AMG Line", base: 23553, iva: 4947, total: 28500, estado: "Pagada", metodo: "Transferencia" },
  { id: "F-2026-002", fecha: "2026-05-21", cliente: "Jordi Puig Martí", nif: "B67234512", concepto: "Venta BMW X1 sDrive18d", base: 19752, iva: 4148, total: 23900, estado: "Pagada", metodo: "Transferencia" },
  { id: "F-2026-003", fecha: "2026-05-30", cliente: "Puig Transports SL", nif: "B67234512", concepto: "Gestión administrativa y matriculación", base: 350, iva: 73.5, total: 423.5, estado: "Pagada", metodo: "Efectivo" },
  { id: "F-2026-004", fecha: "2026-06-05", cliente: "Anna Ribas Font", nif: "39654321C", concepto: "Venta VW Tiguan 2.0 TDI", base: 22645, iva: 4755, total: 27400, estado: "Pagada", metodo: "Financiación" },
  { id: "F-2026-005", fecha: "2026-06-12", cliente: "Taller Motor Vallès SL", nif: "B58991122", concepto: "Reparación y preparación vehículos", base: 890, iva: 186.9, total: 1076.9, estado: "Pagada", metodo: "Transferencia" },
  { id: "F-2026-006", fecha: "2026-06-30", cliente: "Marc Vidal Roca", nif: "45123456A", concepto: "Reserva VW Golf 8 GTI", base: 826.4, iva: 173.6, total: 1000, estado: "Pagada", metodo: "Tarjeta" },
  { id: "F-2026-007", fecha: "2026-07-10", cliente: "Transportes Rius SL", nif: "B44556677", concepto: "Tasación flota (4 vehículos)", base: 480, iva: 100.8, total: 580.8, estado: "Pendiente", metodo: "Transferencia" },
  { id: "F-2026-008", fecha: "2026-07-18", cliente: "Gestoría Camps & Associats", nif: "B22334455", concepto: "Comisión intermediación", base: 620, iva: 130.2, total: 750.2, estado: "Pendiente", metodo: "Transferencia" },
  { id: "F-2026-009", fecha: "2026-07-25", cliente: "Núria Camps Solé", nif: "43876543B", concepto: "Gestión documental importación", base: 210, iva: 44.1, total: 254.1, estado: "Pagada", metodo: "Efectivo" },
  { id: "F-2026-010", fecha: "2026-08-02", cliente: "David Serra Vall", nif: "38112244E", concepto: "Tasación vehículo usado", base: 90, iva: 18.9, total: 108.9, estado: "Pagada", metodo: "Efectivo" },
  { id: "F-2026-011", fecha: "2026-08-08", cliente: "Laura Montes Pi", nif: "38221199D", concepto: "Reserva Škoda Octavia Combi", base: 413.2, iva: 86.8, total: 500, estado: "Pendiente", metodo: "Tarjeta" },
  { id: "F-2026-012", fecha: "2026-08-14", cliente: "Assegurances Vallès SL", nif: "B99887766", concepto: "Comisión seguros vehículo", base: 165, iva: 34.7, total: 199.7, estado: "Pendiente", metodo: "Transferencia" },
  { id: "F-2026-013", fecha: "2026-08-20", cliente: "Transportes Rius SL", nif: "B44556677", concepto: "Gestión de flota - revisión trimestral", base: 540, iva: 113.4, total: 653.4, estado: "Pendiente", metodo: "Transferencia" },
  { id: "F-2026-014", fecha: "2026-08-27", cliente: "Puig Transports SL", nif: "B67234512", concepto: "Venta Audi Q3 35 TDI (segunda unidad)", base: 25785, iva: 5415, total: 31200, estado: "Pendiente", metodo: "Financiación" },
  { id: "F-2026-015", fecha: "2026-09-03", cliente: "Marc Vidal Roca", nif: "45123456A", concepto: "Venta VW Golf 8 GTI - liquidación final", base: 26429, iva: 5550, total: 31479, estado: "Pendiente", metodo: "Financiación" },
];

const MONTHLY = [
  { mes: "Mar", ingresos: 31200, gastos: 19400 },
  { mes: "Abr", ingresos: 42800, gastos: 24100 },
  { mes: "May", ingresos: 53900, gastos: 31200 },
  { mes: "Jun", ingresos: 49700, gastos: 27600 },
  { mes: "Jul", ingresos: 38300, gastos: 22900 },
  { mes: "Ago", ingresos: 62100, gastos: 35800 },
];

const VEHICLE_SALES = [
  { mes: "Mar", ventas: 2 }, { mes: "Abr", ventas: 3 }, { mes: "May", ventas: 4 },
  { mes: "Jun", ventas: 3 }, { mes: "Jul", ventas: 2 }, { mes: "Ago", ventas: 5 },
];

const TASKS_SEED = [
  { id: "T-01", titulo: "Recoger BMW X1 en aduana", desc: "Coordinar recogida con transportista en Port de Barcelona.", responsable: "Laia Nogué", prioridad: "Alta", limite: "2026-09-15", estado: "En proceso" },
  { id: "T-02", titulo: "Preparar documentación Audi Q3", desc: "Ficha técnica, ITV y cambio de titularidad.", responsable: "Pol Ferrer", prioridad: "Urgente", limite: "2026-09-13", estado: "Pendiente" },
  { id: "T-03", titulo: "Llamar a Laura Montes", desc: "Confirmar interés en Škoda Octavia y agendar prueba.", responsable: "Laia Nogué", prioridad: "Media", limite: "2026-09-14", estado: "Pendiente" },
  { id: "T-04", titulo: "Cerrar financiación Golf GTI", desc: "Enviar documentación a la financiera de Marc Vidal.", responsable: "Marta Solà", prioridad: "Alta", limite: "2026-09-16", estado: "En proceso" },
  { id: "T-05", titulo: "Publicar contenido semanal TikTok", desc: "Comparativa precios Mobile.de vs. mercado español.", responsable: "Laia Nogué", prioridad: "Baja", limite: "2026-09-18", estado: "Pendiente" },
  { id: "T-06", titulo: "Revisar factura pendiente Transportes Rius", desc: "Seguimiento de pago F-2026-013.", responsable: "Pol Ferrer", prioridad: "Media", limite: "2026-09-20", estado: "Completada" },
  { id: "T-07", titulo: "Taller: preparación Mercedes CLA", desc: "Cambio de aceite, filtros y detailing antes de publicar.", responsable: "Pol Ferrer", prioridad: "Media", limite: "2026-09-17", estado: "Completada" },
];

const EVENTS_SEED = [
  { id: "E-01", titulo: "Entrega VW Tiguan a Anna Ribas", tipo: "Entrega", fecha: "2026-09-12", hora: "10:00" },
  { id: "E-02", titulo: "Revisión ITV Škoda Octavia", tipo: "Revisión", fecha: "2026-09-13", hora: "09:30" },
  { id: "E-03", titulo: "Reunión semanal de equipo", tipo: "Reunión", fecha: "2026-09-14", hora: "09:00" },
  { id: "E-04", titulo: "Prueba de conducción - Laura Montes", tipo: "Cita", fecha: "2026-09-15", hora: "17:00" },
  { id: "E-05", titulo: "Recogida BMW X1 en aduana", tipo: "Recordatorio", fecha: "2026-09-15", hora: "12:00" },
  { id: "E-06", titulo: "Firma contrato - Puig Transports", tipo: "Cita", fecha: "2026-09-18", hora: "11:30" },
];

const MESSAGES_SEED = [
  { id: "M-01", de: "Marta Solà", texto: "Recordad: cierre mensual de contabilidad el viernes.", fecha: "2026-09-10 09:12", tipo: "Aviso general" },
  { id: "M-02", de: "Pol Ferrer", texto: "Golf GTI ya está en preparación, fotos listas para mañana.", fecha: "2026-09-10 12:40", tipo: "Equipo" },
  { id: "M-03", de: "Laia Nogué", texto: "Laura Montes ha pedido más fotos del Octavia, se las envío hoy.", fecha: "2026-09-11 08:05", tipo: "Equipo" },
];

const DOCS_SEED = [
  { id: "D-01", nombre: "Ficha técnica BMW Serie 3.pdf", categoria: "Vehículos", fecha: "2026-07-03" },
  { id: "D-02", nombre: "Contrato compraventa Núria Camps.pdf", categoria: "Clientes", fecha: "2026-05-04" },
  { id: "D-03", nombre: "Balance mensual agosto.xlsx", categoria: "Contabilidad", fecha: "2026-09-01" },
  { id: "D-04", nombre: "Factura proveedor Mobile.de #4471.pdf", categoria: "Proveedores", fecha: "2026-08-12" },
  { id: "D-05", nombre: "Modelo 303 IVA trimestral.pdf", categoria: "Administración", fecha: "2026-07-20" },
  { id: "D-06", nombre: "Manual de marca JGB Cars.pdf", categoria: "Empresa", fecha: "2026-02-15" },
  { id: "D-07", nombre: "ITV Škoda Octavia.pdf", categoria: "Vehículos", fecha: "2026-08-01" },
  { id: "D-08", nombre: "Ficha cliente Jordi Puig.pdf", categoria: "Clientes", fecha: "2026-05-20" },
];

const SERVICES = [
  { icon: Car, title: "Compra y venta de vehículos", desc: "Seleccionamos e importamos vehículos verificados de Alemania para el mercado español, con revisión y garantía." },
  { icon: FileText, title: "Gestión de vehículos", desc: "Nos encargamos de toda la documentación: transferencias, ITV, matriculación e impuestos." },
  { icon: Landmark, title: "Financiación", desc: "Buscamos las mejores condiciones de financiación adaptadas a cada cliente." },
  { icon: BadgeCheck, title: "Tasación", desc: "Valoramos tu vehículo actual de forma objetiva y transparente antes de la compra." },
  { icon: ArrowLeftRight, title: "Importación y exportación", desc: "Gestión integral del proceso de importación desde Alemania hasta la entrega en España." },
  { icon: Building2, title: "Gestión administrativa", desc: "Trámites con Hacienda, Tráfico y aseguradoras, sin que tengas que preocuparte de nada." },
  { icon: ShieldCheck, title: "Asesoramiento", desc: "Te acompañamos en cada decisión con criterio técnico y sin presión comercial." },
  { icon: Zap, title: "Servicios para profesionales", desc: "Gestión de flotas y condiciones especiales para empresas y autónomos." },
];

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
const Badge = ({ children, tone = "neutral" }) => {
  const tones = {
    neutral: { bg: "rgba(146,152,162,.12)", fg: C.muted, bd: C.border },
    success: { bg: "rgba(76,154,106,.14)", fg: C.success, bd: "rgba(76,154,106,.3)" },
    warn: { bg: "rgba(217,142,63,.14)", fg: C.warn, bd: "rgba(217,142,63,.3)" },
    danger: { bg: "rgba(193,85,74,.14)", fg: C.danger, bd: "rgba(193,85,74,.3)" },
    accent: { bg: "rgba(199,162,76,.14)", fg: C.accent, bd: "rgba(199,162,76,.3)" },
  };
  const t = tones[tone];
  return (
    <span style={{ background: t.bg, color: t.fg, border: `1px solid ${t.bd}` }}
      className="px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap">
      {children}
    </span>
  );
};

const estadoTone = (estado) => ({
  Disponible: "success", Reservado: "warn", Vendido: "neutral",
  "En preparación": "accent", "En reparación": "danger", "Pendiente de documentación": "warn",
  Pagada: "success", Pendiente: "warn",
  Pendiente_: "warn", "En proceso": "accent", Completada: "success",
}[estado] || "neutral");

const Field = ({ label, children }) => (
  <label className="block mb-3">
    <span className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>{label}</span>
    {children}
  </label>
);

const inputStyle = {
  width: "100%", background: C.surface2, border: `1px solid ${C.border}`, color: C.ink,
  borderRadius: 8, padding: "9px 11px", fontSize: 14, outline: "none",
};

const Modal = ({ open, onClose, title, children, wide }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.6)" }} onClick={onClose}>
      <div className="jgb-fade jgb-scroll" onClick={(e) => e.stopPropagation()}
        style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, width: wide ? 640 : 460, maxWidth: "94vw", maxHeight: "88vh", overflowY: "auto" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
          <h3 className="text-base font-bold">{title}</h3>
          <button onClick={onClose} style={{ color: C.muted }}><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

const PrimaryBtn = ({ children, onClick, type = "button", full }) => (
  <button type={type} onClick={onClick}
    className={`jgb-btn font-semibold text-sm rounded-lg px-4 py-2.5 ${full ? "w-full" : ""}`}
    style={{ background: C.accent, color: "#161207" }}>
    {children}
  </button>
);
const GhostBtn = ({ children, onClick, full }) => (
  <button onClick={onClick} className={`jgb-btn font-semibold text-sm rounded-lg px-4 py-2.5 ${full ? "w-full" : ""}`}
    style={{ background: "transparent", color: C.ink, border: `1px solid ${C.border}` }}>
    {children}
  </button>
);

const KpiCard = ({ label, value, delta, deltaGood = true, accentColor = C.accent }) => (
  <div className="jgb-fade rounded-xl p-4" style={{ background: C.surface, border: `1px solid ${C.border}`, borderLeft: `3px solid ${accentColor}` }}>
    <div className="text-xs font-semibold mb-2" style={{ color: C.muted }}>{label}</div>
    <div className="jgb-display text-2xl font-bold">{value}</div>
    {delta && (
      <div className="flex items-center gap-1 mt-2 text-xs font-semibold" style={{ color: deltaGood ? C.success : C.danger }}>
        {deltaGood ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {delta}
      </div>
    )}
  </div>
);

/* ============================================================
   PUBLIC SITE
   ============================================================ */
function CarBlueprint({ opacity = 1 }) {
  return (
    <svg viewBox="0 0 600 220" style={{ opacity, width: "100%", height: "auto" }}>
      <line x1="20" y1="176" x2="580" y2="176" stroke={C.mutedDim} strokeWidth="1" strokeDasharray="3 4" />

      <circle cx="155" cy="176" r="28" fill={C.surface2} stroke={C.accent} strokeWidth="3" />
      <circle cx="155" cy="176" r="11" fill="none" stroke={C.accent} strokeWidth="2" />
      <circle cx="455" cy="176" r="28" fill={C.surface2} stroke={C.accent} strokeWidth="3" />
      <circle cx="455" cy="176" r="11" fill="none" stroke={C.accent} strokeWidth="2" />

      <path d="M50 176 C42 176 38 168 44 158 C56 136 92 112 132 103 L178 94 C202 80 232 72 266 72 L332 72 C366 72 396 81 418 94 L452 112 C488 122 518 136 540 154 C550 162 555 168 552 176 Z"
        fill={C.accent} />
      <path d="M188 94 L266 79 C288 77 312 77 334 79 L410 94 L392 103 L206 103 Z" fill={C.bg} opacity="0.62" />
      <line x1="50" y1="153" x2="552" y2="153" stroke={C.bg} strokeOpacity="0.18" strokeWidth="1.6" />
    </svg>
  );
}

function PublicHeader({ onGoLogin, section, setSection }) {
  const [open, setOpen] = useState(false);
  const links = [["home", "Inicio"], ["about", "Quiénes somos"], ["stock", "Stock"], ["services", "Servicios"], ["why", "Por qué nosotros"], ["contact", "Contacto"]];
  return (
    <header className="sticky top-0 z-40" style={{ background: "rgba(11,12,15,.88)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.border}` }}>
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <button onClick={() => setSection("home")} className="flex items-center gap-2.5">
          <img src={LOGO_SRC} alt="JGBCARS" style={{ height: 32, width: "auto" }} />
          <span className="jgb-display font-bold text-lg tracking-tight">JGBCARS</span>
        </button>
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold" style={{ color: C.muted }}>
          {links.map(([k, l]) => (
            <button key={k} onClick={() => setSection(k)} style={{ color: section === k ? C.ink : C.muted }} className="jgb-btn hover:opacity-80">{l}</button>
          ))}
        </nav>
        <div className="hidden md:block">
          <GhostBtn onClick={onGoLogin}>Área de trabajadores</GhostBtn>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)}><Menu size={22} /></button>
      </div>
      {open && (
        <div className="md:hidden px-5 pb-4 flex flex-col gap-3" style={{ borderTop: `1px solid ${C.border}` }}>
          {links.map(([k, l]) => (
            <button key={k} className="text-left text-sm font-semibold py-1" onClick={() => { setSection(k); setOpen(false); }}>{l}</button>
          ))}
          <GhostBtn onClick={onGoLogin}>Área de trabajadores</GhostBtn>
        </div>
      )}
    </header>
  );
}

function CarThumb({ tone = C.accent }) {
  return (
    <svg viewBox="0 0 600 220" style={{ width: "100%", height: "auto", display: "block" }}>
      <rect width="600" height="220" fill={C.surface2} />
      <line x1="20" y1="176" x2="580" y2="176" stroke={C.mutedDim} strokeWidth="1" strokeDasharray="3 4" />
      <circle cx="155" cy="176" r="28" fill={C.surface} stroke={tone} strokeWidth="3" />
      <circle cx="155" cy="176" r="11" fill="none" stroke={tone} strokeWidth="2" />
      <circle cx="455" cy="176" r="28" fill={C.surface} stroke={tone} strokeWidth="3" />
      <circle cx="455" cy="176" r="11" fill="none" stroke={tone} strokeWidth="2" />
      <path d="M50 176 C42 176 38 168 44 158 C56 136 92 112 132 103 L178 94 C202 80 232 72 266 72 L332 72 C366 72 396 81 418 94 L452 112 C488 122 518 136 540 154 C550 162 555 168 552 176 Z" fill={tone} />
      <path d="M188 94 L266 79 C288 77 312 77 334 79 L410 94 L392 103 L206 103 Z" fill={C.surface2} opacity="0.85" />
    </svg>
  );
}

const MARCA_SLUG = {
  "BMW": "bmw", "Audi": "audi", "Volkswagen": "volkswagen",
  "Mercedes-Benz": "mercedes-benz", "Škoda": "skoda-car", "SEAT": "seat-car",
};

function VehiclePhoto({ v, tone, index = 0 }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <CarThumb tone={tone} />;
  const slug = MARCA_SLUG[v.marca] || v.marca.toLowerCase();
  const lock = (v.id.match(/\d+/) || ["1"])[0];
  const fotos = v.fotos && v.fotos.length > 0 ? v.fotos : (v.foto ? [{ url: v.foto, position: "50% 50%" }] : []);
  const item = fotos[index] || fotos[0];
  const src = item ? item.url : `https://loremflickr.com/640/480/${slug}/all?lock=${lock}`;
  const position = (item && item.position) || "50% 50%";
  return (
    <img
      src={src}
      alt={`${v.marca} ${v.modelo}`}
      onError={() => setFailed(true)}
      loading="lazy"
      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: position, display: "block" }}
    />
  );
}

const EQUIPMENT = [
  { cat: "Sonido", items: ["Apple CarPlay / Android Auto", "Sistema de sonido premium"] },
  { cat: "Exterior", items: ["Llantas de aleación", "Faros LED", "Sensores de aparcamiento"] },
  { cat: "Interior", items: ["Tapicería de piel/alcántara", "Volante multifunción", "Pantalla táctil"] },
  { cat: "Confort", items: ["Climatizador", "Asientos delanteros calefactables"] },
  { cat: "Tecnología", items: ["Ordenador de a bordo", "Navegador GPS integrado"] },
  { cat: "Seguridad", items: ["Cámara trasera", "Aviso de cambio involuntario de carril"] },
];
const DEFAULT_EQUIPMENT = EQUIPMENT.flatMap((c) => c.items);
const POSITION_GRID = ["0% 0%", "50% 0%", "100% 0%", "0% 50%", "50% 50%", "100% 50%", "0% 100%", "50% 100%", "100% 100%"];

function VehicleDetail({ v, allVehicles, onBack, onGoContact }) {
  const sold = v.estado === "Vendido";
  const fotos = v.fotos && v.fotos.length > 0 ? v.fotos : (v.foto ? [{ url: v.foto, position: "50% 50%" }] : []);
  const [activeFoto, setActiveFoto] = useState(0);
  const relacionados = allVehicles.filter((x) => x.id !== v.id && x.marca === v.marca).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      <button onClick={onBack} className="text-xs font-semibold mb-6" style={{ color: C.muted }}>← Volver al stock</button>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div>
          <div className="relative rounded-xl overflow-hidden mb-3" style={{ aspectRatio: "4 / 3" }}>
            {fotos.length > 0 ? (
              <img src={fotos[activeFoto].url} alt={`${v.marca} ${v.modelo}`} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: fotos[activeFoto].position || "50% 50%", display: "block" }} />
            ) : (
              <VehiclePhoto v={v} tone={sold ? C.mutedDim : C.accent} />
            )}
            {sold && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(11,12,15,.55)" }}>
                <span className="jgb-display font-bold text-lg tracking-widest" style={{ color: C.ink, border: `2px solid ${C.ink}`, padding: "4px 18px", transform: "rotate(-8deg)" }}>VENDIDO</span>
              </div>
            )}
          </div>
          {fotos.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {fotos.map((f, i) => (
                <button key={f.url} onClick={() => setActiveFoto(i)} className="rounded-lg overflow-hidden" style={{ aspectRatio: "4 / 3", border: i === activeFoto ? `2px solid ${C.accent}` : `1px solid ${C.border}` }}>
                  <img src={f.url} alt={`${v.marca} ${v.modelo} ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: f.position || "50% 50%", display: "block" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge tone={estadoTone(v.estado)}>{v.estado}</Badge>
            {v.tag && <Badge tone="neutral">{v.tag}</Badge>}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{v.marca} {v.modelo}</h1>
          <div className="flex items-center gap-3 text-sm mb-5" style={{ color: C.mutedDim }}>
            <span className="flex items-center gap-1"><CalendarIcon size={13} />{v.año}</span>
            <span className="flex items-center gap-1"><Gauge size={13} />{v.km.toLocaleString("es-ES")} km</span>
            <span className="flex items-center gap-1"><Zap size={13} />{v.potencia} CV</span>
          </div>
          <div className="jgb-display font-bold text-3xl mb-6" style={{ color: sold ? C.mutedDim : C.accent }}>
            {sold ? "Consultar precio" : fmtEUR(v.venta)}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm mb-7 p-4 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            {[
              ["Marca", v.marca], ["Modelo", v.modelo], ["Año", v.año], ["Kilometraje", `${v.km.toLocaleString("es-ES")} km`],
              ["Transmisión", v.cambio], ["Combustible", v.combustible], ["Tracción", v.traccion], ["Potencia", `${v.potencia} CV`],
              ["Color exterior", v.colorExterior], ["Color interior", v.colorInterior],
            ].map(([l, val]) => (
              <div key={l}><div className="text-xs" style={{ color: C.mutedDim }}>{l}</div><div className="font-semibold">{val}</div></div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <PrimaryBtn full onClick={onGoContact}>Solicitar información</PrimaryBtn>
            <a href={`https://wa.me/34900123456?text=Hola%2C%20me%20interesa%20el%20${encodeURIComponent(v.marca + " " + v.modelo)}%20que%20tenéis%20en%20stock.`}
              target="_blank" rel="noopener noreferrer" className="jgb-btn font-semibold text-sm rounded-lg px-4 py-2.5 text-center"
              style={{ border: `1px solid ${C.border}`, color: C.ink }}>WhatsApp</a>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-bold mb-5">Equipamiento</h2>
        <div className="rounded-xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1.5">
            {(v.equipamiento && v.equipamiento.length > 0 ? v.equipamiento : DEFAULT_EQUIPMENT).map((it) => (
              <div key={it} className="text-sm py-1" style={{ color: C.muted }}>✔ {it}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs mb-10 p-4 rounded-xl" style={{ color: C.mutedDim, border: `1px solid ${C.border}` }}>
        Este anuncio no es vinculante, puede contener errores y se muestra a título informativo, no contractual.
      </div>

      {relacionados.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-5">También te puede interesar</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relacionados.map((r) => (
              <div key={r.id} className="rounded-xl overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="relative" style={{ aspectRatio: "4 / 3" }}><VehiclePhoto v={r} tone={C.accent} /></div>
                <div className="p-3">
                  <div className="text-sm font-semibold mb-1">{r.marca} {r.modelo}</div>
                  <div className="jgb-display font-bold" style={{ color: C.accent }}>{r.estado === "Vendido" ? "Vendido" : fmtEUR(r.venta)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stock({ onGoContact, vehicles }) {
  const publicVehicles = useMemo(() => vehicles.filter((v) => ["Disponible", "Reservado", "Vendido"].includes(v.estado)), [vehicles]);
  const marcas = ["Todas", ...Array.from(new Set(publicVehicles.map((v) => v.marca)))];
  const [marca, setMarca] = useState("Todas");
  const [estado, setEstado] = useState("Todos");
  const [sort, setSort] = useState("recientes");
  const [detail, setDetail] = useState(null);

  let list = publicVehicles
    .filter((v) => marca === "Todas" || v.marca === marca)
    .filter((v) => estado === "Todos" || v.estado === estado);
  if (sort === "precio_asc") list = [...list].sort((a, b) => a.venta - b.venta);
  if (sort === "precio_desc") list = [...list].sort((a, b) => b.venta - a.venta);
  if (sort === "km") list = [...list].sort((a, b) => a.km - b.km);

  const vendidos = publicVehicles.filter((v) => v.estado === "Vendido");

  if (detail) {
    return (
      <div>
        <VehicleDetail v={detail} allVehicles={publicVehicles} onBack={() => setDetail(null)} onGoContact={onGoContact} />
      </div>
    );
  }

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="pt-14 pb-10 px-5 text-center" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.accent }}>Encuentra el coche de tus sueños</div>
        <h1 className="text-3xl md:text-4xl font-bold">Stock de vehículos</h1>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-10">
        {/* FILTER BAR */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8 p-3 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="flex gap-2 flex-wrap items-center">
            <SlidersHorizontal size={15} style={{ color: C.mutedDim }} className="ml-1" />
            <select style={{ ...inputStyle, width: 150 }} value={marca} onChange={(e) => setMarca(e.target.value)}>
              {marcas.map((m) => <option key={m}>{m}</option>)}
            </select>
            <select style={{ ...inputStyle, width: 150 }} value={estado} onChange={(e) => setEstado(e.target.value)}>
              {["Todos", "Disponible", "Reservado", "Vendido"].map((m) => <option key={m}>{m}</option>)}
            </select>
            <select style={{ ...inputStyle, width: 190 }} value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="recientes">Más recientes</option>
              <option value="precio_asc">Precio: menor a mayor</option>
              <option value="precio_desc">Precio: mayor a menor</option>
              <option value="km">Kilometraje</option>
            </select>
          </div>
          <div className="text-xs font-semibold px-2" style={{ color: C.mutedDim }}>{list.length} vehículos</div>
        </div>

        <div className="jgb-stock-grid">
          {list.map((v) => {
            const sold = v.estado === "Vendido";
            return (
              <button key={v.id} onClick={() => setDetail(v)} className="jgb-btn text-left rounded-xl overflow-hidden group"
                style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="relative overflow-hidden" style={{ aspectRatio: "4 / 3" }}>
                  <VehiclePhoto v={v} tone={sold ? C.mutedDim : C.accent} />
                  <div className="absolute top-3 left-3"><Badge tone={estadoTone(v.estado)}>{v.estado}</Badge></div>
                  {v.tag && <div className="absolute top-3 right-3"><Badge tone="neutral">{v.tag}</Badge></div>}
                  {sold && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(11,12,15,.55)" }}>
                      <span className="jgb-display font-bold text-lg tracking-widest" style={{ color: C.ink, border: `2px solid ${C.ink}`, padding: "4px 18px", transform: "rotate(-8deg)" }}>VENDIDO</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs mb-2.5" style={{ color: C.mutedDim }}>
                    <span className="flex items-center gap-1"><CalendarIcon size={12} />{v.año}</span>
                    <span className="flex items-center gap-1"><Cog size={12} />{v.cambio}</span>
                    <span className="flex items-center gap-1"><Gauge size={12} />{v.km.toLocaleString("es-ES")} km</span>
                  </div>
                  <div className="font-bold text-sm mb-1.5">{v.marca} {v.modelo}</div>
                  <div className="jgb-display font-bold text-xl" style={{ color: sold ? C.mutedDim : C.accent }}>
                    {sold ? "Consultar" : fmtEUR(v.venta)}
                  </div>
                  {v.tag === "IVA deducible" && !sold && <div className="text-[11px] mt-0.5" style={{ color: C.mutedDim }}>IVA deducible</div>}
                </div>
              </button>
            );
          })}
        </div>
        {list.length === 0 && <div className="text-sm py-10 text-center" style={{ color: C.mutedDim }}>No hay vehículos que coincidan con estos filtros.</div>}

        {vendidos.length > 0 && (
          <div className="mt-16">
            <div className="font-bold text-sm mb-4" style={{ color: C.muted }}>Últimas ventas</div>
            <div className="flex gap-3 overflow-x-auto jgb-scroll pb-2">
              {vendidos.map((v) => (
                <div key={v.id} className="rounded-lg px-4 py-3 flex-shrink-0" style={{ background: C.surface, border: `1px solid ${C.border}`, minWidth: 210 }}>
                  <div className="text-xs mb-1" style={{ color: C.mutedDim }}>{v.año} · {v.km.toLocaleString("es-ES")} km</div>
                  <div className="text-sm font-semibold mb-1.5">{v.marca} {v.modelo}</div>
                  <Badge tone="neutral">Vendido</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 rounded-2xl p-8 md:p-10 grid md:grid-cols-2 gap-8 items-center" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: C.accent }}>Coche a la carta</div>
            <h3 className="text-2xl font-bold mb-3">¿No encuentras el coche que buscas?</h3>
            <p className="text-sm" style={{ color: C.muted }}>Trabajamos con una red de proveedores en Alemania y localizamos la unidad exacta que necesitas: marca, versión, motor y configuración concreta.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
            <a href="https://wa.me/34900123456?text=Hola%2C%20estoy%20buscando%20un%20coche%20concreto%20y%20me%20gustar%C3%ADa%20que%20me%20ayud%C3%A9is%20a%20encontrarlo."
              target="_blank" rel="noopener noreferrer" className="jgb-btn font-semibold text-sm rounded-lg px-4 py-2.5 text-center"
              style={{ background: C.accent, color: "#161207" }}>Hablar por WhatsApp</a>
            <GhostBtn onClick={onGoContact}>Ir al formulario</GhostBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageHeader({ eyebrow, title }) {
  return (
    <div className="pt-14 pb-10 px-5 text-center" style={{ borderBottom: `1px solid ${C.border}` }}>
      <div className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.accent }}>{eyebrow}</div>
      <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
    </div>
  );
}

function HomePage({ onGoLogin, goto }) {
  return (
    <section className="max-w-6xl mx-auto px-5 pt-16 pb-20 grid md:grid-cols-2 gap-10 items-center">
      <div className="jgb-fade">
        <div className="text-xs font-semibold tracking-wide mb-4" style={{ color: C.accent }}>Importación y venta de vehículos de Alemania</div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
          Vehículos importados con criterio, papeleo resuelto de principio a fin.
        </h1>
        <p className="text-base mb-8" style={{ color: C.muted, maxWidth: 480 }}>
          En JGB Cars seleccionamos, importamos y gestionamos vehículos verificados desde Alemania para clientes particulares y empresas en toda España — con transparencia en cada paso.
        </p>
        <div className="flex flex-wrap gap-3">
          <PrimaryBtn onClick={() => goto("about")}>Conócenos</PrimaryBtn>
          <GhostBtn onClick={onGoLogin}>Área de trabajadores</GhostBtn>
        </div>
        <div className="flex gap-8 mt-10">
          {[["+10", "vehículos gestionados en el último año"], ["16%", "margen medio de importación"], ["5 años", "de experiencia"]].map(([n, l]) => (
            <div key={l}>
              <div className="jgb-display text-2xl font-bold">{n}</div>
              <div className="text-xs" style={{ color: C.mutedDim }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl p-8" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <img src={LOGO_SRC} alt="JGBCARS" style={{ height: 64, width: "auto", marginBottom: 28 }} />
        <div className="text-sm mb-8 leading-relaxed" style={{ color: C.muted }}>
          Compramos, importamos y gestionamos cada vehículo con el mismo criterio: sin sorpresas, sin coste oculto y con el papeleo resuelto antes de la entrega.
        </div>
        <div className="space-y-5">
          {[
            [ShieldCheck, "Revisión previa", "Cada unidad se inspecciona antes de comprarla en origen."],
            [FileText, "Papeleo incluido", "Transferencia, ITV y matriculación gestionadas por nosotros."],
            [BadgeCheck, "Precio cerrado", "Lo que se presupuesta es lo que se paga, sin extras de última hora."],
          ].map(([Icon, t, d]) => (
            <div key={t} className="flex items-start gap-3">
              <Icon size={18} style={{ color: C.accent, marginTop: 2, flexShrink: 0 }} />
              <div>
                <div className="font-bold text-sm">{t}</div>
                <div className="text-xs" style={{ color: C.mutedDim }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutPage({ goto }) {
  return (
    <div>
      <PageHeader eyebrow="Quiénes somos" title="Una forma distinta de comprar un coche importado" />
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-xl font-bold mb-4">Nuestra historia</h2>
            <p style={{ color: C.muted }} className="mb-4 leading-relaxed">
              JGB Cars nació de la idea de acercar el mercado alemán de vehículos de ocasión a compradores españoles, sin la incertidumbre habitual de una importación por cuenta propia. Lo que muchos intentan resolver por su cuenta —comparando anuncios en Mobile.de, calculando aranceles y persiguiendo papeleo— es exactamente lo que nosotros ya hacemos cada semana.
            </p>
            <p style={{ color: C.muted }} className="leading-relaxed">
              Con el tiempo, ese proceso se ha convertido en un método: sabemos qué preguntar antes de comprar un vehículo, qué costes suelen pasarse por alto y cómo evitar sorpresas cuando el coche ya está en camino.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Nuestra filosofía</h2>
            <p style={{ color: C.muted }} className="mb-4 leading-relaxed">
              Revisamos cada vehículo antes de comprarlo, calculamos con precisión todos los costes asociados al proceso y acompañamos al cliente hasta la matriculación final. No trabajamos con precios de salida que luego suben con "gastos de gestión" — el presupuesto que damos es el que se paga.
            </p>
            <p style={{ color: C.muted }} className="leading-relaxed">
              Preferimos decir que no a una operación antes que ocultar un problema del vehículo o del proceso. Es una forma más lenta de crecer, pero es la única que nos parece sostenible a largo plazo.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6">Cómo trabajamos</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            ["Buscamos", "Rastreamos el mercado alemán según lo que necesita cada cliente: marca, versión, kilometraje, presupuesto."],
            ["Revisamos", "Cada candidato se examina a fondo antes de comprarlo: historial, estado mecánico y documentación."],
            ["Importamos", "Gestionamos transporte, aduana, ITV y todos los trámites hasta la matriculación en España."],
            ["Entregamos", "El cliente recibe el vehículo listo para circular, con el papeleo cerrado desde el primer día."],
          ].map(([t, d], i) => (
            <div key={t} className="rounded-xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div className="jgb-display font-bold text-2xl mb-2" style={{ color: C.accent }}>{i + 1}</div>
              <div className="font-bold text-sm mb-1.5">{t}</div>
              <div className="text-xs leading-relaxed" style={{ color: C.muted }}>{d}</div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-6">Valores</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {[
            ["Historia", "Empresa consolidada, en constante evolución desde su fundación, con el mismo criterio de siempre: hacer bien las cosas antes que hacerlas rápido."],
            ["Experiencia", "Cientos de importaciones gestionadas desde el mercado alemán, lo que nos permite anticipar problemas antes de que aparezcan."],
            ["Filosofía", "Ningún coste oculto: lo que se presupuesta es lo que se paga, sin letra pequeña ni sorpresas de última hora."],
            ["Valores", "Profesionalidad, rigor documental y atención cercana — un mismo interlocutor te acompaña de principio a fin."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div className="font-bold text-sm mb-1.5" style={{ color: C.accent }}>{t}</div>
              <div className="text-xs leading-relaxed" style={{ color: C.muted }}>{d}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-8 md:p-10 text-center" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <h3 className="text-xl font-bold mb-3">¿Quieres ver qué tenemos disponible ahora mismo?</h3>
          <PrimaryBtn onClick={() => goto("stock")}>Ver stock de vehículos</PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

function ServicesPage({ goto }) {
  const detalles = {
    "Compra y venta de vehículos": "Seleccionamos e importamos vehículos verificados de Alemania para el mercado español, con revisión mecánica y documental antes de comprar, y garantía sobre lo acordado.",
    "Gestión de vehículos": "Nos encargamos de toda la documentación asociada a la vida del vehículo: transferencias, cambios de titularidad, ITV y trámites ante Tráfico.",
    "Financiación": "Buscamos las condiciones de financiación que mejor encajan con cada cliente, comparando entidades para no quedarnos con la primera oferta.",
    "Tasación": "Valoramos tu vehículo actual de forma objetiva y documentada, útil tanto si quieres venderlo como si lo entregas como parte de pago.",
    "Importación y exportación": "Gestión integral del proceso de importación desde Alemania: transporte, aduana, homologación y matriculación en España, sin que tengas que ir puerta por puerta.",
    "Gestión administrativa": "Trámites con Hacienda, Tráfico y aseguradoras resueltos por nosotros, para que el papeleo nunca sea el motivo de un retraso.",
    "Asesoramiento": "Te acompañamos en cada decisión con criterio técnico y sin presión comercial — preferimos un cliente bien informado que una venta rápida.",
    "Servicios para profesionales": "Gestión de flotas y condiciones específicas para empresas y autónomos que necesitan varios vehículos o renovaciones periódicas.",
  };
  return (
    <div>
      <PageHeader eyebrow="Servicios" title="Todo lo necesario para tener tu coche importado, resuelto" />
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid sm:grid-cols-2 gap-5 mb-16">
          {SERVICES.map(({ icon: Icon, title }) => (
            <div key={title} className="rounded-xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <Icon size={20} style={{ color: C.accent }} className="mb-3" />
              <div className="font-bold text-sm mb-1.5">{title}</div>
              <div className="text-sm leading-relaxed" style={{ color: C.muted }}>{detalles[title]}</div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-6">Cómo funciona el proceso</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {[
            ["Consulta inicial", "Nos cuentas qué buscas: marca, versión, presupuesto y plazos."],
            ["Búsqueda y selección", "Rastreamos el mercado alemán y te presentamos opciones reales, con fotos y precio final."],
            ["Compra e importación", "Gestionamos la compra, el transporte y todos los trámites de importación."],
            ["Entrega en España", "Recibes el vehículo matriculado y listo para circular, con toda la documentación en regla."],
          ].map(([t, d], i) => (
            <div key={t} className="rounded-xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div className="jgb-display font-bold text-2xl mb-2" style={{ color: C.accent }}>{i + 1}</div>
              <div className="font-bold text-sm mb-1.5">{t}</div>
              <div className="text-xs leading-relaxed" style={{ color: C.muted }}>{d}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-8 md:p-10 text-center" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <h3 className="text-xl font-bold mb-3">¿Hablamos de tu caso concreto?</h3>
          <PrimaryBtn onClick={() => goto("contact")}>Ir a contacto</PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

function WhyPage({ goto }) {
  return (
    <div>
      <PageHeader eyebrow="Por qué JGB Cars" title="Lo que nos diferencia de una importación por tu cuenta" />
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid sm:grid-cols-2 gap-6 mb-14">
          {[
            [ShieldCheck, "Transparencia", "Precio y costes claros desde el primer momento: el presupuesto que recibes incluye todo lo necesario para matricular el vehículo, sin cargos que aparecen a mitad de proceso."],
            [BadgeCheck, "Profesionalidad", "Cada vehículo pasa por una revisión rigurosa antes de comprarlo — no solo fotos y un anuncio, sino comprobación real de estado, historial y documentación."],
            [Clock, "Rapidez", "Procesos de importación optimizados con proveedores y gestorías con los que ya trabajamos habitualmente, para no depender de aprender sobre la marcha."],
            [Users, "Atención personalizada", "Un único interlocutor te acompaña durante todo el proceso, así que nunca tienes que repetir tu caso desde cero."],
          ].map(([Icon, t, d]) => (
            <div key={t} className="rounded-xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <Icon size={22} style={{ color: C.accent }} className="mb-3" />
              <div className="font-bold text-base mb-2">{t}</div>
              <div className="text-sm leading-relaxed" style={{ color: C.muted }}>{d}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-10 justify-center mb-14 py-8 rounded-2xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          {[["+10", "vehículos gestionados en el último año"], ["16%", "margen medio de importación"], ["5 años", "de experiencia"]].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="jgb-display text-3xl font-bold" style={{ color: C.accent }}>{n}</div>
              <div className="text-xs mt-1" style={{ color: C.mutedDim }}>{l}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-8 md:p-10 text-center" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <h3 className="text-xl font-bold mb-3">Compruébalo con un vehículo concreto</h3>
          <PrimaryBtn onClick={() => goto("stock")}>Ver stock de vehículos</PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

function ContactPage({ form, setForm, errors, sent, submit }) {
  const FAQ = [
    ["¿Puedo pedir un modelo concreto que no esté en el stock?", "Sí — es habitual. Nos cuentas marca, versión, presupuesto y plazos, y buscamos la unidad en el mercado alemán."],
    ["¿Qué pasa si el vehículo tiene algún problema al llegar?", "Cada vehículo se revisa antes de comprarlo. Si algo no coincide con lo acordado, se resuelve antes de facturar la operación."],
    ["¿Cuánto tarda el proceso de importación?", "Depende del vehículo y la disponibilidad de transporte, pero el plazo se acuerda contigo desde el primer momento."],
    ["¿Puedo financiar la compra?", "Sí, buscamos condiciones de financiación adaptadas a cada caso antes de cerrar la operación."],
  ];
  return (
    <div>
      <PageHeader eyebrow="Contacto" title="Hablemos de tu próximo vehículo" />
      <div className="max-w-6xl mx-auto px-5 py-16 grid md:grid-cols-2 gap-12">
        <div>
          <div className="space-y-4 text-sm mb-8">
            {[[Phone, "+34 900 123 456"], [Mail, "info@jgbcars.com"], [MapPin, "Atención online — gestionamos la entrega allá donde estés"], [Clock, "Lun–Vie 9:00–19:00 · Sáb 10:00–14:00"]].map(([Icon, t]) => (
              <div key={t} className="flex items-center gap-3" style={{ color: C.muted }}>
                <Icon size={16} style={{ color: C.accent }} /> {t}
              </div>
            ))}
          </div>
          <div className="mb-10 rounded-xl p-5 text-sm leading-relaxed" style={{ border: `1px solid ${C.border}`, color: C.muted }}>
            Todavía no contamos con una sede física abierta al público: gestionamos cada operación de forma remota y coordinamos la entrega del vehículo en el punto que mejor te convenga. En cuanto abramos una ubicación permanente, la verás aquí.
          </div>
          <h2 className="text-lg font-bold mb-4">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {FAQ.map(([q, a]) => (
              <div key={q}>
                <div className="font-semibold text-sm mb-1">{q}</div>
                <div className="text-xs leading-relaxed" style={{ color: C.muted }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={submit} className="rounded-xl p-6 h-fit" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          {sent && <div className="mb-4 text-sm font-semibold p-3 rounded-lg" style={{ background: "rgba(76,154,106,.14)", color: C.success }}>Mensaje enviado. Te responderemos en menos de 24h.</div>}
          <Field label="Nombre">
            <input style={inputStyle} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            {errors.nombre && <div className="text-xs mt-1" style={{ color: C.danger }}>{errors.nombre}</div>}
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email">
              <input style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <div className="text-xs mt-1" style={{ color: C.danger }}>{errors.email}</div>}
            </Field>
            <Field label="Teléfono">
              <input style={inputStyle} value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
              {errors.telefono && <div className="text-xs mt-1" style={{ color: C.danger }}>{errors.telefono}</div>}
            </Field>
          </div>
          <Field label="Motivo de contacto">
            <select style={inputStyle} value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })}>
              {["Compra de vehículo", "Venta de mi vehículo", "Financiación", "Tasación", "Otro"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Mensaje">
            <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} />
            {errors.mensaje && <div className="text-xs mt-1" style={{ color: C.danger }}>{errors.mensaje}</div>}
          </Field>
          <PrimaryBtn type="submit" full>Enviar mensaje</PrimaryBtn>
        </form>
      </div>
    </div>
  );
}

function PublicSite({ onGoLogin, vehicles }) {
  const [section, setSection] = useState("home");
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", motivo: "Compra de vehículo", mensaje: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const goto = (k) => setSection(k);

  React.useEffect(() => {
    const id = setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
    return () => clearTimeout(id);
  }, [section]);

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.nombre.trim()) err.nombre = "Indica tu nombre.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Email no válido.";
    if (!/^[+\d\s]{7,}$/.test(form.telefono)) err.telefono = "Teléfono no válido.";
    if (!form.mensaje.trim()) err.mensaje = "Escribe un mensaje.";
    setErrors(err);
    if (Object.keys(err).length === 0) {
      setSent(true);
      setForm({ nombre: "", email: "", telefono: "", motivo: "Compra de vehículo", mensaje: "" });
    }
  };

  const pages = {
    home: <HomePage onGoLogin={onGoLogin} goto={goto} />,
    stock: <Stock onGoContact={() => goto("contact")} vehicles={vehicles} />,
    about: <AboutPage goto={goto} />,
    services: <ServicesPage goto={goto} />,
    why: <WhyPage goto={goto} />,
    contact: <ContactPage form={form} setForm={setForm} errors={errors} sent={sent} submit={submit} />,
  };

  return (
    <div className="jgb-root min-h-screen">
      <PublicHeader onGoLogin={onGoLogin} section={section} setSection={goto} />

      {pages[section]}

      <footer className="max-w-6xl mx-auto px-5 py-10 flex flex-col md:flex-row justify-between gap-4 text-xs" style={{ color: C.mutedDim }}>
        <div>© 2026 JGB Cars. Todos los derechos reservados.</div>
        <div className="flex gap-5">
          <span>Instagram</span><span>TikTok</span><span>LinkedIn</span>
        </div>
      </footer>
    </div>
  );
}

/* ============================================================
   LOGIN
   ============================================================ */
function LoginScreen({ onBack, onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(false);
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const u = user.trim().toLowerCase();
    const p = pass.trim();
    const found = WORKERS.find((w) => w.username.toLowerCase() === u && w.password === p);
    if (found) { setErr(""); onLogin(found); }
    else setErr("Usuario o contraseña incorrectos.");
  };

  return (
    <div className="jgb-root min-h-screen flex items-center justify-center px-5">
      <div className="jgb-fade w-full" style={{ maxWidth: 400 }}>
        <button onClick={onBack} className="text-xs font-semibold mb-8" style={{ color: C.muted }}>← Volver a la web</button>
        <div className="flex items-center gap-3 mb-1">
          <img src={LOGO_SRC} alt="JGBCARS" style={{ height: 40, width: "auto" }} />
          <span className="jgb-display font-bold text-2xl tracking-tight">JGBCARS</span>
        </div>
        <div className="text-sm mb-8 mt-2" style={{ color: C.muted }}>Área de trabajadores</div>
        <form onSubmit={submit} className="rounded-xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <Field label="Usuario">
            <input
              style={inputStyle}
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoFocus
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              autoComplete="username"
            />
          </Field>
          <Field label="Contraseña">
            <input
              style={inputStyle}
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              autoComplete="current-password"
            />
          </Field>
          {err && <div className="text-xs font-semibold mb-3" style={{ color: C.danger }}>{err}</div>}
          <div className="flex items-center justify-between mb-5 text-xs">
            <label className="flex items-center gap-2" style={{ color: C.muted }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Recordarme
            </label>
            <button type="button" style={{ color: C.accent }} className="font-semibold">¿Has olvidado tu contraseña?</button>
          </div>
          <PrimaryBtn type="submit" full onClick={submit}>Iniciar sesión</PrimaryBtn>
        </form>
        <div className="mt-5 text-xs rounded-lg p-3" style={{ color: C.mutedDim, background: C.surface, border: `1px solid ${C.border}` }}>
          Demo — admin/admin123 · gerente/gerente123 · trabajador/trabajador123
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PRIVATE AREA — SHELL
   ============================================================ */
const MENU = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "contabilidad", label: "JGB Contabilidad", icon: CircleDollarSign, restrict: ["Administrador", "Gerente"] },
  { key: "vehiculos", label: "Vehículos", icon: Car },
  { key: "clientes", label: "Clientes", icon: Users },
  { key: "tareas", label: "Tareas", icon: CheckSquare },
  { key: "documentos", label: "Documentos", icon: Folder },
  { key: "herramientas", label: "Herramientas", icon: Wrench },
  { key: "calendario", label: "Calendario", icon: CalendarIcon },
  { key: "comunicaciones", label: "Comunicaciones", icon: MessageSquare },
  { key: "perfil", label: "Perfil", icon: User },
  { key: "configuracion", label: "Configuración", icon: Settings, restrict: ["Administrador"] },
];

function Sidebar({ page, setPage, role, mobileOpen, setMobileOpen }) {
  const items = MENU.filter((m) => !m.restrict || m.restrict.includes(role));
  const body = (
    <div className="h-full flex flex-col" style={{ background: C.surface, borderRight: `1px solid ${C.border}` }}>
      <div className="px-5 py-5 flex items-center gap-2.5" style={{ borderBottom: `1px solid ${C.border}` }}>
        <img src={LOGO_SRC} alt="JGBCARS" style={{ height: 26, width: "auto" }} />
        <div>
          <div className="jgb-display font-bold text-sm leading-tight">JGBCARS</div>
          <div className="text-[10px] leading-tight" style={{ color: C.mutedDim }}>Área de trabajadores</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto jgb-scroll py-3 px-2">
        {items.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => { setPage(key); setMobileOpen(false); }}
            className="jgb-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold mb-1"
            style={{ background: page === key ? C.surface2 : "transparent", color: page === key ? C.ink : C.muted, borderLeft: page === key ? `2px solid ${C.accent}` : "2px solid transparent" }}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </nav>
    </div>
  );
  return (
    <>
      <div className="hidden md:block no-print" style={{ width: 240, flexShrink: 0 }}>{body}</div>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden no-print" style={{ background: "rgba(0,0,0,.6)" }} onClick={() => setMobileOpen(false)}>
          <div style={{ width: 240, height: "100%" }} onClick={(e) => e.stopPropagation()}>{body}</div>
        </div>
      )}
    </>
  );
}

function Topbar({ worker, setMobileOpen, onLogout, setPage }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [printHint, setPrintHint] = useState(false);
  const printPage = () => {
    setPrintHint(true);
    setTimeout(() => setPrintHint(false), 4000);
    try { window.print(); } catch (e) { /* algunos entornos bloquean la llamada automática */ }
  };
  return (
    <div className="flex items-center justify-between px-5 h-16 no-print" style={{ borderBottom: `1px solid ${C.border}`, background: C.bg, position: "relative" }}>
      <div className="flex items-center gap-3">
        <button className="md:hidden" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
        <div className="text-sm font-bold hidden sm:block">JGB Cars — Área de trabajadores</div>
      </div>
      {printHint && (
        <div className="jgb-fade" style={{ position: "absolute", top: "100%", right: 20, marginTop: 8, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.ink, zIndex: 50, maxWidth: 260 }}>
          Si no se ha abierto el diálogo de impresión, pulsa <b>Ctrl+P</b> (Windows) o <b>Cmd+P</b> (Mac) para imprimir esta página.
        </div>
      )}
      <div className="flex items-center gap-4">
        <button onClick={printPage} title="Imprimir esta página (Ctrl+P / Cmd+P)" className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: C.muted }}>
          <Printer size={16} /> <span className="hidden sm:inline">Imprimir</span>
        </button>
        <div className="relative">
          <button onClick={() => setNotifOpen(!notifOpen)} className="relative" style={{ color: C.muted }}>
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 rounded-full" style={{ width: 7, height: 7, background: C.accent }} />
          </button>
          {notifOpen && (
            <div className="jgb-fade absolute right-0 mt-2 rounded-xl p-3 text-xs jgb-scroll" style={{ width: 260, background: C.surface, border: `1px solid ${C.border}`, zIndex: 30 }}>
              <div className="font-bold mb-2">Notificaciones</div>
              {["2 facturas pendientes de cobro", "Tarea urgente: documentación Audi Q3", "Nuevo mensaje de Laia Nogué"].map((n) => (
                <div key={n} className="py-1.5" style={{ borderTop: `1px solid ${C.border}`, color: C.muted }}>{n}</div>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setPage("perfil")} className="flex items-center gap-2">
          <div className="rounded-full flex items-center justify-center font-bold text-xs" style={{ width: 30, height: 30, background: C.accent, color: "#161207" }}>
            {worker.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold leading-tight">{worker.name}</div>
            <div className="text-[11px] leading-tight" style={{ color: C.mutedDim }}>{worker.role}</div>
          </div>
        </button>
        <button onClick={onLogout} title="Cerrar sesión" style={{ color: C.muted }}><LogOut size={18} /></button>
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD HOME
   ============================================================ */
function DashboardHome({ worker }) {
  const pendientes = INVOICES.filter((f) => f.estado === "Pendiente");
  const pagadas = INVOICES.filter((f) => f.estado === "Pagada");
  const totalIngresos = MONTHLY.reduce((s, m) => s + m.ingresos, 0);
  const totalGastos = MONTHLY.reduce((s, m) => s + m.gastos, 0);
  return (
    <div className="jgb-fade">
      <h2 className="text-2xl font-bold mb-1">Hola, {worker.name.split(" ")[0]}</h2>
      <p className="text-sm mb-6" style={{ color: C.muted }}>Esto es lo más relevante hoy en JGB Cars.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Ingresos (6 meses)" value={fmtEUR(totalIngresos)} delta="+12% vs. periodo anterior" />
        <KpiCard label="Gastos (6 meses)" value={fmtEUR(totalGastos)} delta="+6% vs. periodo anterior" deltaGood={false} accentColor={C.danger} />
        <KpiCard label="Beneficio (6 meses)" value={fmtEUR(totalIngresos - totalGastos)} delta="Margen 43%" accentColor={C.success} />
        <KpiCard label="Facturas pendientes" value={pendientes.length} delta={`${fmtEUR(pendientes.reduce((s, f) => s + f.total, 0))} por cobrar`} deltaGood={false} accentColor={C.warn} />
      </div>
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 rounded-xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="font-bold text-sm mb-4">Ingresos vs. gastos por mes</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY}>
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" stroke={C.mutedDim} fontSize={12} />
              <YAxis stroke={C.mutedDim} fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip contentStyle={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} formatter={(v) => fmtEUR(v)} />
              <Line type="monotone" dataKey="ingresos" stroke={C.accent} strokeWidth={2.5} dot={false} name="Ingresos" />
              <Line type="monotone" dataKey="gastos" stroke={C.danger} strokeWidth={2.5} dot={false} name="Gastos" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="font-bold text-sm mb-4">Vehículos vendidos / mes</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={VEHICLE_SALES}>
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" stroke={C.mutedDim} fontSize={12} />
              <YAxis stroke={C.mutedDim} fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="ventas" fill={C.accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="font-bold text-sm mb-3">Tareas urgentes</div>
          {TASKS_SEED.filter((t) => (t.prioridad === "Urgente" || t.prioridad === "Alta") && t.estado !== "Completada").map((t) => (
            <div key={t.id} className="flex items-center justify-between py-2" style={{ borderTop: `1px solid ${C.border}` }}>
              <div className="text-sm">{t.titulo}</div>
              <Badge tone={t.prioridad === "Urgente" ? "danger" : "warn"}>{t.prioridad}</Badge>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="font-bold text-sm mb-3">Próximos eventos</div>
          {EVENTS_SEED.slice(0, 4).map((e) => (
            <div key={e.id} className="flex items-center justify-between py-2" style={{ borderTop: `1px solid ${C.border}` }}>
              <div className="text-sm">{e.titulo}</div>
              <div className="text-xs" style={{ color: C.mutedDim }}>{fmtDate(e.fecha)} · {e.hora}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CONTABILIDAD
   ============================================================ */
function Contabilidad({ vehicles }) {
  const [invoices, setInvoices] = useState([]);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [q, setQ] = useState("");
  const [estadoF, setEstadoF] = useState("Todos");
  const [modal, setModal] = useState(null);
  const [printing, setPrinting] = useState(null);
  const blankInvoiceForm = { cliente: "", concepto: "", base: "", ivaPct: "21", metodo: "Transferencia" };
  const [invForm, setInvForm] = useState(blankInvoiceForm);
  const [savingInv, setSavingInv] = useState(false);

  React.useEffect(() => {
    let active = true;
    supabase.from("invoices").select("*").order("fecha", { ascending: false }).then(({ data, error }) => {
      if (!active) return;
      if (!error && data) setInvoices(data);
      setInvoicesLoading(false);
    }).catch(() => { if (active) setInvoicesLoading(false); });
    return () => { active = false; };
  }, []);

  const handlePrint = (f) => {
    setModal(null);
    setPrinting(f);
    try { setTimeout(() => window.print(), 200); } catch (e) { /* el entorno puede bloquearlo; se imprime a mano */ }
  };

  const filtered = invoices.filter((f) =>
    (estadoF === "Todos" || f.estado === estadoF) &&
    (f.cliente.toLowerCase().includes(q.toLowerCase()) || f.id.toLowerCase().includes(q.toLowerCase()))
  );
  const toggleEstado = async (id) => {
    const f = invoices.find((x) => x.id === id);
    const nuevoEstado = f.estado === "Pagada" ? "Pendiente" : "Pagada";
    setInvoices(invoices.map((x) => (x.id === id ? { ...x, estado: nuevoEstado } : x)));
    await supabase.from("invoices").update({ estado: nuevoEstado }).eq("id", id);
  };
  const remove = async (id) => {
    setInvoices(invoices.filter((f) => f.id !== id));
    await supabase.from("invoices").delete().eq("id", id);
  };

  const saveNewInvoice = async () => {
    if (!invForm.cliente.trim() || !invForm.concepto.trim()) return;
    const base = Number(invForm.base) || 0;
    const ivaPct = Number(invForm.ivaPct) || 21;
    const iva = Math.round(base * ivaPct) / 100;
    const total = Math.round((base + iva) * 100) / 100;
    const nueva = {
      id: `F-${Date.now()}`, fecha: new Date().toISOString().slice(0, 10),
      cliente: invForm.cliente.trim(), nif: "—", concepto: invForm.concepto.trim(),
      base, iva, total, estado: "Pendiente", metodo: invForm.metodo,
    };
    setSavingInv(true);
    const { data, error } = await supabase.from("invoices").insert(nueva).select();
    if (!error && data && data[0]) setInvoices((prev) => [data[0], ...prev]);
    else setInvoices((prev) => [nueva, ...prev]);
    setSavingInv(false);
    setInvForm(blankInvoiceForm);
    setModal(null);
  };

  const monthlyData = useMemo(() => {
    const map = {};
    invoices.forEach((f) => {
      const key = (f.fecha || "").slice(0, 7);
      if (!key) return;
      map[key] = map[key] || { ingresos: 0, gastos: 0 };
      map[key].ingresos += Number(f.total) || 0;
    });
    (vehicles || []).forEach((v) => {
      const key = (v.fCompra || "").slice(0, 7);
      if (!key) return;
      map[key] = map[key] || { ingresos: 0, gastos: 0 };
      map[key].gastos += (Number(v.compra) || 0) + (Number(v.gastos) || 0);
    });
    const keys = Object.keys(map).sort();
    return keys.map((k) => {
      const [y, m] = k.split("-");
      let label = new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("es-ES", { month: "short" }).replace(".", "");
      label = label.charAt(0).toUpperCase() + label.slice(1);
      return { mes: label, ingresos: Math.round(map[k].ingresos), gastos: Math.round(map[k].gastos) };
    });
  }, [invoices, vehicles]);

  const totalIngresos = monthlyData.reduce((s, m) => s + m.ingresos, 0);
  const totalGastos = monthlyData.reduce((s, m) => s + m.gastos, 0);
  const ultimoMes = monthlyData[monthlyData.length - 1];
  const pagado = invoices.filter((f) => f.estado === "Pagada").reduce((s, f) => s + f.total, 0);
  const pendiente = invoices.filter((f) => f.estado === "Pendiente").reduce((s, f) => s + f.total, 0);

  const pieData = [{ name: "Cobrado", value: pagado }, { name: "Pendiente", value: pendiente }];
  const pieColors = [C.success, C.warn];

  return (
    <div className="jgb-fade">
      <h2 className="text-2xl font-bold mb-1">JGB Contabilidad</h2>
      <p className="text-sm mb-6" style={{ color: C.muted }}>Gestión económica interna de la empresa. Los ingresos salen de las facturas y los gastos de las compras de vehículos registradas.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Ingresos" value={fmtEUR(totalIngresos)} />
        <KpiCard label="Gastos" value={fmtEUR(totalGastos)} accentColor={C.danger} />
        <KpiCard label="Beneficio" value={fmtEUR(totalIngresos - totalGastos)} accentColor={C.success} />
        <KpiCard label={ultimoMes ? `Balance (${ultimoMes.mes})` : "Balance mensual"} value={ultimoMes ? fmtEUR(ultimoMes.ingresos - ultimoMes.gastos) : fmtEUR(0)} accentColor={C.accent} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2 rounded-xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="font-bold text-sm mb-4">Evolución económica</div>
          {monthlyData.length === 0 ? (
            <div className="text-sm py-16 text-center" style={{ color: C.mutedDim }}>Todavía no hay facturas ni compras de vehículos registradas.</div>
          ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" stroke={C.mutedDim} fontSize={12} />
              <YAxis stroke={C.mutedDim} fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip contentStyle={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} formatter={(v) => fmtEUR(v)} />
              <Bar dataKey="ingresos" fill={C.accent} radius={[4, 4, 0, 0]} name="Ingresos" />
              <Bar dataKey="gastos" fill={C.danger} radius={[4, 4, 0, 0]} name="Gastos" />
            </BarChart>
          </ResponsiveContainer>
          )}
        </div>
        <div className="rounded-xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="font-bold text-sm mb-4">Facturación (estado)</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={72} paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} formatter={(v) => fmtEUR(v)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 text-xs mt-1">
            <div className="flex items-center gap-1.5"><span style={{ width: 8, height: 8, borderRadius: 8, background: C.success, display: "inline-block" }} /> Cobrado</div>
            <div className="flex items-center gap-1.5"><span style={{ width: 8, height: 8, borderRadius: 8, background: C.warn, display: "inline-block" }} /> Pendiente</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
        <div className="font-bold text-sm">Facturas ({invoicesLoading ? "…" : filtered.length})</div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.mutedDim }} />
            <input placeholder="Buscar factura o cliente…" value={q} onChange={(e) => setQ(e.target.value)} style={{ ...inputStyle, paddingLeft: 30, width: 220 }} />
          </div>
          <select style={{ ...inputStyle, width: 150 }} value={estadoF} onChange={(e) => setEstadoF(e.target.value)}>
            {["Todos", "Pagada", "Pendiente"].map((o) => <option key={o}>{o}</option>)}
          </select>
          <PrimaryBtn onClick={() => setModal({ mode: "new" })}><Plus size={14} className="inline -mt-0.5 mr-1" />Nueva factura</PrimaryBtn>
        </div>
      </div>

      <div className="rounded-xl overflow-x-auto jgb-scroll" style={{ border: `1px solid ${C.border}` }}>
        <table className="w-full text-sm" style={{ minWidth: 780 }}>
          <thead>
            <tr style={{ background: C.surface, color: C.muted }} className="text-left text-xs">
              {["Nº", "Fecha", "Cliente", "Concepto", "Base", "IVA", "Total", "Estado", "Pago", ""].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr key={f.id} className="jgb-row" style={{ borderTop: `1px solid ${C.border}` }}>
                <td className="px-4 py-3 font-semibold">{f.id}</td>
                <td className="px-4 py-3" style={{ color: C.muted }}>{fmtDate(f.fecha)}</td>
                <td className="px-4 py-3">{f.cliente}</td>
                <td className="px-4 py-3" style={{ color: C.muted, maxWidth: 220 }}>{f.concepto}</td>
                <td className="px-4 py-3">{fmtEUR2(f.base)}</td>
                <td className="px-4 py-3">{fmtEUR2(f.iva)}</td>
                <td className="px-4 py-3 font-semibold">{fmtEUR2(f.total)}</td>
                <td className="px-4 py-3"><Badge tone={estadoTone(f.estado)}>{f.estado}</Badge></td>
                <td className="px-4 py-3" style={{ color: C.muted }}>{f.metodo}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleEstado(f.id)} title="Cambiar estado" style={{ color: C.muted }}><CheckSquare size={15} /></button>
                    <button onClick={() => setModal({ mode: "view", f })} title="Descargar (demo)" style={{ color: C.muted }}><Download size={15} /></button>
                    <button onClick={() => handlePrint(f)} title="Imprimir ficha para Hacienda" style={{ color: C.muted }}><Printer size={15} /></button>
                    <button onClick={() => remove(f.id)} title="Eliminar" style={{ color: C.danger }}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === "new" ? "Nueva factura" : `Factura ${modal?.f?.id}`}>
        {modal?.mode === "new" ? (
          <div>
            <Field label="Cliente"><input style={inputStyle} placeholder="Nombre del cliente" value={invForm.cliente} onChange={(e) => setInvForm({ ...invForm, cliente: e.target.value })} /></Field>
            <Field label="Concepto"><input style={inputStyle} placeholder="Descripción del servicio o venta" value={invForm.concepto} onChange={(e) => setInvForm({ ...invForm, concepto: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Base imponible"><input type="number" style={inputStyle} placeholder="0,00 €" value={invForm.base} onChange={(e) => setInvForm({ ...invForm, base: e.target.value })} /></Field>
              <Field label="IVA %"><input type="number" style={inputStyle} placeholder="21" value={invForm.ivaPct} onChange={(e) => setInvForm({ ...invForm, ivaPct: e.target.value })} /></Field>
            </div>
            <Field label="Método de pago">
              <select style={inputStyle} value={invForm.metodo} onChange={(e) => setInvForm({ ...invForm, metodo: e.target.value })}>
                {["Transferencia", "Efectivo", "Tarjeta", "Financiación"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <PrimaryBtn full onClick={saveNewInvoice}>{savingInv ? "Guardando…" : "Crear factura"}</PrimaryBtn>
          </div>
        ) : (
          <div className="text-sm space-y-2" style={{ color: C.muted }}>
            <div><b style={{ color: C.ink }}>Cliente:</b> {modal?.f?.cliente}</div>
            <div><b style={{ color: C.ink }}>NIF/CIF:</b> {modal?.f?.nif}</div>
            <div><b style={{ color: C.ink }}>Concepto:</b> {modal?.f?.concepto}</div>
            <div><b style={{ color: C.ink }}>Total:</b> {fmtEUR2(modal?.f?.total || 0)}</div>
            <div className="pt-3"><GhostBtn full onClick={() => handlePrint(modal.f)}><Printer size={14} className="inline -mt-0.5 mr-1" />Imprimir ficha para Hacienda</GhostBtn></div>
            <div className="text-xs pt-1" style={{ color: C.mutedDim }}>La descarga en PDF requiere conectar un servicio de generación de documentos en el backend.</div>
          </div>
        )}
      </Modal>

      {printing && (
        <div className="jgb-print-sheet" style={{ position: "fixed", inset: 0, zIndex: 100, background: "#fff", color: "#111", overflowY: "auto" }}>
          <div className="jgb-print-toolbar" style={{ position: "sticky", top: 0, background: "#f4f4f4", borderBottom: "1px solid #ddd", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ fontSize: 13, color: "#333" }}>Vista previa — pulsa <b>Ctrl+P</b> (Windows) o <b>Cmd+P</b> (Mac) para imprimir o guardar como PDF.</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { try { window.print(); } catch (e) {} }} style={{ background: "#161207", color: "#C7A24C", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Imprimir</button>
              <button onClick={() => setPrinting(null)} style={{ background: "#fff", color: "#111", border: "1px solid #999", borderRadius: 6, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cerrar</button>
            </div>
          </div>
          <div style={{ padding: 32, maxWidth: 720, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #111", paddingBottom: 16, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img src={LOGO_SRC} alt="JGB Cars" style={{ height: 42, width: "auto" }} />
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>JGB CARS</div>
                  <div style={{ fontSize: 11, color: "#444" }}>CIF: [pendiente de asignar]</div>
                  <div style={{ fontSize: 11, color: "#444" }}>Atención online — sin sede física</div>
                  <div style={{ fontSize: 11, color: "#444" }}>info@jgbcars.com · +34 900 123 456</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>FICHA DE OPERACIÓN</div>
                <div style={{ fontSize: 11, color: "#444" }}>Justificante interno para deducción de IVA / gastos</div>
                <div style={{ fontSize: 11, color: "#444" }}>Generado: {new Date().toLocaleDateString("es-ES")}</div>
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 24 }}>
              <tbody>
                {[
                  ["Número de factura", printing.id],
                  ["Fecha de emisión", fmtDate(printing.fecha)],
                  ["Cliente", printing.cliente],
                  ["NIF / CIF del cliente", printing.nif],
                  ["Concepto", printing.concepto],
                  ["Método de pago", printing.metodo],
                  ["Estado", printing.estado],
                ].map(([l, v]) => (
                  <tr key={l} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "8px 4px", color: "#555", width: "40%" }}>{l}</td>
                    <td style={{ padding: "8px 4px", fontWeight: 600 }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 32 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #111" }}>
                  {["Base imponible", "IVA", "Total"].map((h) => <th key={h} style={{ textAlign: "left", padding: "8px 4px" }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "8px 4px" }}>{fmtEUR2(printing.base)}</td>
                  <td style={{ padding: "8px 4px" }}>{fmtEUR2(printing.iva)}</td>
                  <td style={{ padding: "8px 4px", fontWeight: 700 }}>{fmtEUR2(printing.total)}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ fontSize: 11, color: "#555", borderTop: "1px solid #ddd", paddingTop: 12 }}>
              Este documento es un resumen generado a partir del sistema de gestión interno de JGB Cars, a efectos de justificar ante la Agencia Tributaria el IVA soportado o el gasto asociado a esta operación. Debe conservarse junto con la factura original, que es el documento con validez fiscal plena.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   VEHÍCULOS
   ============================================================ */
function Vehiculos({ vehicles, vehiclesLoading, addVehicle, deleteVehicle, updateVehicle }) {
  const [q, setQ] = useState("");
  const [estadoF, setEstadoF] = useState("Todos");
  const [sortKey, setSortKey] = useState("fCompra");
  const [selected, setSelected] = useState(null);
  const [printingV, setPrintingV] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const blankForm = {
    marca: "", modelo: "", matricula: "—", vin: "", año: new Date().getFullYear(), km: 0,
    compra: 0, gastos: 0, venta: 0, proveedor: "", estado: "Disponible", fotos: [],
    equipamiento: DEFAULT_EQUIPMENT.join("\n"),
  };
  const [form, setForm] = useState(blankForm);

  const estados = ["Todos", "Disponible", "Reservado", "En preparación", "En reparación", "Pendiente de documentación", "Vendido"];

  const filtered = useMemo(() => {
    return vehicles
      .filter((v) => (estadoF === "Todos" || v.estado === estadoF))
      .filter((v) => `${v.marca} ${v.modelo} ${v.id}`.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => (a[sortKey] > b[sortKey] ? -1 : 1));
  }, [vehicles, q, estadoF, sortKey]);

  const openNew = () => { setForm(blankForm); setPhotoError(""); setSelected({ mode: "new" }); };

  const openEdit = (v) => {
    setForm({
      marca: v.marca, modelo: v.modelo, matricula: v.matricula, vin: v.vin, año: v.año, km: v.km,
      compra: v.compra, gastos: v.gastos || 0, venta: v.venta, proveedor: v.proveedor, estado: v.estado,
      fotos: v.fotos && v.fotos.length > 0 ? v.fotos : (v.foto ? [{ url: v.foto, position: "50% 50%" }] : []),
      equipamiento: (v.equipamiento && v.equipamiento.length > 0 ? v.equipamiento : DEFAULT_EQUIPMENT).join("\n"),
    });
    setPhotoError("");
    setSelected({ mode: "edit", v });
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setPhotoError("");
    setUploadingPhoto(true);
    const nuevas = [];
    for (const file of files) {
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e6)}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error } = await supabase.storage.from("vehiculos").upload(fileName, file);
      if (error) {
        setPhotoError("Alguna foto no se ha podido subir. Inténtalo de nuevo.");
        continue;
      }
      const { data: urlData } = supabase.storage.from("vehiculos").getPublicUrl(fileName);
      nuevas.push({ url: urlData.publicUrl, position: "50% 50%" });
    }
    setForm((f) => ({ ...f, fotos: [...f.fotos, ...nuevas] }));
    setUploadingPhoto(false);
    e.target.value = "";
  };

  const removePhoto = (url) => {
    setForm((f) => ({ ...f, fotos: f.fotos.filter((x) => x.url !== url) }));
  };

  const setPhotoPosition = (url, position) => {
    setForm((f) => ({ ...f, fotos: f.fotos.map((x) => (x.url === url ? { ...x, position } : x)) }));
  };

  const saveNew = async () => {
    if (!form.marca.trim() || !form.modelo.trim()) return;
    const vendidoDeEntrada = form.estado === "Vendido";
    const nuevo = {
      id: `V-${Date.now()}`,
      marca: form.marca.trim(), modelo: form.modelo.trim(), matricula: form.matricula || "—",
      vin: form.vin || "—", año: Number(form.año) || new Date().getFullYear(), km: Number(form.km) || 0,
      compra: Number(form.compra) || 0, gastos: Number(form.gastos) || 0, venta: Number(form.venta) || 0, estado: form.estado,
      proveedor: form.proveedor || "—", cliente: "—", fCompra: new Date().toISOString().slice(0, 10),
      fVenta: vendidoDeEntrada ? new Date().toISOString().slice(0, 10) : null,
      cambio: "Automático", tag: null, fotos: form.fotos, foto: (form.fotos[0] && form.fotos[0].url) || null,
      equipamiento: form.equipamiento.split("\n").map((s) => s.trim()).filter(Boolean),
      combustible: "Diésel", potencia: "—", traccion: "Delantera", colorExterior: "—", colorInterior: "—",
    };
    setSaving(true);
    await addVehicle(nuevo);
    if (vendidoDeEntrada) {
      const base = Math.round((nuevo.venta / 1.21) * 100) / 100;
      const iva = Math.round((nuevo.venta - base) * 100) / 100;
      await supabase.from("invoices").insert({
        id: `F-${Date.now()}`,
        fecha: nuevo.fVenta,
        cliente: "Cliente sin especificar",
        nif: "—",
        concepto: `Venta ${nuevo.marca} ${nuevo.modelo}`,
        base, iva, total: nuevo.venta,
        estado: "Pendiente", metodo: "Transferencia",
      });
    }
    setSaving(false);
    setSelected(null);
  };

  const saveEdit = async () => {
    if (!form.marca.trim() || !form.modelo.trim()) return;
    const seVendeAhora = form.estado === "Vendido" && selected.v.estado !== "Vendido";
    const actualizado = {
      ...selected.v,
      marca: form.marca.trim(), modelo: form.modelo.trim(), matricula: form.matricula || "—",
      vin: form.vin || "—", año: Number(form.año) || selected.v.año, km: Number(form.km) || 0,
      compra: Number(form.compra) || 0, gastos: Number(form.gastos) || 0, venta: Number(form.venta) || 0,
      estado: form.estado, proveedor: form.proveedor || "—", fotos: form.fotos, foto: (form.fotos[0] && form.fotos[0].url) || null,
      equipamiento: form.equipamiento.split("\n").map((s) => s.trim()).filter(Boolean),
      fVenta: seVendeAhora ? new Date().toISOString().slice(0, 10) : selected.v.fVenta,
    };
    setSaving(true);
    await updateVehicle(actualizado);
    if (seVendeAhora) {
      const base = Math.round((actualizado.venta / 1.21) * 100) / 100;
      const iva = Math.round((actualizado.venta - base) * 100) / 100;
      await supabase.from("invoices").insert({
        id: `F-${Date.now()}`,
        fecha: actualizado.fVenta,
        cliente: actualizado.cliente && actualizado.cliente !== "—" ? actualizado.cliente : "Cliente sin especificar",
        nif: "—",
        concepto: `Venta ${actualizado.marca} ${actualizado.modelo}`,
        base, iva, total: actualizado.venta,
        estado: "Pendiente", metodo: "Transferencia",
      });
    }
    setSaving(false);
    setSelected(null);
  };

  const handlePrintV = (v) => {
    setSelected(null);
    setPrintingV(v);
    try { setTimeout(() => window.print(), 200); } catch (e) { /* se imprime a mano con Ctrl+P */ }
  };

  return (
    <div className="jgb-fade">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
        <h2 className="text-2xl font-bold">Vehículos</h2>
        <PrimaryBtn onClick={openNew}><Plus size={14} className="inline -mt-0.5 mr-1" />Añadir vehículo</PrimaryBtn>
      </div>
      <p className="text-sm mb-5" style={{ color: C.muted }}>
        {vehiclesLoading ? "Cargando vehículos…" : `${filtered.length} vehículos en el sistema.`} Los que están "Disponible", "Reservado" o "Vendido" se ven también en la web pública, en Stock.
      </p>

      <div className="flex items-center gap-2 flex-wrap mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.mutedDim }} />
          <input placeholder="Buscar marca, modelo, ref…" value={q} onChange={(e) => setQ(e.target.value)} style={{ ...inputStyle, paddingLeft: 30, width: 240 }} />
        </div>
        <select style={{ ...inputStyle, width: 200 }} value={estadoF} onChange={(e) => setEstadoF(e.target.value)}>
          {estados.map((o) => <option key={o}>{o}</option>)}
        </select>
        <select style={{ ...inputStyle, width: 170 }} value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="fCompra">Ordenar: más reciente</option>
          <option value="venta">Ordenar: precio venta</option>
          <option value="km">Ordenar: kilometraje</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((v) => (
          <div key={v.id} onClick={() => setSelected({ mode: "view", v })} role="button" tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter") setSelected({ mode: "view", v }); }}
            className="jgb-btn text-left rounded-xl overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}`, cursor: "pointer" }}>
            <div className="relative" style={{ aspectRatio: "16 / 9" }}>
              <VehiclePhoto v={v} tone={C.accent} />
              {v.estado === "Vendido" && (
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrintV(v); }}
                  title="Imprimir ficha de venta (gastos y beneficio)"
                  className="jgb-btn absolute bottom-2 right-2 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                  style={{ background: "rgba(11,12,15,.85)", color: C.accent, border: `1px solid ${C.border}` }}
                >
                  <Printer size={13} /> Ficha de venta
                </button>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold text-sm">{v.marca} {v.modelo}</div>
                  <div className="text-xs" style={{ color: C.mutedDim }}>{v.id} · {v.año} · {v.km.toLocaleString("es-ES")} km</div>
                </div>
                <Badge tone={estadoTone(v.estado)}>{v.estado}</Badge>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
                <div className="text-xs" style={{ color: C.mutedDim }}>Compra {fmtEUR(v.compra)}</div>
                <div className="jgb-display font-bold" style={{ color: C.accent }}>{fmtEUR(v.venta)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.mode === "new" ? "Añadir vehículo" : selected?.mode === "edit" ? `Editar ${selected?.v?.marca} ${selected?.v?.modelo}` : `${selected?.v?.marca} ${selected?.v?.modelo}`} wide>
        {(selected?.mode === "new" || selected?.mode === "edit") ? (
          <div>
            <div className="grid grid-cols-2 gap-x-4">
              <Field label="Marca"><input style={inputStyle} value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} /></Field>
              <Field label="Modelo"><input style={inputStyle} value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} /></Field>
              <Field label="Matrícula"><input style={inputStyle} value={form.matricula} onChange={(e) => setForm({ ...form, matricula: e.target.value })} /></Field>
              <Field label="Bastidor / VIN"><input style={inputStyle} value={form.vin} onChange={(e) => setForm({ ...form, vin: e.target.value })} /></Field>
              <Field label="Año"><input type="number" style={inputStyle} value={form.año} onChange={(e) => setForm({ ...form, año: e.target.value })} /></Field>
              <Field label="Kilometraje"><input type="number" style={inputStyle} value={form.km} onChange={(e) => setForm({ ...form, km: e.target.value })} /></Field>
              <Field label="Precio de compra"><input type="number" style={inputStyle} value={form.compra} onChange={(e) => setForm({ ...form, compra: e.target.value })} /></Field>
              <Field label="Gastos (transporte, ITV, gestoría…)"><input type="number" style={inputStyle} value={form.gastos} onChange={(e) => setForm({ ...form, gastos: e.target.value })} /></Field>
              <Field label="Precio de venta"><input type="number" style={inputStyle} value={form.venta} onChange={(e) => setForm({ ...form, venta: e.target.value })} /></Field>
              <Field label="Proveedor"><input style={inputStyle} value={form.proveedor} onChange={(e) => setForm({ ...form, proveedor: e.target.value })} /></Field>
              <Field label="Estado">
                <select style={inputStyle} value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                  {["Disponible", "Reservado", "En preparación", "En reparación", "Pendiente de documentación", "Vendido"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <div className="col-span-2">
                <Field label="Fotos del vehículo (puedes elegir varias a la vez)">
                  <input type="file" accept="image/*" multiple style={inputStyle} onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                  {uploadingPhoto && <div className="text-xs mt-1" style={{ color: C.mutedDim }}>Subiendo foto(s)…</div>}
                  {photoError && <div className="text-xs mt-1" style={{ color: C.danger }}>{photoError}</div>}
                  {form.fotos.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-3">
                      {form.fotos.map((f) => (
                        <div key={f.url}>
                          <div className="relative rounded-lg overflow-hidden mb-1.5" style={{ width: 130, aspectRatio: "4 / 3" }}>
                            <img src={f.url} alt="Vista previa" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: f.position }} />
                            <button type="button" onClick={() => removePhoto(f.url)}
                              className="absolute top-1 right-1 flex items-center justify-center rounded-full"
                              style={{ width: 18, height: 18, background: "rgba(11,12,15,.75)", color: C.ink }}>
                              <X size={11} />
                            </button>
                          </div>
                          <div className="grid grid-cols-3 gap-1" style={{ width: 60 }}>
                            {POSITION_GRID.map((pos) => (
                              <button key={pos} type="button" onClick={() => setPhotoPosition(f.url, pos)}
                                title="Encuadrar aquí"
                                style={{ width: 16, height: 16, borderRadius: 3, background: f.position === pos ? C.accent : C.surface2, border: `1px solid ${C.border}` }} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-[11px] mt-1" style={{ color: C.mutedDim }}>Usa la rejilla bajo cada foto para elegir qué parte se ve al recortarla en las tarjetas.</div>
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Equipamiento (una línea por elemento)">
                  <textarea style={{ ...inputStyle, minHeight: 110, resize: "vertical" }} value={form.equipamiento} onChange={(e) => setForm({ ...form, equipamiento: e.target.value })} />
                </Field>
              </div>
            </div>
            <div className="text-xs mb-3" style={{ color: C.mutedDim }}>Si el estado es "Disponible", "Reservado" o "Vendido", este vehículo aparecerá al instante en la web pública, en Stock.</div>
            <PrimaryBtn full onClick={() => { if (!uploadingPhoto) (selected?.mode === "edit" ? saveEdit() : saveNew()); }}>
              {saving ? "Guardando…" : uploadingPhoto ? "Esperando la foto…" : selected?.mode === "edit" ? "Guardar cambios" : "Guardar vehículo"}
            </PrimaryBtn>
          </div>
        ) : selected?.v && (
          <div>
            <div className="rounded-lg overflow-hidden mb-4" style={{ aspectRatio: "16 / 9" }}><VehiclePhoto v={selected.v} tone={C.accent} /></div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              {[["Matrícula", selected.v.matricula], ["VIN", selected.v.vin], ["Año", selected.v.año], ["Kilometraje", `${selected.v.km.toLocaleString("es-ES")} km`],
              ["Precio compra", fmtEUR(selected.v.compra)], ["Precio venta", fmtEUR(selected.v.venta)], ["Proveedor", selected.v.proveedor], ["Cliente", selected.v.cliente],
              ["Fecha compra", fmtDate(selected.v.fCompra)], ["Fecha venta", selected.v.fVenta ? fmtDate(selected.v.fVenta) : "—"]].map(([l, val]) => (
                <div key={l}><div className="text-xs" style={{ color: C.mutedDim }}>{l}</div><div className="font-semibold">{val}</div></div>
              ))}
            </div>
            {selected.v.estado === "Vendido" && (
              <GhostBtn full onClick={() => handlePrintV(selected.v)}><Printer size={14} className="inline -mt-0.5 mr-1" />Imprimir ficha de venta (gastos y beneficio)</GhostBtn>
            )}
            <div className="flex gap-2 mt-2">
              <GhostBtn full onClick={() => openEdit(selected.v)}><Pencil size={14} className="inline -mt-0.5 mr-1" />Editar</GhostBtn>
              <GhostBtn full onClick={() => { deleteVehicle(selected.v.id); setSelected(null); }}>
                <Trash2 size={14} className="inline -mt-0.5 mr-1" />Eliminar
              </GhostBtn>
            </div>
          </div>
        )}
      </Modal>

      {printingV && (() => {
        const v = printingV;
        const beneficio = v.venta - v.compra - (v.gastos || 0);
        const margen = v.venta ? (beneficio / v.venta) * 100 : 0;
        return (
          <div className="jgb-print-sheet" style={{ position: "fixed", inset: 0, zIndex: 100, background: "#fff", color: "#111", overflowY: "auto" }}>
            <div className="jgb-print-toolbar" style={{ position: "sticky", top: 0, background: "#f4f4f4", borderBottom: "1px solid #ddd", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ fontSize: 13, color: "#333" }}>Vista previa — pulsa <b>Ctrl+P</b> (Windows) o <b>Cmd+P</b> (Mac) para imprimir o guardar como PDF.</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { try { window.print(); } catch (e) {} }} style={{ background: "#161207", color: "#C7A24C", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Imprimir</button>
                <button onClick={() => setPrintingV(null)} style={{ background: "#fff", color: "#111", border: "1px solid #999", borderRadius: 6, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cerrar</button>
              </div>
            </div>
            <div style={{ padding: 32, maxWidth: 720, margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #111", paddingBottom: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={LOGO_SRC} alt="JGB Cars" style={{ height: 42, width: "auto" }} />
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>JGB CARS</div>
                    <div style={{ fontSize: 11, color: "#444" }}>CIF: [pendiente de asignar]</div>
                    <div style={{ fontSize: 11, color: "#444" }}>Atención online — sin sede física</div>
                    <div style={{ fontSize: 11, color: "#444" }}>info@jgbcars.com · +34 900 123 456</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>FICHA DE VENTA DE VEHÍCULO</div>
                  <div style={{ fontSize: 11, color: "#444" }}>Justificante interno de gastos y beneficio</div>
                  <div style={{ fontSize: 11, color: "#444" }}>Generado: {new Date().toLocaleDateString("es-ES")}</div>
                </div>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 24 }}>
                <tbody>
                  {[
                    ["Referencia interna", v.id],
                    ["Vehículo", `${v.marca} ${v.modelo}`],
                    ["Matrícula", v.matricula],
                    ["Bastidor / VIN", v.vin],
                    ["Fecha de compra", fmtDate(v.fCompra)],
                    ["Fecha de venta", v.fVenta ? fmtDate(v.fVenta) : "—"],
                    ["Proveedor (origen)", v.proveedor],
                    ["Cliente (destino)", v.cliente],
                  ].map(([l, val]) => (
                    <tr key={l} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: "8px 4px", color: "#555", width: "40%" }}>{l}</td>
                      <td style={{ padding: "8px 4px", fontWeight: 600 }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #111" }}>
                    {["Concepto", "Importe"].map((h) => <th key={h} style={{ textAlign: "left", padding: "8px 4px" }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #ddd" }}><td style={{ padding: "8px 4px" }}>Precio de compra</td><td style={{ padding: "8px 4px" }}>{fmtEUR2(v.compra)}</td></tr>
                  <tr style={{ borderBottom: "1px solid #ddd" }}><td style={{ padding: "8px 4px" }}>Gastos (transporte, ITV, gestoría…)</td><td style={{ padding: "8px 4px" }}>{fmtEUR2(v.gastos || 0)}</td></tr>
                  <tr style={{ borderBottom: "1px solid #ddd" }}><td style={{ padding: "8px 4px" }}>Precio de venta</td><td style={{ padding: "8px 4px" }}>{fmtEUR2(v.venta)}</td></tr>
                  <tr style={{ borderBottom: "2px solid #111" }}>
                    <td style={{ padding: "8px 4px", fontWeight: 700 }}>Beneficio bruto</td>
                    <td style={{ padding: "8px 4px", fontWeight: 700 }}>{fmtEUR2(beneficio)}</td>
                  </tr>
                  <tr><td style={{ padding: "8px 4px", color: "#555" }}>Margen sobre venta</td><td style={{ padding: "8px 4px" }}>{margen.toFixed(1)}%</td></tr>
                </tbody>
              </table>

              <div style={{ fontSize: 11, color: "#555", borderTop: "1px solid #ddd", paddingTop: 12 }}>
                Este documento es un resumen generado a partir del sistema de gestión interno de JGB Cars, que detalla los gastos asociados y el beneficio de esta operación de compraventa, a efectos de justificar ante la Agencia Tributaria el resultado de la operación. Debe conservarse junto con las facturas de compra, gastos y venta originales, que son los documentos con validez fiscal plena.
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ============================================================
   CLIENTES
   ============================================================ */
function Clientes() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const blankForm = { nombre: "", apellidos: "", empresa: "—", nif: "", telefono: "", email: "", direccion: "", notas: "" };
  const [form, setForm] = useState(blankForm);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    let active = true;
    supabase.from("clients").select("*").order("created_at", { ascending: false }).then(({ data, error }) => {
      if (!active) return;
      if (!error && data) setClients(data);
      setLoading(false);
    }).catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = clients.filter((c) => `${c.nombre} ${c.apellidos} ${c.empresa}`.toLowerCase().includes(q.toLowerCase()));

  const saveNew = async () => {
    if (!form.nombre.trim()) return;
    const nuevo = { id: `C-${Date.now()}`, ...form, nombre: form.nombre.trim(), vehiculos: [] };
    setSaving(true);
    const { data, error } = await supabase.from("clients").insert(nuevo).select();
    if (!error && data && data[0]) setClients((prev) => [data[0], ...prev]);
    else setClients((prev) => [nuevo, ...prev]);
    setSaving(false);
    setForm(blankForm);
    setSelected(null);
  };

  return (
    <div className="jgb-fade">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <PrimaryBtn onClick={() => setSelected({ mode: "new" })}><Plus size={14} className="inline -mt-0.5 mr-1" />Nuevo cliente</PrimaryBtn>
      </div>
      <p className="text-sm mb-5" style={{ color: C.muted }}>CRM interno · {loading ? "cargando…" : `${filtered.length} clientes.`}</p>
      <div className="relative mb-4" style={{ maxWidth: 280 }}>
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.mutedDim }} />
        <input placeholder="Buscar cliente o empresa…" value={q} onChange={(e) => setQ(e.target.value)} style={{ ...inputStyle, paddingLeft: 30 }} />
      </div>
      <div className="rounded-xl overflow-x-auto jgb-scroll" style={{ border: `1px solid ${C.border}` }}>
        <table className="w-full text-sm" style={{ minWidth: 640 }}>
          <thead>
            <tr style={{ background: C.surface, color: C.muted }} className="text-left text-xs">
              {["Nombre", "Empresa", "Teléfono", "Email", "Vehículos", ""].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="jgb-row" style={{ borderTop: `1px solid ${C.border}` }}>
                <td className="px-4 py-3 font-semibold">{c.nombre} {c.apellidos}</td>
                <td className="px-4 py-3" style={{ color: C.muted }}>{c.empresa}</td>
                <td className="px-4 py-3" style={{ color: C.muted }}>{c.telefono}</td>
                <td className="px-4 py-3" style={{ color: C.muted }}>{c.email}</td>
                <td className="px-4 py-3">{(c.vehiculos || []).length}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setSelected({ mode: "view", c })} style={{ color: C.accent }} className="text-xs font-semibold">Ver ficha</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.mode === "new" ? "Nuevo cliente" : selected?.c ? `${selected.c.nombre} ${selected.c.apellidos}` : ""}>
        {selected?.mode === "new" ? (
          <div>
            <Field label="Nombre"><input style={inputStyle} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></Field>
            <Field label="Apellidos"><input style={inputStyle} value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })} /></Field>
            <Field label="Empresa"><input style={inputStyle} value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="NIF/CIF"><input style={inputStyle} value={form.nif} onChange={(e) => setForm({ ...form, nif: e.target.value })} /></Field>
              <Field label="Teléfono"><input style={inputStyle} value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} /></Field>
            </div>
            <Field label="Email"><input style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="Dirección"><input style={inputStyle} value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} /></Field>
            <Field label="Notas"><input style={inputStyle} value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} /></Field>
            <PrimaryBtn full onClick={saveNew}>{saving ? "Guardando…" : "Guardar cliente"}</PrimaryBtn>
          </div>
        ) : selected?.c && (
          <div className="text-sm space-y-2">
            {[["Empresa", selected.c.empresa], ["NIF/CIF", selected.c.nif], ["Teléfono", selected.c.telefono], ["Email", selected.c.email], ["Dirección", selected.c.direccion]].map(([l, v]) => (
              <div key={l}><span style={{ color: C.mutedDim }}>{l}: </span><b>{v}</b></div>
            ))}
            <div className="pt-2">
              <div className="text-xs mb-1" style={{ color: C.mutedDim }}>Vehículos asociados</div>
              {(selected.c.vehiculos || []).length ? selected.c.vehiculos.map((id) => <Badge key={id} tone="accent">{id}</Badge>) : <span style={{ color: C.mutedDim }}>Ninguno</span>}
            </div>
            <div className="pt-2 text-xs" style={{ color: C.muted }}><span style={{ color: C.mutedDim }}>Notas: </span>{selected.c.notas}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ============================================================
   TAREAS (Kanban)
   ============================================================ */
function Tareas() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const blankForm = { titulo: "", desc: "", responsable: "", prioridad: "Media", limite: "" };
  const [form, setForm] = useState(blankForm);
  const cols = ["Pendiente", "En proceso", "Completada"];

  React.useEffect(() => {
    let active = true;
    supabase.from("tasks").select("*").order("limite", { ascending: true }).then(({ data, error }) => {
      if (!active) return;
      if (!error && data) setTasks(data.map((t) => ({ ...t, desc: t.descripcion })));
      setLoading(false);
    }).catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const move = async (id, dir) => {
    const t = tasks.find((x) => x.id === id);
    const idx = cols.indexOf(t.estado);
    const next = cols[Math.min(cols.length - 1, Math.max(0, idx + dir))];
    setTasks(tasks.map((x) => (x.id === id ? { ...x, estado: next } : x)));
    await supabase.from("tasks").update({ estado: next }).eq("id", id);
  };

  const saveNew = async () => {
    if (!form.titulo.trim()) return;
    const nueva = {
      id: `T-${Date.now()}`, titulo: form.titulo.trim(), descripcion: form.desc,
      responsable: form.responsable || "Sin asignar", prioridad: form.prioridad,
      limite: form.limite || new Date().toISOString().slice(0, 10), estado: "Pendiente",
    };
    const { data, error } = await supabase.from("tasks").insert(nueva).select();
    const nuevaLocal = { ...nueva, desc: nueva.descripcion };
    if (!error && data && data[0]) setTasks((prev) => [{ ...data[0], desc: data[0].descripcion }, ...prev]);
    else setTasks((prev) => [nuevaLocal, ...prev]);
    setForm(blankForm);
    setAdding(false);
  };

  const prioTone = { Baja: "neutral", Media: "accent", Alta: "warn", Urgente: "danger" };

  return (
    <div className="jgb-fade">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
        <h2 className="text-2xl font-bold">Tareas</h2>
        <PrimaryBtn onClick={() => setAdding(true)}><Plus size={14} className="inline -mt-0.5 mr-1" />Nueva tarea</PrimaryBtn>
      </div>
      <p className="text-sm mb-5" style={{ color: C.muted }}>{loading ? "Cargando…" : "Vista Kanban del equipo."}</p>
      <div className="grid md:grid-cols-3 gap-4">
        {cols.map((col, ci) => (
          <div key={col} className="rounded-xl p-3" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="font-bold text-sm mb-3 px-1 flex items-center justify-between">
              {col} <span className="text-xs" style={{ color: C.mutedDim }}>{tasks.filter((t) => t.estado === col).length}</span>
            </div>
            <div className="space-y-2">
              {tasks.filter((t) => t.estado === col).map((t) => (
                <div key={t.id} className="rounded-lg p-3" style={{ background: C.surface2, border: `1px solid ${C.border}` }}>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="text-sm font-semibold">{t.titulo}</div>
                    <Badge tone={prioTone[t.prioridad]}>{t.prioridad}</Badge>
                  </div>
                  <div className="text-xs mb-2" style={{ color: C.muted }}>{t.desc}</div>
                  <div className="flex items-center justify-between text-xs" style={{ color: C.mutedDim }}>
                    <span>{t.responsable}</span><span>{fmtDate(t.limite)}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {ci > 0 && <button onClick={() => move(t.id, -1)} className="text-xs font-semibold" style={{ color: C.muted }}>← Mover</button>}
                    {ci < cols.length - 1 && <button onClick={() => move(t.id, 1)} className="text-xs font-semibold" style={{ color: C.accent }}>Mover →</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Modal open={adding} onClose={() => setAdding(false)} title="Nueva tarea">
        <Field label="Título"><input style={inputStyle} value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></Field>
        <Field label="Descripción"><input style={inputStyle} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Responsable"><input style={inputStyle} value={form.responsable} onChange={(e) => setForm({ ...form, responsable: e.target.value })} /></Field>
          <Field label="Prioridad">
            <select style={inputStyle} value={form.prioridad} onChange={(e) => setForm({ ...form, prioridad: e.target.value })}>
              {["Baja", "Media", "Alta", "Urgente"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Fecha límite"><input type="date" style={inputStyle} value={form.limite} onChange={(e) => setForm({ ...form, limite: e.target.value })} /></Field>
        <PrimaryBtn full onClick={saveNew}>Guardar tarea</PrimaryBtn>
      </Modal>
    </div>
  );
}

/* ============================================================
   DOCUMENTOS
   ============================================================ */
function Documentos() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("Todas");
  const [q, setQ] = useState("");
  const cats = ["Todas", "Vehículos", "Clientes", "Contabilidad", "Proveedores", "Administración", "Empresa", "Otros"];

  React.useEffect(() => {
    let active = true;
    supabase.from("documents").select("*").order("fecha", { ascending: false }).then(({ data, error }) => {
      if (!active) return;
      if (!error && data) setDocs(data);
      setLoading(false);
    }).catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = docs.filter((d) => (cat === "Todas" || d.categoria === cat) && d.nombre.toLowerCase().includes(q.toLowerCase()));

  const removeDoc = async (id) => {
    setDocs(docs.filter((x) => x.id !== id));
    await supabase.from("documents").delete().eq("id", id);
  };

  return (
    <div className="jgb-fade">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
        <h2 className="text-2xl font-bold">Documentos</h2>
        <PrimaryBtn><Plus size={14} className="inline -mt-0.5 mr-1" />Subir archivo</PrimaryBtn>
      </div>
      <p className="text-sm mb-5" style={{ color: C.muted }}>Acceso restringido a usuarios autorizados.</p>
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.mutedDim }} />
          <input placeholder="Buscar documento…" value={q} onChange={(e) => setQ(e.target.value)} style={{ ...inputStyle, paddingLeft: 30, width: 220 }} />
        </div>
        <select style={{ ...inputStyle, width: 180 }} value={cat} onChange={(e) => setCat(e.target.value)}>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="rounded-xl overflow-x-auto jgb-scroll" style={{ border: `1px solid ${C.border}` }}>
        <table className="w-full text-sm" style={{ minWidth: 560 }}>
          <thead><tr style={{ background: C.surface, color: C.muted }} className="text-left text-xs">
            {["Nombre", "Categoría", "Fecha", ""].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id} className="jgb-row" style={{ borderTop: `1px solid ${C.border}` }}>
                <td className="px-4 py-3 flex items-center gap-2"><FileText size={14} style={{ color: C.accent }} />{d.nombre}</td>
                <td className="px-4 py-3"><Badge>{d.categoria}</Badge></td>
                <td className="px-4 py-3" style={{ color: C.muted }}>{fmtDate(d.fecha)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button style={{ color: C.muted }} title="Descargar (demo)"><Download size={15} /></button>
                    <button onClick={() => removeDoc(d.id)} style={{ color: C.danger }} title="Eliminar"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
   HERRAMIENTAS
   ============================================================ */
function Herramientas() {
  const [tab, setTab] = useState("calc");
  const tabs = [
    ["calc", "Calculadora", CalcIcon], ["iva", "IVA", Percent], ["margen", "Margen", TrendingUp],
    ["financ", "Financiación", Landmark], ["conv", "Conversor", ArrowLeftRight], ["notas", "Notas rápidas", StickyNote],
  ];

  // Calculadora
  const [expr, setExpr] = useState("");
  const calc = () => {
    try {
      if (!/^[0-9+\-*/.() ]*$/.test(expr)) return setExpr("Error");
      // eslint-disable-next-line no-new-func
      const r = Function(`"use strict"; return (${expr || 0})`)();
      setExpr(String(r));
    } catch { setExpr("Error"); }
  };

  // IVA
  const [ivaBase, setIvaBase] = useState(1000);
  const [ivaPct, setIvaPct] = useState(21);
  const ivaCuota = (ivaBase * ivaPct) / 100;

  // Margen
  const [mCompra, setMCompra] = useState(20000);
  const [mGastos, setMGastos] = useState(3600);
  const [mVenta, setMVenta] = useState(27900);
  const beneficio = mVenta - mCompra - mGastos;
  const margenPct = mVenta ? (beneficio / mVenta) * 100 : 0;
  const rentPct = (mCompra + mGastos) ? (beneficio / (mCompra + mGastos)) * 100 : 0;

  // Financiación
  const [fPrecio, setFPrecio] = useState(25000);
  const [fEntrada, setFEntrada] = useState(5000);
  const [fMeses, setFMeses] = useState(60);
  const [fTasa, setFTasa] = useState(7.5);
  const principal = Math.max(0, fPrecio - fEntrada);
  const r = fTasa / 100 / 12;
  const cuota = r > 0 ? (principal * r) / (1 - Math.pow(1 + r, -fMeses)) : principal / fMeses;
  const totalPagado = cuota * fMeses + fEntrada;

  // Conversor
  const [convTipo, setConvTipo] = useState("kmmi");
  const [convVal, setConvVal] = useState(100);
  const convResult = useMemo(() => {
    if (convTipo === "kmmi") return (convVal * 0.621371).toFixed(2) + " millas";
    if (convTipo === "mikm") return (convVal / 0.621371).toFixed(2) + " km";
    if (convTipo === "cvkw") return (convVal * 0.7355).toFixed(2) + " kW";
    if (convTipo === "kwcv") return (convVal / 0.7355).toFixed(2) + " CV";
    return "";
  }, [convTipo, convVal]);

  // Notas
  const [notas, setNotas] = useState(["Llamar al proveedor de Múnich antes del jueves.", "Revisar tasación pendiente de David Serra."]);
  const [notaTxt, setNotaTxt] = useState("");

  return (
    <div className="jgb-fade">
      <h2 className="text-2xl font-bold mb-1">Herramientas</h2>
      <p className="text-sm mb-5" style={{ color: C.muted }}>Caja de herramientas digital para el equipo.</p>
      <div className="flex gap-2 flex-wrap mb-6">
        {tabs.map(([k, l, Icon]) => (
          <button key={k} onClick={() => setTab(k)} className="jgb-btn flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
            style={{ background: tab === k ? C.accent : C.surface, color: tab === k ? "#161207" : C.muted, border: `1px solid ${tab === k ? C.accent : C.border}` }}>
            <Icon size={13} /> {l}
          </button>
        ))}
      </div>

      <div className="rounded-xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}`, maxWidth: 520 }}>
        {tab === "calc" && (
          <div>
            <input style={{ ...inputStyle, fontSize: 20, textAlign: "right", marginBottom: 10 }} value={expr} onChange={(e) => setExpr(e.target.value)} onKeyDown={(e) => e.key === "Enter" && calc()} placeholder="0" />
            <div className="flex gap-2">
              <PrimaryBtn onClick={calc} full>Calcular</PrimaryBtn>
              <GhostBtn onClick={() => setExpr("")}>Borrar</GhostBtn>
            </div>
            <div className="text-xs mt-2" style={{ color: C.mutedDim }}>Admite + − × (usa *) ÷ (usa /) y paréntesis.</div>
          </div>
        )}
        {tab === "iva" && (
          <div>
            <Field label="Precio sin IVA"><input type="number" style={inputStyle} value={ivaBase} onChange={(e) => setIvaBase(+e.target.value)} /></Field>
            <Field label="IVA %"><input type="number" style={inputStyle} value={ivaPct} onChange={(e) => setIvaPct(+e.target.value)} /></Field>
            <div className="rounded-lg p-3 text-sm" style={{ background: C.surface2 }}>
              <div className="flex justify-between mb-1"><span style={{ color: C.muted }}>Cuota IVA</span><b>{fmtEUR2(ivaCuota)}</b></div>
              <div className="flex justify-between"><span style={{ color: C.muted }}>Precio con IVA</span><b style={{ color: C.accent }}>{fmtEUR2(ivaBase + ivaCuota)}</b></div>
            </div>
          </div>
        )}
        {tab === "margen" && (
          <div>
            <Field label="Precio de compra"><input type="number" style={inputStyle} value={mCompra} onChange={(e) => setMCompra(+e.target.value)} /></Field>
            <Field label="Gastos asociados (transporte, ITV, gestoría…)"><input type="number" style={inputStyle} value={mGastos} onChange={(e) => setMGastos(+e.target.value)} /></Field>
            <Field label="Precio de venta"><input type="number" style={inputStyle} value={mVenta} onChange={(e) => setMVenta(+e.target.value)} /></Field>
            <div className="rounded-lg p-3 text-sm space-y-1" style={{ background: C.surface2 }}>
              <div className="flex justify-between"><span style={{ color: C.muted }}>Beneficio bruto</span><b style={{ color: beneficio >= 0 ? C.success : C.danger }}>{fmtEUR2(beneficio)}</b></div>
              <div className="flex justify-between"><span style={{ color: C.muted }}>Margen %</span><b>{margenPct.toFixed(1)}%</b></div>
              <div className="flex justify-between"><span style={{ color: C.muted }}>Rentabilidad %</span><b>{rentPct.toFixed(1)}%</b></div>
            </div>
            <div className="text-xs mt-2" style={{ color: C.mutedDim }}>Referencia interna: los gastos de importación suelen suponer ~18% sobre el precio de compra.</div>
          </div>
        )}
        {tab === "financ" && (
          <div>
            <Field label="Precio del vehículo"><input type="number" style={inputStyle} value={fPrecio} onChange={(e) => setFPrecio(+e.target.value)} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Entrada"><input type="number" style={inputStyle} value={fEntrada} onChange={(e) => setFEntrada(+e.target.value)} /></Field>
              <Field label="Nº de meses"><input type="number" style={inputStyle} value={fMeses} onChange={(e) => setFMeses(+e.target.value)} /></Field>
            </div>
            <Field label="Tipo de interés (TIN anual %)"><input type="number" style={inputStyle} value={fTasa} onChange={(e) => setFTasa(+e.target.value)} /></Field>
            <div className="rounded-lg p-3 text-sm space-y-1" style={{ background: C.surface2 }}>
              <div className="flex justify-between"><span style={{ color: C.muted }}>Cuota mensual aprox.</span><b style={{ color: C.accent }}>{fmtEUR2(cuota)}</b></div>
              <div className="flex justify-between"><span style={{ color: C.muted }}>Coste total</span><b>{fmtEUR2(totalPagado)}</b></div>
            </div>
            <div className="text-xs mt-2" style={{ color: C.mutedDim }}>Cálculo orientativo; la financiación real depende de la entidad.</div>
          </div>
        )}
        {tab === "conv" && (
          <div>
            <Field label="Tipo de conversión">
              <select style={inputStyle} value={convTipo} onChange={(e) => setConvTipo(e.target.value)}>
                <option value="kmmi">Kilómetros → Millas</option>
                <option value="mikm">Millas → Kilómetros</option>
                <option value="cvkw">CV → kW</option>
                <option value="kwcv">kW → CV</option>
              </select>
            </Field>
            <Field label="Valor"><input type="number" style={inputStyle} value={convVal} onChange={(e) => setConvVal(+e.target.value)} /></Field>
            <div className="rounded-lg p-3 text-sm" style={{ background: C.surface2 }}>
              <span style={{ color: C.muted }}>Resultado: </span><b style={{ color: C.accent }}>{convResult}</b>
            </div>
            <div className="text-xs mt-3" style={{ color: C.mutedDim }}>Conversión € ↔ otras monedas requiere un servicio de tipos de cambio en tiempo real (a configurar en el backend).</div>
          </div>
        )}
        {tab === "notas" && (
          <div>
            <div className="flex gap-2 mb-3">
              <input style={inputStyle} placeholder="Escribe una nota…" value={notaTxt} onChange={(e) => setNotaTxt(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && notaTxt.trim()) { setNotas([notaTxt, ...notas]); setNotaTxt(""); } }} />
              <PrimaryBtn onClick={() => { if (notaTxt.trim()) { setNotas([notaTxt, ...notas]); setNotaTxt(""); } }}>Añadir</PrimaryBtn>
            </div>
            <div className="space-y-2">
              {notas.map((n, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg p-2.5 text-sm" style={{ background: C.surface2 }}>
                  {n}
                  <button onClick={() => setNotas(notas.filter((_, idx) => idx !== i))} style={{ color: C.mutedDim }}><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   CALENDARIO
   ============================================================ */
function Calendario() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("Mes");
  const [adding, setAdding] = useState(false);
  const blankForm = { titulo: "", tipo: "Cita", fecha: "", hora: "" };
  const [form, setForm] = useState(blankForm);
  const tipoTone = { Entrega: "success", Revisión: "warn", Reunión: "accent", Cita: "accent", Recordatorio: "danger" };
  const sorted = [...events].sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));

  React.useEffect(() => {
    let active = true;
    supabase.from("events").select("*").then(({ data, error }) => {
      if (!active) return;
      if (!error && data) setEvents(data);
      setLoading(false);
    }).catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const saveNew = async () => {
    if (!form.titulo.trim() || !form.fecha) return;
    const nuevo = { id: `E-${Date.now()}`, titulo: form.titulo.trim(), tipo: form.tipo, fecha: form.fecha, hora: form.hora || "09:00" };
    const { data, error } = await supabase.from("events").insert(nuevo).select();
    if (!error && data && data[0]) setEvents((prev) => [...prev, data[0]]);
    else setEvents((prev) => [...prev, nuevo]);
    setForm(blankForm);
    setAdding(false);
  };

  return (
    <div className="jgb-fade">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
        <h2 className="text-2xl font-bold">Calendario</h2>
        <PrimaryBtn onClick={() => setAdding(true)}><Plus size={14} className="inline -mt-0.5 mr-1" />Nuevo evento</PrimaryBtn>
      </div>
      <p className="text-sm mb-5" style={{ color: C.muted }}>{loading ? "Cargando…" : "Citas, entregas, revisiones y recordatorios."}</p>
      <div className="flex gap-2 mb-5">
        {["Día", "Semana", "Mes"].map((v) => (
          <button key={v} onClick={() => setView(v)} className="px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: view === v ? C.accent : C.surface, color: view === v ? "#161207" : C.muted, border: `1px solid ${view === v ? C.accent : C.border}` }}>{v}</button>
        ))}
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        {sorted.map((e) => (
          <div key={e.id} className="jgb-row flex items-center gap-4 px-4 py-3" style={{ borderTop: `1px solid ${C.border}`, background: C.surface }}>
            <div className="text-center" style={{ width: 56 }}>
              <div className="jgb-display font-bold text-lg leading-none">{new Date(e.fecha).getDate()}</div>
              <div className="text-[10px]" style={{ color: C.mutedDim }}>{new Date(e.fecha).toLocaleDateString("es-ES", { month: "short" })}</div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{e.titulo}</div>
              <div className="text-xs" style={{ color: C.mutedDim }}>{e.hora}</div>
            </div>
            <Badge tone={tipoTone[e.tipo] || "neutral"}>{e.tipo}</Badge>
          </div>
        ))}
      </div>
      <Modal open={adding} onClose={() => setAdding(false)} title="Nuevo evento">
        <Field label="Título"><input style={inputStyle} value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></Field>
        <Field label="Tipo">
          <select style={inputStyle} value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
            {["Cita", "Entrega", "Revisión", "Reunión", "Recordatorio"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Fecha"><input type="date" style={inputStyle} value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} /></Field>
          <Field label="Hora"><input type="time" style={inputStyle} value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} /></Field>
        </div>
        <PrimaryBtn full onClick={saveNew}>Guardar evento</PrimaryBtn>
      </Modal>
    </div>
  );
}

/* ============================================================
   COMUNICACIONES
   ============================================================ */
function Comunicaciones({ worker }) {
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [txt, setTxt] = useState("");

  React.useEffect(() => {
    let active = true;
    supabase.from("messages").select("*").order("created_at", { ascending: false }).then(({ data, error }) => {
      if (!active) return;
      if (!error && data) setMsgs(data);
      setLoading(false);
    }).catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const send = async () => {
    if (!txt.trim()) return;
    const fechaLegible = new Date().toLocaleString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    const nuevo = { id: `M-${Date.now()}`, de: worker.name, texto: txt, fecha: fechaLegible, tipo: "Equipo" };
    setMsgs([nuevo, ...msgs]);
    setTxt("");
    await supabase.from("messages").insert(nuevo);
  };
  return (
    <div className="jgb-fade">
      <h2 className="text-2xl font-bold mb-1">Comunicaciones</h2>
      <p className="text-sm mb-5" style={{ color: C.muted }}>{loading ? "Cargando…" : "Mensajes internos y avisos generales."}</p>
      <div className="rounded-xl p-4 mb-4 flex gap-2" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <input style={inputStyle} placeholder="Escribe un mensaje al equipo…" value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
        <PrimaryBtn onClick={send}><Send size={14} /></PrimaryBtn>
      </div>
      <div className="space-y-3">
        {msgs.map((m) => (
          <div key={m.id} className="rounded-xl p-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-sm font-bold">{m.de}</div>
              <div className="flex items-center gap-2">
                <Badge tone={m.tipo === "Aviso general" ? "warn" : "accent"}>{m.tipo}</Badge>
                <span className="text-xs" style={{ color: C.mutedDim }}>{m.fecha}</span>
              </div>
            </div>
            <div className="text-sm" style={{ color: C.muted }}>{m.texto}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   PERFIL / CONFIGURACIÓN
   ============================================================ */
function Perfil({ worker }) {
  const [form, setForm] = useState({ name: worker.name, email: worker.email, phone: worker.phone, cargo: worker.cargo });
  const [pass, setPass] = useState({ actual: "", nueva: "", confirmar: "" });
  const [notifs, setNotifs] = useState({ email: true, app: true, sms: false });
  const [saved, setSaved] = useState(false);

  return (
    <div className="jgb-fade" style={{ maxWidth: 560 }}>
      <h2 className="text-2xl font-bold mb-1">Perfil</h2>
      <p className="text-sm mb-6" style={{ color: C.muted }}>{worker.role} · {worker.cargo}</p>
      <div className="rounded-xl p-5 mb-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full flex items-center justify-center font-bold text-lg" style={{ width: 52, height: 52, background: C.accent, color: "#161207" }}>
            {worker.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <GhostBtn>Cambiar foto</GhostBtn>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <Field label="Nombre"><input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Cargo"><input style={inputStyle} value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} /></Field>
          <Field label="Email"><input style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Teléfono"><input style={inputStyle} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
        </div>
        <PrimaryBtn onClick={() => setSaved(true)}>Guardar cambios</PrimaryBtn>
        {saved && <span className="text-xs ml-3" style={{ color: C.success }}>Guardado (demo).</span>}
      </div>
      <div className="rounded-xl p-5 mb-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <div className="font-bold text-sm mb-3">Cambiar contraseña</div>
        <Field label="Contraseña actual"><input type="password" style={inputStyle} value={pass.actual} onChange={(e) => setPass({ ...pass, actual: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nueva contraseña"><input type="password" style={inputStyle} value={pass.nueva} onChange={(e) => setPass({ ...pass, nueva: e.target.value })} /></Field>
          <Field label="Confirmar"><input type="password" style={inputStyle} value={pass.confirmar} onChange={(e) => setPass({ ...pass, confirmar: e.target.value })} /></Field>
        </div>
        <GhostBtn>Actualizar contraseña</GhostBtn>
      </div>
      <div className="rounded-xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <div className="font-bold text-sm mb-3">Preferencias de notificaciones</div>
        {[["email", "Por email"], ["app", "En la aplicación"], ["sms", "Por SMS"]].map(([k, l]) => (
          <label key={k} className="flex items-center justify-between py-2 text-sm" style={{ borderTop: `1px solid ${C.border}` }}>
            {l}
            <input type="checkbox" checked={notifs[k]} onChange={(e) => setNotifs({ ...notifs, [k]: e.target.checked })} />
          </label>
        ))}
      </div>
    </div>
  );
}

function Configuracion({ worker }) {
  const [users, setUsers] = useState(WORKERS);
  return (
    <div className="jgb-fade">
      <h2 className="text-2xl font-bold mb-1">Configuración</h2>
      <p className="text-sm mb-6" style={{ color: C.muted }}>Solo visible para el rol Administrador.</p>
      <div className="rounded-xl p-5 mb-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between mb-4">
          <div className="font-bold text-sm">Usuarios y roles</div>
          <PrimaryBtn><Plus size={14} className="inline -mt-0.5 mr-1" />Nuevo usuario</PrimaryBtn>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs" style={{ color: C.mutedDim }}>
            <th className="py-2">Nombre</th><th className="py-2">Usuario</th><th className="py-2">Rol</th><th className="py-2">Cargo</th><th className="py-2"></th>
          </tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderTop: `1px solid ${C.border}` }}>
                <td className="py-2.5 font-semibold">{u.name}</td>
                <td className="py-2.5" style={{ color: C.muted }}>{u.username}</td>
                <td className="py-2.5"><Badge tone="accent">{u.role}</Badge></td>
                <td className="py-2.5" style={{ color: C.muted }}>{u.cargo}</td>
                <td className="py-2.5">
                  <button disabled={u.id === worker.id} onClick={() => setUsers(users.filter((x) => x.id !== u.id))}
                    style={{ color: u.id === worker.id ? C.mutedDim : C.danger }}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <div className="font-bold text-sm mb-3">Roles y permisos</div>
        {[
          ["Administrador", "Acceso completo: usuarios, contabilidad, vehículos, clientes, documentos y estadísticas."],
          ["Gerente", "Acceso amplio a gestión empresarial, con restricciones sobre administración de usuarios."],
          ["Trabajador", "Acceso a las herramientas y módulos necesarios para su día a día."],
        ].map(([r, d]) => (
          <div key={r} className="py-2.5" style={{ borderTop: `1px solid ${C.border}` }}>
            <div className="text-sm font-semibold">{r}</div>
            <div className="text-xs" style={{ color: C.muted }}>{d}</div>
          </div>
        ))}
        <div className="text-xs mt-3" style={{ color: C.mutedDim }}>La gestión de permisos granular por módulo requiere conectar la aplicación a una base de datos real (ver nota técnica al pie de la aplicación).</div>
      </div>
    </div>
  );
}

/* ============================================================
   PRIVATE SHELL
   ============================================================ */
function PrivateArea({ worker, onLogout, vehicles, vehiclesLoading, addVehicle, deleteVehicle, updateVehicle }) {
  const [page, setPage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const pages = {
    dashboard: <DashboardHome worker={worker} />,
    contabilidad: <Contabilidad vehicles={vehicles} />,
    vehiculos: <Vehiculos vehicles={vehicles} vehiclesLoading={vehiclesLoading} addVehicle={addVehicle} deleteVehicle={deleteVehicle} updateVehicle={updateVehicle} />,
    clientes: <Clientes />,
    tareas: <Tareas />,
    documentos: <Documentos />,
    herramientas: <Herramientas />,
    calendario: <Calendario />,
    comunicaciones: <Comunicaciones worker={worker} />,
    perfil: <Perfil worker={worker} />,
    configuracion: <Configuracion worker={worker} />,
  };
  const allowed = MENU.find((m) => m.key === page)?.restrict;
  const view = (allowed && !allowed.includes(worker.role)) ? <DashboardHome worker={worker} /> : pages[page];

  return (
    <div className="jgb-root flex" style={{ minHeight: "100vh" }}>
      <Sidebar page={page} setPage={setPage} role={worker.role} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar worker={worker} setMobileOpen={setMobileOpen} onLogout={onLogout} setPage={setPage} />
        <div className="flex-1 p-5 md:p-7 jgb-scroll overflow-y-auto jgb-printable-page">
          {view}
          <div className="mt-10 pt-5 text-xs no-print" style={{ borderTop: `1px solid ${C.border}`, color: C.mutedDim }}>
            Datos de demostración con fines ilustrativos. Esta es una aplicación frontend: para producción se necesita conectar una base de datos real (usuarios, roles, vehículos, clientes, facturas, documentos), un backend con autenticación segura (hash de contraseñas, sesiones/JWT) y almacenamiento de archivos.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */
export default function JGBCarsApp() {
  const [mode, setMode] = useState("public"); // public | login | private
  const [worker, setWorker] = useState(null);
  const [vehicles, setVehicles] = useState(VEHICLES);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);

  React.useEffect(() => {
    let active = true;
    supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (!error && data) {
          // Si la consulta funciona, usamos exactamente lo que hay en la base de
          // datos, aunque esté vacía (por ejemplo, si se han borrado todos los
          // vehículos a propósito). Solo si hay un error real de conexión nos
          // quedamos con los datos de demostración como respaldo.
          setVehicles(data.map(dbRowToVehicle));
        }
        setVehiclesLoading(false);
      })
      .catch(() => {
        // Sin conexión con Supabase: seguimos mostrando los datos de demostración
        // en vez de dejar la pantalla cargando para siempre.
        if (active) setVehiclesLoading(false);
      });
    return () => { active = false; };
  }, []);

  const addVehicle = async (v) => {
    const { data, error } = await supabase.from("vehicles").insert(vehicleToDbRow(v)).select();
    if (!error && data && data[0]) {
      setVehicles((prev) => [dbRowToVehicle(data[0]), ...prev]);
    } else {
      // Si falla la conexión con la base de datos, lo añadimos igualmente
      // en memoria para que no se pierda el trabajo de quien lo está usando.
      setVehicles((prev) => [v, ...prev]);
    }
  };

  const deleteVehicle = async (id) => {
    setVehicles((prev) => prev.filter((x) => x.id !== id));
    await supabase.from("vehicles").delete().eq("id", id);
  };

  const updateVehicle = async (v) => {
    setVehicles((prev) => prev.map((x) => (x.id === v.id ? v : x)));
    await supabase.from("vehicles").update(vehicleToDbRow(v)).eq("id", v.id);
  };

  return (
    <>
      <GlobalStyle />
      {mode === "public" && <PublicSite onGoLogin={() => setMode("login")} vehicles={vehicles} />}
      {mode === "login" && <LoginScreen onBack={() => setMode("public")} onLogin={(w) => { setWorker(w); setMode("private"); }} />}
      {mode === "private" && worker && (
        <PrivateArea
          worker={worker}
          onLogout={() => { setWorker(null); setMode("public"); }}
          vehicles={vehicles}
          vehiclesLoading={vehiclesLoading}
          addVehicle={addVehicle}
          deleteVehicle={deleteVehicle}
          updateVehicle={updateVehicle}
        />
      )}
    </>
  );
}
